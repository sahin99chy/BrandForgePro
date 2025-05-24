import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Users, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAnalytics } from "@/hooks/use-analytics";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HeroSectionProps {
  onGenerate: (idea: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function HeroSection({ onGenerate, isLoading, error }: HeroSectionProps) {
  const [idea, setIdea] = useState("");
  const { pageViews } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    await onGenerate(idea);
  };

  return (
    <section className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Transform Ideas into{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Compelling Copy
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Generate complete landing page copy for your startup in seconds. From headlines to features, powered by AI.
          </p>
          
          {/* Analytics Counter */}
          <motion.div 
            className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-200 dark:border-slate-700 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {pageViews.toLocaleString()} pages generated today
            </span>
          </motion.div>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="startup-idea" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                Describe your startup idea
              </Label>
              <Textarea
                id="startup-idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Example: A tool that helps YouTubers instantly create thumbnails using AI and trending design styles..."
                className="w-full h-32 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-all duration-200"
                disabled={isLoading}
              />
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Be specific about your target audience and unique value proposition for best results.
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit"
              disabled={!idea.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>{isLoading ? "Generating..." : "Generate Brand Page"}</span>
              </span>
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
