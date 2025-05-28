import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Settings, Crown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateMetadata, getUserUnlockedTemplates, getTemplateById } from "@/lib/template-manager";
import { useToast } from "@/hooks/use-toast";

interface UserDashboardProps {
  onPreview: (templateId: string) => void;
  onDownload: (templateId: string) => void;
}

export function UserDashboard({ onPreview, onDownload }: UserDashboardProps) {
  const [unlockedTemplates, setUnlockedTemplates] = useState<TemplateMetadata[]>([]);
  const [recentTemplates, setRecentTemplates] = useState<TemplateMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load unlocked templates on component mount
  useEffect(() => {
    loadUnlockedTemplates();
    loadRecentTemplates();
  }, []);

  // Function to load unlocked templates
  const loadUnlockedTemplates = () => {
    setIsLoading(true);
    try {
      const unlockedIds = getUserUnlockedTemplates();
      const templates: TemplateMetadata[] = [];
      
      // Get template details for each unlocked template
      unlockedIds.forEach(id => {
        const template = getTemplateById(id);
        if (template) {
          templates.push(template);
        }
      });
      
      setUnlockedTemplates(templates);
    } catch (error) {
      console.error("Failed to load unlocked templates:", error);
      toast({
        title: "Error loading templates",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load recently viewed templates
  const loadRecentTemplates = () => {
    try {
      // Get recently viewed templates from localStorage
      const recentIds = JSON.parse(localStorage.getItem('recentlyViewedTemplates') || '[]');
      const templates: TemplateMetadata[] = [];
      
      // Get template details for each recent template
      recentIds.forEach((id: string) => {
        const template = getTemplateById(id);
        if (template) {
          templates.push(template);
        }
      });
      
      setRecentTemplates(templates);
    } catch (error) {
      console.error("Failed to load recent templates:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            My Templates
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your unlocked and recently viewed templates
          </p>
        </div>
      </div>

      <Tabs defaultValue="unlocked" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="unlocked" className="flex items-center gap-1">
            <Crown className="h-4 w-4" />
            Unlocked Templates
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Recently Viewed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[...Array(3)].map((_, index) => (
                <div 
                  key={index}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse h-[300px]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
              {unlockedTemplates.length > 0 ? (
                unlockedTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={onPreview}
                    onDownload={onDownload}
                  />
                ))
              ) : (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    You haven't unlocked any premium templates yet.
                  </p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => window.location.href = '/templates'}
                  >
                    Browse Templates
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {recentTemplates.length > 0 ? (
              recentTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={onPreview}
                  onDownload={onDownload}
                />
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  You haven't viewed any templates recently.
                </p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => window.location.href = '/templates'}
                >
                  Browse Templates
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple template card component for the dashboard
function TemplateCard({ template, onPreview, onDownload }: { 
  template: TemplateMetadata, 
  onPreview: (id: string) => void,
  onDownload: (id: string) => void
}) {
  // Get thumbnail URL
  const imageUrl = template.thumbnailUrl || 
    `/templates/${template.type === 'free' ? 'Free Templates' : 'Premium Templates'}/${template.id}/thumbnail.jpg`;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative">
          {/* Template Preview Image */}
          <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
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
            <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs py-1 px-2 rounded-full">
              Premium
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
        </CardContent>
        
        <CardFooter className="p-4 pt-0 gap-2 flex">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onPreview(template.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => onDownload(template.id)}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
