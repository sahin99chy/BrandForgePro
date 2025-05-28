import React, { useEffect, useState, useCallback } from "react";
import { X, Download, Lock, ArrowLeft, ArrowRight, ExternalLink, Loader2, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { TemplateMetadata, isTemplateUnlocked, downloadTemplate, purchaseTemplate } from "@/lib/template-manager";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/lib/auth";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateMetadata | null;
  onDownload?: (templateId: string) => void;
  onUnlock?: (templateId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  onDownload,
  onUnlock,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: TemplatePreviewModalProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "details">("preview");
  const { toast } = useToast();
  const { user } = useUser();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!template) return;
    
    setIsLoading(true);
    try {
      const success = await downloadTemplate(template);
      if (success) {
        toast({
          title: 'Download started',
          description: `${template.name} is being downloaded.`,
        });
        onDownload?.(template.id);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Could not download the template. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [template, onDownload, toast]);
  
  const handleUnlock = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!template) return;
    
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to unlock premium templates.',
        variant: 'default',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await purchaseTemplate(template.id);
      if (success) {
        toast({
          title: 'Template unlocked!',
          description: `You can now download ${template.name}.`,
        });
        onUnlock?.(template.id);
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Purchase failed',
        description: 'Could not complete the purchase. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [template, user, onUnlock, toast]);

  if (!template) return null;

  const isUnlocked = isTemplateUnlocked(template.id);
  const previewUrl = template.previewUrl || 
    `/templates/${template.type === 'free' ? 'Free Templates' : 'Premium Templates'}/${template.id}/index.html`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b p-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">{template.name}</DialogTitle>
            <div className="flex items-center gap-2">
              {template.premium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600">
                  {isUnlocked ? 'Unlocked' : 'Premium'}
                </Badge>
              )}
              {!template.premium && (
                <Badge className="bg-gradient-to-r from-green-500 to-green-600">
                  Free
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Preview Pane */}
          <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900">
            <div className="border-b border-slate-200 dark:border-slate-800 p-2 flex justify-between items-center">
              <div className="flex space-x-1">
                <Button
                  variant={activeTab === "preview" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("preview")}
                >
                  Preview
                </Button>
                <Button
                  variant={activeTab === "details" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {activeTab === "preview" ? (
                <div className="w-full h-full flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-inner">
                  {isClient && (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full min-h-[60vh] border-0 rounded"
                      title={`${template.name} Preview`}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Template Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                        <p>{template.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Type</p>
                        <p>{template.type === 'free' ? 'Free' : 'Premium'}</p>
                      </div>
                      {template.category && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Category</p>
                          <p>{template.category}</p>
                        </div>
                      )}
                      {template.layout && (
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Layout</p>
                          <p>{template.layout.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {template.features && template.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {template.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <Star className="h-4 w-4 mt-0.5 mr-2 text-amber-500 flex-shrink-0" />
                            <span>{typeof feature === 'string' ? 
                              feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
                              'Feature'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Actions</p>
                    <div className="flex flex-col space-y-2">
                      {!template.premium || isUnlocked ? (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          onClick={handleDownload}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Preparing...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download Template
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                          onClick={handleUnlock}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Unlock for ${template.premium ? '9.99' : '0'}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!hasPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Previous template"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${!hasNext ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Next template"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
