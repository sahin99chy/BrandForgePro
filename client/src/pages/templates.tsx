import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TemplateGallery } from "@/components/template-gallery";
import { TemplatePreview } from "@/components/template-preview";
import { PaymentModal } from "@/components/payment-modal";
import { TemplateCustomizer } from "@/components/template-customizer";
import { useToast } from "@/hooks/use-toast";
import { getTemplateById } from "@/lib/template-manager";
import { downloadTemplate } from "@/lib/template-download";
import { isTemplateUnlocked, unlockTemplate } from "@/lib/user-account";

export default function TemplatesPage() {
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [paymentTemplateId, setPaymentTemplateId] = useState<string | null>(null);
  const [customizerTemplateId, setCustomizerTemplateId] = useState<string | null>(null);
  const [unlockedTemplates, setUnlockedTemplates] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Load unlocked templates from localStorage on mount
  useEffect(() => {
    const storedUnlocked = localStorage.getItem("unlockedTemplates");
    if (storedUnlocked) {
      try {
        setUnlockedTemplates(JSON.parse(storedUnlocked));
      } catch (e) {
        console.error("Failed to parse unlocked templates:", e);
      }
    }
  }, []);
  
  // Save unlocked templates to localStorage when they change
  useEffect(() => {
    localStorage.setItem("unlockedTemplates", JSON.stringify(unlockedTemplates));
  }, [unlockedTemplates]);
  
  // Handle template preview
  const handlePreview = (templateId: string) => {
    setPreviewTemplateId(templateId);
  };
  
  // Handle template download
  const handleDownload = async (templateId: string) => {
    const template = getTemplateById(templateId);
    if (!template) return;
    
    // Check if premium and not unlocked
    if (template.premium && !unlockedTemplates.includes(templateId) && !isTemplateUnlocked(templateId)) {
      setPaymentTemplateId(templateId);
      return;
    }
    
    // For premium templates that are unlocked, offer customization
    if (template.premium && (unlockedTemplates.includes(templateId) || isTemplateUnlocked(templateId))) {
      setCustomizerTemplateId(templateId);
      return;
    }
    
    // Download basic template directly
    toast({
      title: "Download started",
      description: `Downloading ${template.name} template...`,
    });
    
    const success = await downloadTemplate(templateId);
    
    if (success) {
      toast({
        title: "Download complete",
        description: `${template.name} template has been downloaded successfully.`,
      });
    } else {
      toast({
        title: "Download failed",
        description: "There was an error downloading the template. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle template unlock (open payment modal)
  const handleUnlock = (templateId: string) => {
    setPaymentTemplateId(templateId);
  };
  
  // Handle successful payment
  const handlePaymentSuccess = (templateId: string) => {
    // Add to unlocked templates if not already there
    if (!unlockedTemplates.includes(templateId)) {
      setUnlockedTemplates([...unlockedTemplates, templateId]);
      unlockTemplate(templateId);
    }
    
    setPaymentTemplateId(null);
    
    // Open the customizer for the newly unlocked template
    setCustomizerTemplateId(templateId);
    
    // If we were previewing this template, refresh the preview
    if (previewTemplateId === templateId) {
      // Force a refresh of the preview by briefly clearing and resetting
      setPreviewTemplateId(null);
      setTimeout(() => setPreviewTemplateId(templateId), 100);
    }
  };
  
  // Handle customization save
  const handleCustomizationSave = async (templateId: string, customizations: any) => {
    // In a real implementation, this would save the customizations and generate a custom template
    toast({
      title: "Customizations applied",
      description: "Your customized template is being prepared for download.",
    });
    
    // Close the customizer
    setCustomizerTemplateId(null);
    
    // Simulate download of customized template
    setTimeout(async () => {
      const success = await downloadTemplate(templateId);
      
      if (success) {
        toast({
          title: "Download complete",
          description: "Your customized template has been downloaded successfully.",
        });
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TemplateGallery 
            onPreview={handlePreview}
            onDownload={handleDownload}
            onUnlock={handleUnlock}
          />
        </div>
      </main>
      
      <Footer />
      
      {/* Template Preview Modal */}
      <TemplatePreview 
        templateId={previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
        onDownload={handleDownload}
        onUnlock={handleUnlock}
      />
      
      {/* Payment Modal */}
      <PaymentModal 
        templateId={paymentTemplateId}
        onClose={() => setPaymentTemplateId(null)}
        onSuccess={handlePaymentSuccess}
      />
      
      {/* Template Customizer */}
      <TemplateCustomizer
        templateId={customizerTemplateId}
        onClose={() => setCustomizerTemplateId(null)}
        onSave={handleCustomizationSave}
      />
    </div>
  );
}
