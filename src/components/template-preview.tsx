import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Download, Lock, CreditCard, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getTemplateById, isTemplateUnlocked } from "@/lib/template-manager";
import { addToRecentTemplates } from "@/lib/template-download";

interface TemplatePreviewProps {
  templateId: string | null;
  onClose: () => void;
  onDownload: (templateId: string) => void;
  onUnlock: (templateId: string) => void;
}

export function TemplatePreview({ templateId, onClose, onDownload, onUnlock }: TemplatePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Track template view when template ID changes
  useEffect(() => {
    if (templateId) {
      // Add to recently viewed templates
      addToRecentTemplates(templateId);
    }
  }, [templateId]);
  
  if (!templateId) return null;
  
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  const isUnlocked = isTemplateUnlocked(templateId);
  const previewUrl = `/templates/${template.type}/${template.id}/index.html`;
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const getDeviceClass = () => {
    switch (currentDevice) {
      case "desktop":
        return "w-full h-[600px]";
      case "tablet":
        return "w-[768px] h-[600px]";
      case "mobile":
        return "w-[375px] h-[600px]";
      default:
        return "w-full h-[600px]";
    }
  };
  
  return (
    <Dialog open={!!templateId} onOpenChange={() => onClose()}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] h-[90vh]' : 'max-w-5xl'} p-0 overflow-hidden`}>
        <DialogHeader className="p-4 flex flex-row items-center justify-between border-b">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2">
              {template.name}
              {template.premium && (
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs py-0.5 px-2 rounded-full">
                  Premium
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {template.layout?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Layout
            </DialogDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex border rounded-lg overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-none ${currentDevice === 'desktop' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                onClick={() => setCurrentDevice("desktop")}
              >
                Desktop
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-none ${currentDevice === 'tablet' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                onClick={() => setCurrentDevice("tablet")}
              >
                Tablet
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-none ${currentDevice === 'mobile' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                onClick={() => setCurrentDevice("mobile")}
              >
                Mobile
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 overflow-auto h-full">
          <div className={`transition-all duration-300 ${getDeviceClass()} bg-white dark:bg-slate-900 overflow-hidden rounded-lg shadow-lg`}>
            {isUnlocked ? (
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-0"
                title={`Preview of ${template.name}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <Lock className="h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Template</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                  This is a premium template. Unlock it to view the full preview and download the template files.
                </p>
                <Button 
                  onClick={() => onUnlock(templateId)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Unlock Premium Template
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {isUnlocked && (
          <div className="p-4 border-t flex justify-between items-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {template.features?.join(' • ')}
            </div>
            
            <Button 
              onClick={() => onDownload(templateId)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
