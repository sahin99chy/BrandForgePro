import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRequestSchema, generatedContentSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.API_KEY 
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/generate", async (req, res) => {
    try {
      const { idea } = generateRequestSchema.parse(req.body);

      const systemPrompt = `You are an expert landing page copywriter. Based on a startup idea, return JSON with:
- headline: A compelling, attention-grabbing headline (startup-style)
- subheadline: A value-driven subheadline that explains the benefit
- features: An array of exactly 3 feature objects, each with "title" and "description"
- cta: A compelling call-to-action button text
- colorPalette: An array of exactly 3 hex color codes that work well together
- emojiStyle: A string of 3 relevant emojis
- brandTone: A brief description of the suggested brand tone (e.g., "Professional & Trustworthy", "Fun & Bold", etc.)

Your tone should match the startup idea. Make the copy persuasive and conversion-focused.`;

      const userPrompt = `Create landing page copy for this startup idea: ${idea}`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 1000,
      });

      const generatedText = response.choices[0].message.content;
      if (!generatedText) {
        throw new Error("No content generated from OpenAI");
      }

      const generatedContent = JSON.parse(generatedText);
      
      // Validate the generated content matches our schema
      const validatedContent = generatedContentSchema.parse(generatedContent);

      // Store the generation in memory
      await storage.createBrandGeneration({
        idea,
        generated_content: validatedContent,
      });

      res.json(validatedContent);
    } catch (error) {
      console.error("Generation error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          res.status(401).json({ 
            message: "OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable." 
          });
        } else if (error.message.includes("quota") || error.message.includes("billing")) {
          res.status(402).json({ 
            message: "OpenAI API quota exceeded. Please check your billing settings." 
          });
        } else if (error.message.includes("rate limit")) {
          res.status(429).json({ 
            message: "Rate limit exceeded. Please try again in a moment." 
          });
        } else {
          res.status(500).json({ 
            message: "Failed to generate content. Please try again." 
          });
        }
      } else {
        res.status(500).json({ 
          message: "An unexpected error occurred. Please try again." 
        });
      }
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      const generations = await storage.getBrandGenerations();
      res.json({ 
        totalGenerations: generations.length,
        todayGenerations: generations.length // Simplified for demo
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
