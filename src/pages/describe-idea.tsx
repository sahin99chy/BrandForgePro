import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowRight, Lightbulb, Brain } from "lucide-react";
import { useLocation } from "wouter";
import type { GeneratedContent } from "@shared/schema";
import { generateBrandWithRealTemplate } from "@/lib/template-integration";
import { TemplateSelector } from "@/components/template-selector";

export default function DescribeIdea() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [idea, setIdea] = useState("");
  const [templateType, setTemplateType] = useState("general");
  const [error, setError] = useState<string | null>(null);
  
  const handleNextStep = () => {
    if (idea.trim().length < 10) {
      toast({
        title: "Please provide more details",
        description: "Your idea description should be at least 10 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setStep(2);
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  // Function to generate content with real templates
  const generateContent = async (idea: string, templateType: string): Promise<GeneratedContent> => {
    // Use the new template integration system
    return await generateBrandWithRealTemplate(idea, templateType);
  };

  const handleGenerate = async () => {
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
        console.error("Error generating content:", err);
        throw err;
      }
      
      // Store the generated content and original inputs in localStorage for the generated page to use
      localStorage.setItem("generatedContent", JSON.stringify(content));
      localStorage.setItem("originalIdea", idea);
      localStorage.setItem("originalTemplateType", templateType);
      
      // Navigate to the generated brand page
      navigate("/generated-brand");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Describe Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Startup Idea</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Tell us about your vision, and we'll create a complete brand identity for your startup
            </p>
          </motion.div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <Lightbulb className={`w-5 h-5 ${step === 1 ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                </div>
                <div className={`h-1 w-16 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  <Brain className={`w-5 h-5 ${step === 2 ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                </div>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Step {step} of 2
              </div>
            </div>
            
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="idea" className="text-lg font-medium mb-2 block">
                      Describe your startup idea in detail
                    </Label>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      The more details you provide, the better results you'll get. Include your target audience, key features, and what makes your idea unique.
                    </p>
                    <Textarea 
                      id="idea"
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="e.g., I'm creating a subscription service that delivers personalized plant care kits to urban dwellers who want to grow indoor plants but don't know how to care for them properly. Each kit includes seasonal plants, custom soil mixes, and care instructions based on the customer's living space and experience level."
                      className="min-h-[200px] text-base border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="lg"
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-medium mb-2 block">
                      Select your business category
                    </Label>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      This helps us tailor the brand identity to your specific industry.
                    </p>
                    
                    <TemplateSelector 
                      selectedTemplate={templateType}
                      onTemplateSelect={(templateId) => setTemplateType(templateId)}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                      className="border-slate-300 dark:border-slate-600"
                    >
                      Back
                    </Button>
                    
                    <Button 
                      onClick={handleGenerate}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>Generating...</>
                      ) : (
                        <>
                          Generate Brand
                          <Sparkles className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
