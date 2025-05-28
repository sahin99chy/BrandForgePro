import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TemplateCard } from "@/components/template-card";
import { TemplateMetadata, loadTemplateMetadata, getUserUnlockedTemplates } from "@/lib/template-manager";
import { useToast } from "@/hooks/use-toast";

interface TemplateGalleryProps {
  onPreview: (templateId: string) => void;
  onDownload: (templateId: string) => void;
  onUnlock: (templateId: string) => void;
  onTemplatesFiltered?: (templates: TemplateMetadata[]) => void;
}

export function TemplateGallery({ onPreview, onDownload, onUnlock, onTemplatesFiltered }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "free" | "premium">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'alphabetical'>('newest');
  const [unlockedTemplates, setUnlockedTemplates] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Load templates and unlocked templates on component mount
  useEffect(() => {
    loadTemplates();
    const unlocked = getUserUnlockedTemplates();
    setUnlockedTemplates(unlocked);
  }, []);
  
  // Filter templates when filters or search change
  useEffect(() => {
    const filtered = applyFilters();
    if (onTemplatesFiltered) {
      onTemplatesFiltered(filtered);
    }
  }, [templates, activeFilter, searchQuery, categoryFilter, sortBy, onTemplatesFiltered]);
  
  // Function to load templates
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const allTemplates = await loadTemplateMetadata();
      setTemplates(allTemplates);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast({
        title: "Error loading templates",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  // Function to apply all filters and sorting
  const applyFilters = () => {
    let filtered = [...templates];
    
    // Apply type filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(template => template.type === activeFilter);
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(template => {
        if (template.category) {
          return template.category.toLowerCase().includes(categoryFilter.toLowerCase());
        }
        if (template.industry) {
          return template.industry.some(ind => 
            ind.toLowerCase().includes(categoryFilter.toLowerCase())
          );
        }
        return false;
      });
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(query) ||
        (template.category && template.category.toLowerCase().includes(query)) ||
        (template.layout && template.layout.toLowerCase().includes(query)) ||
        (template.description && template.description.toLowerCase().includes(query)) ||
        (template.tags && template.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Use current date as fallback if createdAt is not available
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date().getTime();
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date().getTime();
          return dateB - dateA;
        case 'popular':
          // For now, we'll sort by name as a placeholder for popularity
          // In a real app, you would track views or downloads
          return a.name.localeCompare(b.name);
        case 'alphabetical':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredTemplates(filtered);
    return filtered;
  };
  
  // Extract unique categories from templates
  const getCategories = (): string[] => {
    const categories = new Set<string>();
    
    templates.forEach(template => {
      if (template.category) {
        categories.add(template.category);
      }
      if (template.industry) {
        template.industry.forEach(ind => categories.add(ind));
      }
    });
    
    return Array.from(categories).sort();
  };
  
  // Function to refresh/shuffle templates
  const refreshTemplates = () => {
    setIsRefreshing(true);
    
    // Create a shuffled copy of the templates
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    
    // Apply the current filter to the shuffled templates
    setTimeout(() => {
      setTemplates(shuffled);
      setIsRefreshing(false);
      
      toast({
        title: "Templates refreshed",
        description: "Showing you some different options",
      });
    }, 600);
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Template Library
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Choose from our collection of professionally designed templates
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Filter Tabs */}
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger 
                value="all" 
                onClick={() => setActiveFilter("all")}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="free" 
                onClick={() => setActiveFilter("free")}
              >
                Free
              </TabsTrigger>
              <TabsTrigger 
                value="premium" 
                onClick={() => setActiveFilter("premium")}
              >
                Premium
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Search and Filter */}
          <div className="flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search templates by name, category, or feature..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Category</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem 
                    onClick={() => setCategoryFilter(null)}
                    className={!categoryFilter ? "bg-slate-100 dark:bg-slate-800" : ""}
                  >
                    All Categories
                  </DropdownMenuItem>
                  <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                  {getCategories().map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={categoryFilter === category ? "bg-slate-100 dark:bg-slate-800" : ""}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <span>Sort: </span>
                    <span className="font-medium">
                      {sortBy === 'newest' && 'Newest'}
                      {sortBy === 'popular' && 'Popular'}
                      {sortBy === 'alphabetical' && 'A-Z'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[150px]">
                  <DropdownMenuItem 
                    onClick={() => setSortBy('newest')}
                    className={sortBy === 'newest' ? "bg-slate-100 dark:bg-slate-800" : ""}
                  >
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('popular')}
                    className={sortBy === 'popular' ? "bg-slate-100 dark:bg-slate-800" : ""}
                  >
                    Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('alphabetical')}
                    className={sortBy === 'alphabetical' ? "bg-slate-100 dark:bg-slate-800" : ""}
                  >
                    A-Z
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="outline"
                size="icon"
                onClick={refreshTemplates}
                disabled={isRefreshing}
                className="h-10 w-10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and category indicators */}
      {categoryFilter && (
        <div className="flex items-center gap-2 mt-4 mb-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Filtering by:</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 py-1 text-xs rounded-full"
            onClick={() => setCategoryFilter(null)}
          >
            {categoryFilter} ×
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse h-[300px]"
            />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter + filteredTemplates.length}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4"
          >
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={onPreview}
                  onDownload={onDownload}
                  onUnlock={onUnlock}
                />
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No templates found matching your criteria
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
