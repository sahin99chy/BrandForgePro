import type { GeneratedContent } from "@shared/schema";
import { TemplateMetadata, getRandomTemplate, getTemplateById } from "./template-manager";
import { templates as brandTemplates, TemplateType, TemplateConfig } from "./brand-templates";

// Map industry/template types from brand-templates to template-manager
const industryToTemplateTypeMap: Record<string, string[]> = {
  "saas": ["minimal-tech", "premium-corporate", "modern-sleek"],
  "ecommerce": ["fun-youthful", "creative-bold", "modern-sleek"],
  "agency": ["premium-corporate", "creative-bold", "vintage-classic"],
  "app": ["minimal-tech", "fun-youthful", "modern-sleek"],
  "health": ["eco-friendly", "modern-sleek"],
  "education": ["fun-youthful", "eco-friendly"],
  "food": ["fun-youthful", "eco-friendly", "vintage-classic"],
  "tech": ["minimal-tech", "premium-corporate", "modern-sleek"],
  "general": ["minimal-tech", "premium-corporate", "creative-bold", "eco-friendly", "modern-sleek", "vintage-classic"]
};

// Track recently used templates to avoid repetition
let recentlyUsedTemplateIds: string[] = [];
const MAX_RECENT_TEMPLATES = 5;

/**
 * Generate brand content using a real template from the template library
 * @param idea The user's startup idea
 * @param industry The selected industry
 * @param forceTemplateId Optional template ID to force (for regeneration with specific template)
 * @returns Generated content with template information
 */
export async function generateBrandWithRealTemplate(
  idea: string,
  industry: string,
  forceTemplateId?: string
): Promise<GeneratedContent> {
  // 1. Select a template based on industry and avoiding recent templates
  let selectedTemplate: TemplateMetadata | null = null;
  
  if (forceTemplateId) {
    // If a specific template ID is requested, use that
    selectedTemplate = getTemplateById(forceTemplateId);
  } else {
    // Otherwise, get a random template that matches the industry and hasn't been used recently
    selectedTemplate = getRandomTemplate(
      undefined, // Can be basic or premium
      industry
    );
    
    // If no template was found (all were recently used), reset the history and try again
    if (!selectedTemplate) {
      recentlyUsedTemplateIds = [];
      selectedTemplate = getRandomTemplate(undefined, industry);
    }
    
    // If still no template, just get any random template
    if (!selectedTemplate) {
      const allTemplates = await loadTemplateMetadata();
      const randomIndex = Math.floor(Math.random() * allTemplates.length);
      selectedTemplate = allTemplates[randomIndex];
    }
  }
  
  if (!selectedTemplate) {
    throw new Error("Failed to select a template");
  }
  
  // 2. Add to recently used templates
  if (!recentlyUsedTemplateIds.includes(selectedTemplate.id)) {
    recentlyUsedTemplateIds.push(selectedTemplate.id);
    if (recentlyUsedTemplateIds.length > MAX_RECENT_TEMPLATES) {
      recentlyUsedTemplateIds.shift();
    }
  }
  
  // 3. Select a brand template style that matches the industry
  const preferredStyles = industryToTemplateTypeMap[industry] || ["minimal-tech"];
  const brandTemplateType = preferredStyles[Math.floor(Math.random() * preferredStyles.length)] as TemplateType;
  const brandTemplate = brandTemplates[brandTemplateType];
  
  // 4. Generate the brand content using the brand template
  const brandContent = generateBrandContent(idea, industry, brandTemplate);
  
  // 5. Combine the template metadata with the brand content
  return {
    ...brandContent,
    templateId: selectedTemplate.id,
    templateName: selectedTemplate.name,
    templateType: selectedTemplate.type,
    isPremium: selectedTemplate.premium
  } as GeneratedContent;
}

/**
 * Generate brand content using a specific brand template
 * @param idea The user's startup idea
 * @param industry The selected industry
 * @param template The brand template configuration
 * @returns Generated content
 */
function generateBrandContent(
  idea: string,
  industry: string,
  template: TemplateConfig
): GeneratedContent {
  // Generate a brand name
  const brandName = generateBrandName(template);
  
  // Generate headline and subheadline
  const headline = generateHeadline(template, brandName, idea, industry);
  const subheadline = generateSubheadline(template, industry);
  
  // Generate features
  const features = generateFeatures(template, industry);
  
  // Select color palette
  const colorPalette = getRandomItem(template.colorPalettes);
  
  // Select emoji set
  const emojiSet = getRandomItem(template.emojiSets);
  
  // Select font pairing
  const fontPairing = getRandomItem(template.fontPairings);
  
  // Generate CTA
  const cta = getRandomItem(template.ctaFormats);
  
  // Return the generated content
  return {
    brandName,
    headline,
    subheadline,
    features,
    colorPalette,
    emojiSet,
    emojiStyle: emojiSet, // For backward compatibility
    fontPairing,
    cta,
    brandTone: getRandomItem(template.brandTones),
    layoutStyle: template.layoutStyle,
    animationLevel: template.animationLevel,
    originalIdea: idea,
    originalIndustry: industry
  } as GeneratedContent;
}

