import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Code, FileText, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedContent } from "@shared/schema";

interface FloatingExportProps {
  content: GeneratedContent;
}

export function FloatingExport({ content }: FloatingExportProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
      toast({
        title: "Copied!",
        description: "JSON data copied to clipboard",
      });
      setIsMenuOpen(false);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const downloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.headline}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, ${content.colorPalette[0]} 0%, ${content.colorPalette[1]} 50%, ${content.colorPalette[2]} 100%); }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <header class="gradient-bg text-white py-20 text-center">
            <h1 class="text-5xl font-bold mb-4">${content.headline}</h1>
            <p class="text-xl opacity-90 max-w-2xl mx-auto">${content.subheadline}</p>
        </header>
        
        <section class="py-20 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="grid md:grid-cols-3 gap-8 mb-16">
                    ${content.features.map(feature => `
                        <div class="bg-white p-6 rounded-lg shadow-lg">
                            <h3 class="text-xl font-semibold mb-3">${feature.title}</h3>
                            <p class="text-gray-600">${feature.description}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center">
                    <button class="gradient-bg text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity">
                        ${content.cta}
                    </button>
                </div>
            </div>
        </section>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${content.headline.toLowerCase().replace(/\s+/g, '-')}-landing-page.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "HTML file has been downloaded",
    });
    setIsMenuOpen(false);
  };

  const openPreview = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-200"
            size="icon"
          >
            <Download className="w-6 h-6" />
          </Button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-16 right-0 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden min-w-48"
              >
                <Button
                  variant="ghost"
                  onClick={copyJSON}
                  className="w-full justify-start px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-none"
                >
                  <Code className="w-4 h-4 mr-3 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Copy as JSON</span>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={downloadHTML}
                  className="w-full justify-start px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-none"
                >
                  <FileText className="w-4 h-4 mr-3 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Download HTML</span>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={openPreview}
                  className="w-full justify-start px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-none"
                >
                  <ExternalLink className="w-4 h-4 mr-3 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Preview Page</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Export Options
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-6 h-6" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-6">
            <Card 
              className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              onClick={copyJSON}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">JSON Format</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Copy structured data for integration</p>
                </div>
              </div>
            </Card>
            
            <Card 
              className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              onClick={downloadHTML}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">HTML File</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Download ready-to-use landing page</p>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
