import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { OutputSection } from "@/components/output-section";
import { LoadingState } from "@/components/loading-state";
import { FloatingExport } from "@/components/floating-export";
import { Footer } from "@/components/footer";
import { useState } from "react";
import { motion } from "framer-motion";
import type { GeneratedContent } from "@shared/schema";

export default function Home() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (idea: string, templateType: string = "general") => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Template-specific prompt modifiers
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

      const systemPrompt = `You are an expert copywriter specializing in startup landing pages. Create compelling, conversion-focused copy that includes:

1. A powerful headline (8-12 words)
2. A compelling subheadline (15-25 words)
3. 4 key features/benefits
4. A strong call-to-action
5. 4 specific benefits with metrics when possible

${templateModifier} Make the copy persuasive and conversion-focused.

Respond with JSON in this exact format:
{
  "headline": "string",
  "subheadline": "string", 
  "features": ["string", "string", "string", "string"],
  "cta": "string",
  "benefits": ["string", "string", "string", "string"]
}`;

      const userPrompt = `Create landing page copy for this startup idea: ${idea}`;

      // Use Puter.js AI directly
      const response = await (window as any).puter.ai.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ], {
        model: "gpt-4o",
        response_format: { type: "json_object" }
      });

      const generatedText = response.message.content;
      const parsedContent = JSON.parse(generatedText);

      const content = {
        headline: parsedContent.headline,
        subheadline: parsedContent.subheadline,
        features: parsedContent.features,
        cta: parsedContent.cta,
        benefits: parsedContent.benefits
      };

      setGeneratedContent(content);
      
      // Scroll to output section after content is set
      setTimeout(() => {
        document.getElementById("output-section")?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <Header />
      
      <main className="relative">
        <HeroSection onGenerate={handleGenerate} isLoading={isLoading} error={error} />
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingState />
          </motion.div>
        )}
        
        {generatedContent && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            id="output-section"
          >
            <OutputSection content={generatedContent} />
          </motion.div>
        )}
      </main>

      {generatedContent && <FloatingExport content={generatedContent} />}
      
      <Footer />
    </div>
  );
}