// Helper functions (copied from brand-templates.ts for simplicity)
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateBrandName(template: TemplateConfig): string {
  const prefix = getRandomItem(template.brandNamePrefixes);
  const suffix = getRandomItem(template.brandNameSuffixes);
  return `${prefix}${suffix}`;
}

function generateHeadline(template: TemplateConfig, brandName: string, idea: string, category: string): string {
  const format = getRandomItem(template.headlineFormats);
  
  // Extract key phrases from the idea (simplified)
  const keyPhrase = idea.split(' ').slice(0, 3).join(' ');
  
  return format
    .replace('{brandName}', brandName)
    .replace('{idea}', keyPhrase)
    .replace('{category}', category);
}

function generateSubheadline(template: TemplateConfig, category: string): string {
  const format = getRandomItem(template.subheadlineFormats);
  return format.replace('{category}', category);
}

function generateFeatures(template: TemplateConfig, category: string): Array<{title: string, description: string}> {
  const features = [];
  const prefixes = template.featureTitlePrefixes;
  
  // Feature descriptions based on category
  const featureDescriptions: Record<string, string[]> = {
    "saas": [
      "Streamline your workflow with our intuitive interface",
      "Powerful analytics to track your performance metrics",
      "Seamless integration with your existing tools",
      "Automated reporting to save you time and effort",
      "Cloud-based solution accessible from anywhere"
    ],
    "ecommerce": [
      "Frictionless checkout process to boost conversions",
      "Beautiful product showcases to highlight your items",
      "Inventory management that updates in real-time",
      "Customer reviews and ratings to build trust",
      "Secure payment processing for peace of mind"
    ],
    "agency": [
      "Showcase your portfolio with stunning visuals",
      "Client management tools to stay organized",
      "Project tracking from proposal to completion",
      "Team collaboration features for seamless workflow",
      "Customizable templates for client deliverables"
    ],
    "app": [
      "Intuitive user interface for the best experience",
      "Cross-platform compatibility for all devices",
      "Offline functionality for on-the-go access",
      "Real-time synchronization across all your devices",
      "Battery-efficient design for all-day use"
    ],
    "health": [
      "Personalized wellness plans tailored to your needs",
      "Progress tracking to visualize your journey",
      "Expert guidance from certified professionals",
      "Community support to keep you motivated",
      "Evidence-based approaches for optimal results"
    ],
    "education": [
      "Interactive learning materials for better engagement",
      "Progress tracking to measure understanding",
      "Personalized learning paths for every student",
      "Expert-created content for comprehensive learning",
      "Community forums for discussion and support"
    ],
    "food": [
      "Fresh ingredients sourced from local suppliers",
      "Diverse menu options for every taste preference",
      "Convenient ordering system for quick service",
      "Nutritional information for health-conscious customers",
      "Sustainable packaging for eco-friendly dining"
    ],
    "tech": [
      "Cutting-edge technology for optimal performance",
      "Seamless integration with your existing ecosystem",
      "Regular updates to keep you ahead of the curve",
      "Robust security features to protect your data",
      "Scalable solutions that grow with your needs"
    ],
    "general": [
      "Comprehensive solution tailored to your needs",
      "User-friendly interface for seamless experience",
      "Dedicated support team available when you need help",
      "Flexible options to adapt to your requirements",
      "Proven results backed by customer success stories"
    ]
  };
  
  // Use the category's descriptions or fall back to general
  const descriptions = featureDescriptions[category] || featureDescriptions.general;
  
  // Generate 3-5 features
  const featureCount = Math.floor(Math.random() * 3) + 3; // 3-5 features
  
  for (let i = 0; i < featureCount; i++) {
    const prefix = getRandomItem(prefixes);
    const description = descriptions[i % descriptions.length];
    
    features.push({
      title: `${prefix} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      description
    });
  }
  
  return features;
}

// Import loadTemplateMetadata to avoid circular dependency
async function loadTemplateMetadata(): Promise<TemplateMetadata[]> {
  try {
    // In a real implementation, this would fetch from an API or local JSON files
    // For now, we'll return mock data from template-manager.ts
    return [...freeTemplates, ...premiumTemplates];
  } catch (error) {
    console.error("Failed to load template metadata:", error);
    return [];
  }
}

// Import template data
import { freeTemplates, premiumTemplates } from "./template-manager";
