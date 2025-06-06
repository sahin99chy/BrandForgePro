import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRequestSchema, generatedContentSchema } from "@shared/schema";

// Google Gemini API configuration
const GEMINI_API_KEY = "AIzaSyBSUjP1PK7uSDT-O-LW6OwRmCOkEmXqvyI";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const { idea, templateType } = generateRequestSchema.parse(req.body);

      // Get template-specific prompt modifiers
      const templatePrompts = {
        saas: "Focus on scalability, efficiency, and user productivity. Use tech-savvy language and emphasize ROI.",
        ecommerce: "Highlight product quality, customer satisfaction, and shopping convenience. Use action-oriented language.",
        agency: "Emphasize expertise, results, and professional partnerships. Use confident, authority-building language.",
        app: "Focus on user experience, convenience, and mobile-first features. Use modern, trendy language.",
        health: "Prioritize trust, safety, and wellness benefits. Use caring, professional language.",
        education: "Emphasize learning outcomes, skill development, and knowledge growth. Use encouraging, supportive language.",
        food: "Highlight taste, quality, and dining experience. Use appetizing, sensory language.",
        tech: "Focus on innovation, cutting-edge technology, and future solutions. Use forward-thinking language.",
        general: "Use versatile, engaging language that works for any business type."
      };

      const templateModifier = templatePrompts[templateType as keyof typeof templatePrompts] || templatePrompts.general;

      const systemPrompt = `You are an expert landing page copywriter. Based on a startup idea, return JSON with:
- headline: A compelling, attention-grabbing headline (startup-style)
- subheadline: A value-driven subheadline that explains the benefit
- features: An array of exactly 3 feature objects, each with "title" and "description"
- cta: A compelling call-to-action button text
- colorPalette: An array of exactly 3 hex color codes that work well together
- emojiStyle: A string of 3 relevant emojis
- brandTone: A brief description of the suggested brand tone (e.g., "Professional & Trustworthy", "Fun & Bold", etc.)

${templateModifier} Make the copy persuasive and conversion-focused.`;

      const userPrompt = `Create landing page copy for this startup idea: ${idea}`;

      // Using Google Gemini API for content generation
      console.log('Making request to Gemini API...');
      console.log('API Key exists:', !!GEMINI_API_KEY);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1000,
          }
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      if (!generatedText) {
        throw new Error("No content generated from Gemini");
      }

      const generatedContent = JSON.parse(generatedText);

      // Validate the generated content matches our schema
      const validatedContent = generatedContentSchema.parse(generatedContent);

      // Store the generation in memory
      await storage.createBrandGeneration({
        idea,
        generated_content: validatedContent,
        template_type: templateType,
        created_at: new Date().toISOString(),
        user_id: null, // For now, no user authentication
      });

      res.json(validatedContent);
    } catch (error) {
      console.error("Generation error:", error);

      if (error instanceof Error) {
        if (error.message.includes("API key") || error.message.includes("401")) {
          res.status(401).json({
            message: "DeepSeek API key not configured. Please check your API key.",
          });
        } else if (error.message.includes("quota") || error.message.includes("billing") || error.message.includes("429")) {
          res.status(402).json({
            message: "API quota exceeded. Please check your billing settings.",
          });
        } else if (error.message.includes("rate limit")) {
          res.status(429).json({
            message: "Rate limit exceeded. Please try again in a moment.",
          });
        } else {
          res.status(500).json({
            message: "Failed to generate content. Please try again.",
          });
        }
      } else {
        res.status(500).json({
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      const generations = await storage.getBrandGenerations();
      res.json({
        totalGenerations: generations.length,
        todayGenerations: generations.length, // Simplified for demo
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
