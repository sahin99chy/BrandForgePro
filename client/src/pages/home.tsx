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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, templateType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate content");
      }

      const content = await response.json();
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
