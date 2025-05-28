import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Undo, Palette, Type, Image, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { getTemplateById } from "@/lib/template-manager";
import { useToast } from "@/hooks/use-toast";

interface TemplateCustomizerProps {
  templateId: string | null;
  onClose: () => void;
  onSave: (templateId: string, customizations: any) => void;
}

export function TemplateCustomizer({ templateId, onClose, onSave }: TemplateCustomizerProps) {
  const [activeTab, setActiveTab] = useState("text");
  const [customizations, setCustomizations] = useState({
    text: {
      companyName: "",
      headline: "",
      subheadline: "",
      ctaText: "Get Started",
      featureTitle1: "",
      featureDesc1: "",
      featureTitle2: "",
      featureDesc2: "",
      featureTitle3: "",
      featureDesc3: "",
    },
    colors: {
      primary: "#3B82F6",
      secondary: "#6366F1",
      accent: "#F472B6",
      background: "#FFFFFF",
      text: "#1E293B",
    },
    fonts: {
      headingFont: "Inter",
      bodyFont: "Roboto",
      fontSize: 16,
    },
    logo: null as File | null,
  });
  
  const { toast } = useToast();
  
  if (!templateId) return null;
  
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  const handleTextChange = (field: string, value: string) => {
    setCustomizations({
      ...customizations,
      text: {
        ...customizations.text,
        [field]: value,
      },
    });
  };
  
  const handleColorChange = (field: string, value: string) => {
    setCustomizations({
      ...customizations,
      colors: {
        ...customizations.colors,
        [field]: value,
      },
    });
  };
  
  const handleFontChange = (field: string, value: string | number) => {
    setCustomizations({
      ...customizations,
      fonts: {
        ...customizations.fonts,
        [field]: value,
      },
    });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomizations({
        ...customizations,
        logo: e.target.files[0],
      });
    }
  };
  
  const handleSave = () => {
    onSave(templateId, customizations);
    toast({
      title: "Customizations saved",
      description: "Your template customizations have been applied.",
    });
  };
  
  const handleReset = () => {
    setCustomizations({
      text: {
        companyName: "",
        headline: "",
        subheadline: "",
        ctaText: "Get Started",
        featureTitle1: "",
        featureDesc1: "",
        featureTitle2: "",
        featureDesc2: "",
        featureTitle3: "",
        featureDesc3: "",
      },
      colors: {
        primary: "#3B82F6",
        secondary: "#6366F1",
        accent: "#F472B6",
        background: "#FFFFFF",
        text: "#1E293B",
      },
      fonts: {
        headingFont: "Inter",
        bodyFont: "Roboto",
        fontSize: 16,
      },
      logo: null,
    });
    
    toast({
      title: "Customizations reset",
      description: "All customizations have been reset to default.",
    });
  };
  
  return (
    <Dialog open={!!templateId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            Customize Template: {template.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Customization Controls */}
          <div className="col-span-1 border-r p-0">
            <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full rounded-none">
                <TabsTrigger value="text" className="rounded-none">
                  <Type className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="colors" className="rounded-none">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="fonts" className="rounded-none">
                  <Type className="h-4 w-4 mr-2" />
                  Fonts
                </TabsTrigger>
              </TabsList>
              
              <div className="p-4 h-[500px] overflow-y-auto">
                <TabsContent value="text" className="mt-0 p-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={customizations.text.companyName} 
                        onChange={(e) => handleTextChange("companyName", e.target.value)}
                        placeholder="Your Company Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="headline">Headline</Label>
                      <Input 
                        id="headline" 
                        value={customizations.text.headline} 
                        onChange={(e) => handleTextChange("headline", e.target.value)}
                        placeholder="Main Headline"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subheadline">Subheadline</Label>
                      <Textarea 
                        id="subheadline" 
                        value={customizations.text.subheadline} 
                        onChange={(e) => handleTextChange("subheadline", e.target.value)}
                        placeholder="Supporting subheadline text"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ctaText">Call to Action Button</Label>
                      <Input 
                        id="ctaText" 
                        value={customizations.text.ctaText} 
                        onChange={(e) => handleTextChange("ctaText", e.target.value)}
                        placeholder="Get Started"
                      />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Features</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="featureTitle1">Feature 1 Title</Label>
                          <Input 
                            id="featureTitle1" 
                            value={customizations.text.featureTitle1} 
                            onChange={(e) => handleTextChange("featureTitle1", e.target.value)}
                            placeholder="Feature Title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="featureDesc1">Feature 1 Description</Label>
                          <Textarea 
                            id="featureDesc1" 
                            value={customizations.text.featureDesc1} 
                            onChange={(e) => handleTextChange("featureDesc1", e.target.value)}
                            placeholder="Feature description"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="featureTitle2">Feature 2 Title</Label>
                          <Input 
                            id="featureTitle2" 
                            value={customizations.text.featureTitle2} 
                            onChange={(e) => handleTextChange("featureTitle2", e.target.value)}
                            placeholder="Feature Title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="featureDesc2">Feature 2 Description</Label>
                          <Textarea 
                            id="featureDesc2" 
                            value={customizations.text.featureDesc2} 
                            onChange={(e) => handleTextChange("featureDesc2", e.target.value)}
                            placeholder="Feature description"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="featureTitle3">Feature 3 Title</Label>
                          <Input 
                            id="featureTitle3" 
                            value={customizations.text.featureTitle3} 
                            onChange={(e) => handleTextChange("featureTitle3", e.target.value)}
                            placeholder="Feature Title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="featureDesc3">Feature 3 Description</Label>
                          <Textarea 
                            id="featureDesc3" 
                            value={customizations.text.featureDesc3} 
                            onChange={(e) => handleTextChange("featureDesc3", e.target.value)}
                            placeholder="Feature description"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="colors" className="mt-0 p-0">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="primaryColor" className="flex justify-between">
                        Primary Color
                        <span className="text-xs text-slate-500">{customizations.colors.primary}</span>
                      </Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input 
                          type="color" 
                          id="primaryColor" 
                          value={customizations.colors.primary} 
                          onChange={(e) => handleColorChange("primary", e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div 
                            className="h-10 rounded-md" 
                            style={{ backgroundColor: customizations.colors.primary }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="secondaryColor" className="flex justify-between">
                        Secondary Color
                        <span className="text-xs text-slate-500">{customizations.colors.secondary}</span>
                      </Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input 
                          type="color" 
                          id="secondaryColor" 
                          value={customizations.colors.secondary} 
                          onChange={(e) => handleColorChange("secondary", e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div 
                            className="h-10 rounded-md" 
                            style={{ backgroundColor: customizations.colors.secondary }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="accentColor" className="flex justify-between">
                        Accent Color
                        <span className="text-xs text-slate-500">{customizations.colors.accent}</span>
                      </Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input 
                          type="color" 
                          id="accentColor" 
                          value={customizations.colors.accent} 
                          onChange={(e) => handleColorChange("accent", e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div 
                            className="h-10 rounded-md" 
                            style={{ backgroundColor: customizations.colors.accent }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="backgroundColor" className="flex justify-between">
                        Background Color
                        <span className="text-xs text-slate-500">{customizations.colors.background}</span>
                      </Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input 
                          type="color" 
                          id="backgroundColor" 
                          value={customizations.colors.background} 
                          onChange={(e) => handleColorChange("background", e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div 
                            className="h-10 rounded-md border" 
                            style={{ backgroundColor: customizations.colors.background }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="textColor" className="flex justify-between">
                        Text Color
                        <span className="text-xs text-slate-500">{customizations.colors.text}</span>
                      </Label>
                      <div className="flex items-center gap-3 mt-2">
                        <input 
                          type="color" 
                          id="textColor" 
                          value={customizations.colors.text} 
                          onChange={(e) => handleColorChange("text", e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div 
                            className="h-10 rounded-md" 
                            style={{ backgroundColor: customizations.colors.text }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-3">Preview</h3>
                      <div 
                        className="p-4 rounded-md"
                        style={{ backgroundColor: customizations.colors.background }}
                      >
                        <div 
                          className="text-lg font-bold mb-2"
                          style={{ color: customizations.colors.text }}
                        >
                          Sample Heading
                        </div>
                        <div 
                          className="text-sm mb-4"
                          style={{ color: customizations.colors.text }}
                        >
                          This is sample text to preview your color scheme.
                        </div>
                        <div className="flex gap-2">
                          <div 
                            className="px-3 py-1 rounded-md text-white text-sm"
                            style={{ backgroundColor: customizations.colors.primary }}
                          >
                            Primary
                          </div>
                          <div 
                            className="px-3 py-1 rounded-md text-white text-sm"
                            style={{ backgroundColor: customizations.colors.secondary }}
                          >
                            Secondary
                          </div>
                          <div 
                            className="px-3 py-1 rounded-md text-white text-sm"
                            style={{ backgroundColor: customizations.colors.accent }}
                          >
                            Accent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fonts" className="mt-0 p-0">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="headingFont">Heading Font</Label>
                      <select
                        id="headingFont"
                        value={customizations.fonts.headingFont}
                        onChange={(e) => handleFontChange("headingFont", e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Space Grotesk">Space Grotesk</option>
                        <option value="Manrope">Manrope</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="bodyFont">Body Font</Label>
                      <select
                        id="bodyFont"
                        value={customizations.fonts.bodyFont}
                        onChange={(e) => handleFontChange("bodyFont", e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Roboto Mono">Roboto Mono</option>
                        <option value="IBM Plex Sans">IBM Plex Sans</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="fontSize" className="flex justify-between">
                        Base Font Size: {customizations.fonts.fontSize}px
                      </Label>
                      <Slider
                        id="fontSize"
                        min={12}
                        max={22}
                        step={1}
                        value={[customizations.fonts.fontSize as number]}
                        onValueChange={(value) => handleFontChange("fontSize", value[0])}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-3">Font Preview</h3>
                      <div 
                        className="p-4 rounded-md border"
                        style={{ 
                          fontFamily: customizations.fonts.bodyFont,
                          fontSize: `${customizations.fonts.fontSize}px`
                        }}
                      >
                        <div 
                          className="text-2xl font-bold mb-2"
                          style={{ fontFamily: customizations.fonts.headingFont }}
                        >
                          Heading Font: {customizations.fonts.headingFont}
                        </div>
                        <div className="mb-4">
                          This is body text in {customizations.fonts.bodyFont} at {customizations.fonts.fontSize}px size.
                        </div>
                        <div className="text-sm">
                          This is smaller text that shows how your font choices look at different sizes.
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="logo">Upload Logo</Label>
                      <Input 
                        id="logo" 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="mt-1"
                      />
                      {customizations.logo && (
                        <div className="mt-2">
                          <p className="text-sm text-slate-500">
                            Selected: {customizations.logo.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Preview */}
          <div className="col-span-2 bg-slate-100 dark:bg-slate-800 p-4 overflow-auto">
            <div 
              className="w-full h-full bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden"
              style={{ backgroundColor: customizations.colors.background }}
            >
              <div className="p-6">
                <div className="text-center mb-8">
                  <h1 
                    className="text-3xl font-bold mb-4"
                    style={{ 
                      color: customizations.colors.text,
                      fontFamily: customizations.fonts.headingFont
                    }}
                  >
                    {customizations.text.headline || "Your Compelling Headline"}
                  </h1>
                  <p 
                    className="text-lg"
                    style={{ 
                      color: customizations.colors.text,
                      fontFamily: customizations.fonts.bodyFont,
                      fontSize: `${customizations.fonts.fontSize}px`
                    }}
                  >
                    {customizations.text.subheadline || "Your supporting subheadline goes here, explaining your value proposition."}
                  </p>
                  <div className="mt-6">
                    <button
                      className="px-6 py-3 rounded-md text-white font-medium"
                      style={{ backgroundColor: customizations.colors.primary }}
                    >
                      {customizations.text.ctaText}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div className="p-4 rounded-lg border">
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ 
                        color: customizations.colors.text,
                        fontFamily: customizations.fonts.headingFont
                      }}
                    >
                      {customizations.text.featureTitle1 || "Feature One"}
                    </h3>
                    <p
                      style={{ 
                        color: customizations.colors.text,
                        fontFamily: customizations.fonts.bodyFont,
                        fontSize: `${customizations.fonts.fontSize}px`
                      }}
                    >
                      {customizations.text.featureDesc1 || "Description of your first amazing feature and the benefits it provides to users."}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ 
                        color: customizations.colors.text,
                        fontFamily: customizations.fonts.headingFont
                      }}
                    >
                      {customizations.text.featureTitle2 || "Feature Two"}
                    </h3>
                    <p
                      style={{ 
                        color: customizations.colors.text,
                        fontFamily: customizations.fonts.bodyFont,
                        fontSize: `${customizations.fonts.fontSize}px`
                      }}
                    >
                      {customizations.text.featureDesc2 || "Description of your second amazing feature and the benefits it provides to users."}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ 
                        color: customizations.colors.text,
                        fontFamily: customizations.fonts.headingFont
                      }}
                    >
                      {customizations.text.featureTitle3 || "Feature Three"}
                    </h3>
                    <p
                      style={{ 
                        color: customizations.colors.text,
                        fontFamily: customizations.fonts.bodyFont,
                        fontSize: `${customizations.fonts.fontSize}px`
                      }}
                    >
                      {customizations.text.featureDesc3 || "Description of your third amazing feature and the benefits it provides to users."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleReset}
          >
            <Undo className="h-4 w-4 mr-2" />
            Reset Changes
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Customizations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
