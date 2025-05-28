import React from "react";
import { motion } from "framer-motion";
import { Lock, Eye, Download, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { TemplateMetadata, isTemplateUnlocked, getUserUnlockedTemplates, downloadTemplate, purchaseTemplate } from "@/lib/template-manager";
import { useState } from "react";
import { useUser } from "@/lib/auth";

interface TemplateCardProps {
  template: TemplateMetadata;
  onPreview: (templateId: string) => void;
  onDownload: (templateId: string) => void;
  onUnlock: (templateId: string) => void;
}

export function TemplateCard({ template, onPreview, onDownload, onUnlock }: TemplateCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  
  const isUnlocked = isTemplateUnlocked(template.id);
  const unlockedTemplates = getUserUnlockedTemplates();
  
  // Get thumbnail URL
  const imageUrl = template.thumbnailUrl || 
    `/templates/${template.type === 'free' ? 'Free Templates' : 'Premium Templates'}/${template.id}/thumbnail.jpg`;
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
  };
  
  const handleUnlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      // Redirect to login or show login modal
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
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative">
          {/* Template Preview Image */}
          <div className={`aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden ${template.premium && !isUnlocked ? "filter blur-sm" : ""}`}>
            <img 
              src={imageUrl} 
              alt={template.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback for missing images
                (e.target as HTMLImageElement).src = `/templates/placeholder.jpg`;
              }}
            />
          </div>
          
          {/* Premium Badge */}
          {template.premium && (
            <Badge 
              className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          
          {/* Free Badge */}
          {!template.premium && (
            <Badge 
              className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Free
            </Badge>
          )}
          
          {/* Unlocked Badge */}
          {template.premium && isUnlocked && (
            <Badge 
              className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Unlocked
            </Badge>
          )}
          
          {/* Lock Overlay for Premium Templates */}
          {template.premium && !isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Lock className="h-10 w-10 text-white" />
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow p-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{template.name}</h3>
          {template.category && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              {template.category}
            </p>
          )}
          {template.layout && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {template.layout.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Layout
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {template.features?.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-slate-100 dark:bg-slate-800"
              >
                {typeof feature === 'string' ? 
                  feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 
                  'Feature'}
              </Badge>
            ))}
            {template.features && template.features.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs bg-slate-100 dark:bg-slate-800"
              >
                +{template.features.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 gap-2 flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onPreview(template.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View a live preview of this template</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {isUnlocked ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => onDownload(template.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download this template as a ZIP file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    onClick={() => onUnlock(template.id)}
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Unlock
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Unlock this premium template</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
