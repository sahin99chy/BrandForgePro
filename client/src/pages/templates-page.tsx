import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TemplateGallery } from "@/components/template-gallery";
import { TemplatePreviewModal } from "@/components/template-preview-modal";
import { TemplateMetadata } from "@/lib/template-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMetadata | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateMetadata[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle template preview
  const handlePreview = (templateId: string) => {
    const template = filteredTemplates.find(t => t.id === templateId);
    if (template) {
      const index = filteredTemplates.findIndex(t => t.id === templateId);
      setSelectedTemplate(template);
      setPreviewIndex(index);
      setIsPreviewOpen(true);
    }
  };

  // Handle template download
  const handleDownload = (templateId: string) => {
    // Implement download logic here
    console.log(`Downloading template: ${templateId}`);
    // For now, we'll just show an alert
    alert(`Downloading template: ${templateId}`);
  };

  // Handle template unlock (for premium templates)
  const handleUnlock = (templateId: string) => {
    // Implement unlock logic here
    console.log(`Unlocking template: ${templateId}`);
    // For now, we'll just show an alert
    alert(`Unlocking template: ${templateId}`);
  };

  // Navigation between templates in preview
  const goToNext = () => {
    if (previewIndex < filteredTemplates.length - 1) {
      const nextIndex = previewIndex + 1;
      setSelectedTemplate(filteredTemplates[nextIndex]);
      setPreviewIndex(nextIndex);
    }
  };

  const goToPrev = () => {
    if (previewIndex > 0) {
      const prevIndex = previewIndex - 1;
      setSelectedTemplate(filteredTemplates[prevIndex]);
      setPreviewIndex(prevIndex);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Template Gallery
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Browse our collection of professional templates. Click on any template to preview it.
        </p>
      </div>

      {/* Template Gallery */}
      <div className="mb-12">
        <TemplateGallery 
          onPreview={handlePreview}
          onDownload={handleDownload}
          onUnlock={handleUnlock}
          onTemplatesFiltered={setFilteredTemplates}
        />
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          template={selectedTemplate}
          onDownload={handleDownload}
          onUnlock={handleUnlock}
          onNext={goToNext}
          onPrev={goToPrev}
          hasNext={previewIndex < filteredTemplates.length - 1}
          hasPrev={previewIndex > 0}
        />
      )}
    </div>
  );
}
