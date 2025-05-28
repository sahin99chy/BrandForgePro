import { getTemplateById, isTemplateUnlocked } from "./template-manager";
import axios from "axios";

// Function to download a template as a ZIP file
export async function downloadTemplate(templateId: string): Promise<boolean> {
  try {
    const template = getTemplateById(templateId);
    if (!template) {
      throw new Error("Template not found");
    }
    
    // Check if premium and not unlocked
    const isPremium = template.premium;
    const hasAccess = isTemplateUnlocked(templateId);
    
    if (isPremium && !hasAccess) {
      throw new Error("Template requires purchase");
    }
    
    // Create download link
    const downloadUrl = `/api/download-template?id=${templateId}&premium=${isPremium}&access=${hasAccess}`;
    
    // Create a temporary link element and trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${template.name.toLowerCase().replace(/\s+/g, "-")}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track this download in recent templates
    addToRecentTemplates(templateId);
    
    return true;
  } catch (error) {
    console.error("Failed to download template:", error);
    return false;
  }
}

// Function to add a template to the recently viewed templates
export function addToRecentTemplates(templateId: string): void {
  try {
    // Get existing recent templates
    const recentTemplates = JSON.parse(localStorage.getItem('recentlyViewedTemplates') || '[]');
    
    // Remove the template if it's already in the list
    const filteredTemplates = recentTemplates.filter((id: string) => id !== templateId);
    
    // Add the template to the beginning of the list
    filteredTemplates.unshift(templateId);
    
    // Keep only the 10 most recent templates
    const limitedTemplates = filteredTemplates.slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewedTemplates', JSON.stringify(limitedTemplates));
  } catch (error) {
    console.error("Failed to update recent templates:", error);
  }
}

// Function to check if a template is available for download
export async function isTemplateAvailable(templateId: string): Promise<boolean> {
  try {
    const template = getTemplateById(templateId);
    return !!template;
  } catch (error) {
    return false;
  }
}
