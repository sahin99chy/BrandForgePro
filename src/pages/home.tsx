import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { OutputSection } from "@/components/output-section";
import { LoadingState } from "@/components/loading-state";
import { FloatingExport } from "@/components/floating-export";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import type { GeneratedContent } from "@shared/schema";
import { generateBrandWithRealTemplate } from "@/lib/template-integration";

export default function Home() {
  const [location, navigate] = useLocation();
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to generate content with real templates
  const generateContent = async (idea: string, templateType: string): Promise<GeneratedContent> => {
    // Use the new template integration system
    return await generateBrandWithRealTemplate(idea, templateType);
  };

  const handleGenerate = async (idea: string, templateType: string = "general") => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from the API
      let content;
      
      try {
        // Try to fetch from the API first
        try {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea, templateType }),
          });

          if (!response.ok) {
            throw new Error("API request failed");
          }

          content = await response.json();
        } catch (apiError) {
          console.log("API error, using real template integration", apiError);
          // If API fails, use our real template integration
          content = await generateContent(idea, templateType);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
      
      // Store the generated content and original inputs in localStorage for the generated page to use
      localStorage.setItem("generatedContent", JSON.stringify(content));
      localStorage.setItem("originalIdea", idea);
      localStorage.setItem("originalTemplateType", templateType);
      
      // Navigate to the generated brand page for the full experience
      navigate("/generated-brand");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <Header />
      
      <HeroSection 
        onGenerate={handleGenerate}
        isLoading={isLoading}
        error={error}
      />
      
      <HowItWorks />
      
      {isLoading && (
        <div id="output-section">
          <LoadingState />
        </div>
      )}
      
      {generatedContent && !isLoading && (
        <div id="output-section">
          <OutputSection content={generatedContent} />
        </div>
      )}
      
      {generatedContent && (
        <FloatingExport content={generatedContent} />
      )}
      
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Create Your Brand Identity?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start building your professional brand page in minutes with our AI-powered platform.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/describe-idea")}
              className="bg-white hover:bg-slate-100 text-blue-600 hover:text-blue-700 text-lg px-8 py-6"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
