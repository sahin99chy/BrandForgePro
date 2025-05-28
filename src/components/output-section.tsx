import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Brain, Palette, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedContent } from "@shared/schema";

interface OutputSectionProps {
  content: GeneratedContent;
}

export function OutputSection({ content }: OutputSectionProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const copyAllContent = async () => {
    const allText = `
Headline: ${content.headline}

Subheadline: ${content.subheadline}

Features:
${content.features.map(f => `${f.title}: ${f.description}`).join('\n')}

Call to Action: ${content.cta}

Brand Tone: ${content.brandTone}
Emoji Style: ${content.emojiStyle}
Color Palette: ${content.colorPalette.join(', ')}
    `;
    
    await copyToClipboard(allText, "All content");
  };

  const featureIcons = [Brain, Palette, TrendingUp];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <Card className="bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Output Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Generated Landing Page Copy
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAllContent}
                className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Headline Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Headline
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.headline, "Headline")}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              {content.headline}
            </h1>
          </motion.div>

          {/* Subheadline Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Subheadline
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.subheadline, "Subheadline")}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {content.subheadline}
            </p>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Features
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(
                  content.features.map(f => `${f.title}: ${f.description}`).join('\n'),
                  "All features"
                )}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {content.features.map((feature, index) => {
                const IconComponent = featureIcons[index] || Brain;
                return (
                  <motion.div
                    key={index}
                    className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Call to Action
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.cta, "Call to Action")}
                className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-center">
              <Button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-slate-50 transition-colors shadow-lg">
                {content.cta}
              </Button>
            </div>
          </motion.div>

          {/* Bonus Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
              Bonus Suggestions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Brand Tone</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{content.brandTone}</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Emoji Style</h4>
                <p className="text-2xl">{content.emojiStyle}</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Color Palette</h4>
                <div className="flex space-x-2">
                  {content.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </section>
  );
}
