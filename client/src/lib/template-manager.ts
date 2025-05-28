import type { GeneratedContent } from "@shared/schema";
import axios, { AxiosError } from "axios";

// API Response Types
interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

interface TemplateMetadataResponse extends Omit<TemplateMetadata, 'premium'> {
  // This interface matches the API response structure
  premium: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PurchaseResponse {
  success: boolean;
  paymentIntent?: {
    id: string;
    clientSecret: string;
  };
  error?: string;
}

// Error class for template-related errors
class TemplateError extends Error {
  constructor(
    message: string,
    public code: string = 'TEMPLATE_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'TemplateError';
  }
}

// Constants
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000; // 1 second base delay

// Cache for template metadata
let templateCache: TemplateMetadata[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface TemplateMetadata {
  id: string;
  name: string;
  type: "free" | "premium";
  category?: string;
  layout?: string;
  responsive?: boolean;
  graphics?: boolean;
  premium: boolean;
  industry?: string[];
  features?: string[];
  previewUrl?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
}

// Track which templates the user has viewed to avoid consecutive repeats
let recentlyViewedTemplates: string[] = [];
const MAX_RECENT_TEMPLATES = 5;

/**
 * Loads all template metadata from the server with retry logic
 * @param retryAttempt Current retry attempt (used internally for recursion)
 * @returns Promise with array of TemplateMetadata
 */
export async function loadTemplateMetadata(retryAttempt: number = 0): Promise<TemplateMetadata[]> {
  try {
    const response = await axios.get<ApiResponse<TemplateMetadataResponse[]>>('/api/templates');
    
    if (response.data?.success && Array.isArray(response.data.data)) {
      // Transform API response to match our TemplateMetadata type
      return response.data.data.map(template => ({
        ...template,
        premium: template.premium || false // Ensure backward compatibility
      }));
    }
    
    throw new TemplateError('Invalid response format from server');
  } catch (error) {
    const axiosError = error as AxiosError;
    
    // Log the error if it's not a network error or we've exhausted retries
    if (retryAttempt >= MAX_RETRY_ATTEMPTS || !axiosError.isAxiosError) {
      console.error(`Failed to load template metadata after ${retryAttempt + 1} attempts:`, error);
      
      // Only use mock data in development or if explicitly configured
      if (process.env.NODE_ENV === 'development') {
        console.warn('Falling back to mock template data');
        return [...freeTemplates, ...premiumTemplates];
      }
      
      throw new TemplateError(
        'Failed to load templates. Please check your connection and try again.',
        'TEMPLATE_LOAD_ERROR',
        { originalError: error }
      );
    }
    
    // Exponential backoff before retry
    const delay = RETRY_DELAY_MS * Math.pow(2, retryAttempt);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return loadTemplateMetadata(retryAttempt + 1);
  }
}

// Function to get a random template that hasn't been recently viewed
export function getRandomTemplate(
  type?: "free" | "premium" | "all",
  industry?: string
): TemplateMetadata | null {
  const templates = [...freeTemplates, ...premiumTemplates].filter(template => {
    // Filter by type if specified
    if (type && type !== "all") {
      if (template.type !== type) return false;
    }
    
    // Filter by industry if specified
    if (industry && template.industry) {
      if (!template.industry.includes(industry)) return false;
    }
    
    // Filter out recently viewed templates
    return !recentlyViewedTemplates.includes(template.id);
  });
  
  if (templates.length === 0) {
    // If all templates have been viewed recently, reset the history
    recentlyViewedTemplates = [];
    return getRandomTemplate(type, industry);
  }
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  const selectedTemplate = templates[randomIndex];
  
  // Add to recently viewed and maintain max length
  recentlyViewedTemplates.push(selectedTemplate.id);
  if (recentlyViewedTemplates.length > MAX_RECENT_TEMPLATES) {
    recentlyViewedTemplates.shift();
  }
  
  return selectedTemplate;
}

// Function to get a specific template by ID
export function getTemplateById(id: string): TemplateMetadata | null {
  const allTemplates = [...freeTemplates, ...premiumTemplates];
  return allTemplates.find(template => template.id === id) || null;
}

// Function to get template metadata from the server
export async function getTemplateMetadataFromServer(id: string): Promise<TemplateMetadata | null> {
  try {
    const response = await axios.get(`/api/template-metadata?id=${id}`);
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch template metadata:", error);
    return null;
  }
}

// Function to check if a template is unlocked for the user
export function isTemplateUnlocked(templateId: string): boolean {
  // In a real app, this would check the user's subscription status
  // and purchased templates from the backend
  const unlockedTemplates = getUserUnlockedTemplates();
  const template = [...freeTemplates, ...premiumTemplates].find(t => t.id === templateId);
  
  // If template not found, assume it's locked
  if (!template) return false;
  
  // Free templates are always unlocked
  if (template.type === 'free') return true;
  
  // Check if user has an active subscription or has purchased the template
  return hasActiveSubscription() || unlockedTemplates.includes(templateId);
}

// Function to get user's unlocked templates from localStorage
export function getUserUnlockedTemplates(): string[] {
  try {
    const stored = localStorage.getItem('unlockedTemplates');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading unlocked templates:', error);
    return [];
  }
}

// Function to unlock a template for the user
export function unlockTemplate(templateId: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const unlockedTemplates = getUserUnlockedTemplates();
      if (!unlockedTemplates.includes(templateId)) {
        const updatedTemplates = [...unlockedTemplates, templateId];
        localStorage.setItem('unlockedTemplates', JSON.stringify(updatedTemplates));
      }
      resolve(true);
    } catch (error) {
      console.error('Error unlocking template:', error);
      resolve(false);
    }
  });
}

// Function to check if user has an active subscription
export function hasActiveSubscription(): boolean {
  // In a real app, this would check the user's subscription status from the backend
  // For demo purposes, we'll use localStorage
  return localStorage.getItem('hasActiveSubscription') === 'true';
}

/**
 * Downloads a template file and triggers browser download
 * @param template The template to download
 * @param retryAttempt Current retry attempt (used internally for recursion)
 * @returns Promise that resolves to true if download was successful
 * @throws {TemplateError} If download fails after retries
 */
export async function downloadTemplate(
  template: TemplateMetadata,
  retryAttempt: number = 0
): Promise<boolean> {
  if (!template.downloadUrl && !template.id) {
    throw new TemplateError('Template download URL or ID is required', 'INVALID_TEMPLATE');
  }

  const downloadUrl = template.downloadUrl || `/api/templates/${template.id}/download`;
  
  try {
    const response = await fetch(downloadUrl, {
      credentials: 'include', // Include cookies for auth
      cache: 'no-store', // Prevent caching of the download
    });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new TemplateError(
          'You need to be logged in to download this template',
          'AUTH_REQUIRED',
          { status: response.status }
        );
      }
      
      if (response.status === 404) {
        throw new TemplateError(
          'Template not found',
          'NOT_FOUND',
          { templateId: template.id }
        );
      }
      
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    // Get the filename from Content-Disposition header or use template ID
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `${template.id}.zip`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    // Create a blob from the response and trigger download
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    try {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.style.display = 'none';
      
      // Append to body, trigger click, and clean up
      document.body.appendChild(a);
      a.click();
      
      // Revoke the blob URL after a short delay to ensure the download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }, 100);
      
      return true;
    } catch (error) {
      window.URL.revokeObjectURL(blobUrl);
      throw error;
    }
  } catch (error) {
    if (retryAttempt < MAX_RETRY_ATTEMPTS && !(error instanceof TemplateError)) {
      // Exponential backoff before retry
      const delay = RETRY_DELAY_MS * Math.pow(2, retryAttempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      return downloadTemplate(template, retryAttempt + 1);
    }
    
    if (error instanceof TemplateError) {
      throw error;
    }
    
    throw new TemplateError(
      'Failed to download template. Please try again later.',
      'DOWNLOAD_FAILED',
      { originalError: error, templateId: template.id }
    );
  }
}

/**
 * Initiates the purchase flow for a premium template
 * @param templateId ID of the template to purchase
 * @param retryAttempt Current retry attempt (used internally for recursion)
 * @returns Promise that resolves to true if purchase was successful
 * @throws {TemplateError} If purchase fails after retries
 */
export async function purchaseTemplate(
  templateId: string,
  retryAttempt: number = 0
): Promise<boolean> {
  if (!templateId) {
    throw new TemplateError('Template ID is required', 'INVALID_TEMPLATE_ID');
  }

  // Check if template is already unlocked
  if (isTemplateUnlocked(templateId)) {
    return true; // Already purchased
  }

  try {
    const response = await fetch('/api/templates/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies for auth
      body: JSON.stringify({ templateId })
    });

    const result: PurchaseResponse = await response.json();
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new TemplateError(
          'You need to be logged in to make a purchase',
          'AUTH_REQUIRED',
          { status: response.status }
        );
      }
      
      if (response.status === 404) {
        throw new TemplateError(
          'Template not found',
          'NOT_FOUND',
          { templateId }
        );
      }
      
      throw new Error(result.error || `Server responded with status ${response.status}`);
    }
    
    if (result.success) {
      // If we have a payment intent (e.g., for Stripe), redirect to payment
      if (result.paymentIntent) {
        // In a real app, you would redirect to your payment processor
        // For Stripe, you would use the clientSecret to confirm the payment
        // This is a simplified example
        console.log('Redirecting to payment processor...');
        // await redirectToPaymentProcessor(result.paymentIntent);
        // return handlePaymentResult();
      }
      
      // Mark template as unlocked
      await unlockTemplate(templateId);
      return true;
    }
    
    throw new Error('Purchase was not successful');
  } catch (error) {
    if (retryAttempt < MAX_RETRY_ATTEMPTS && !(error instanceof TemplateError)) {
      // Exponential backoff before retry
      const delay = RETRY_DELAY_MS * Math.pow(2, retryAttempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      return purchaseTemplate(templateId, retryAttempt + 1);
    }
    
    if (error instanceof TemplateError) {
      throw error;
    }
    
    throw new TemplateError(
      'Failed to complete purchase. Please try again later.',
      'PURCHASE_FAILED',
      { originalError: error, templateId }
    );
  }
}

// Mock free templates data
export const freeTemplates: TemplateMetadata[] = [
  {
    id: "free_template_1",
    name: "Modern Startup",
    type: "free",
    layout: "centered-hero",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["saas", "tech", "general"],
    features: ["hero-section", "features-grid", "testimonials"]
  },
  {
    id: "free_template_2",
    name: "Bold Business",
    type: "free",
    layout: "split-screen",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["agency", "general", "education"],
    features: ["hero-section", "pricing-table", "team-section"]
  },
  {
    id: "free_template_3",
    name: "Ecommerce Essential",
    type: "free",
    layout: "product-focused",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["ecommerce", "food"],
    features: ["product-showcase", "features-list", "newsletter-signup"]
  },
  {
    id: "free_template_4",
    name: "App Launch",
    type: "free",
    layout: "app-showcase",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["app", "tech"],
    features: ["app-screenshots", "download-buttons", "feature-cards"]
  },
  {
    id: "free_template_5",
    name: "Health Hub",
    type: "free",
    layout: "wellness-focused",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["health"],
    features: ["testimonials", "service-cards", "contact-form"]
  },
  {
    id: "free_template_6",
    name: "Learn & Grow",
    type: "free",
    layout: "education-focused",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["education"],
    features: ["course-preview", "instructor-profiles", "curriculum-overview"]
  },
  {
    id: "free_template_7",
    name: "Food Delight",
    type: "free",
    layout: "culinary-showcase",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["food"],
    features: ["menu-preview", "reservation-form", "chef-profiles"]
  },
  {
    id: "free_template_8",
    name: "Tech Innovator",
    type: "free",
    layout: "innovation-focused",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["tech", "saas"],
    features: ["product-demo", "feature-comparison", "client-logos"]
  },
  {
    id: "free_template_9",
    name: "Service Pro",
    type: "free",
    layout: "service-oriented",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["agency", "general"],
    features: ["service-cards", "process-steps", "testimonial-carousel"]
  },
  {
    id: "free_template_10",
    name: "Versatile Venture",
    type: "free",
    layout: "multipurpose",
    responsive: true,
    graphics: true,
    premium: false,
    industry: ["general", "tech", "agency"],
    features: ["hero-section", "feature-tabs", "pricing-table", "contact-form"]
  }
];

// Mock premium templates data
export const premiumTemplates: TemplateMetadata[] = [
  {
    id: "premium_01",
    name: "Glass Morphism Pro",
    type: "premium",
    layout: "glassmorphic-hero",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["tech", "saas", "app"],
    features: ["glassmorphism-ui", "animated-sections", "video-background"]
  },
  {
    id: "premium_02",
    name: "Gradient Flow",
    type: "premium",
    layout: "gradient-split",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["tech", "app", "general"],
    features: ["gradient-backgrounds", "animated-transitions", "3d-elements"]
  },
  {
    id: "premium_03",
    name: "Bold Typography",
    type: "premium",
    layout: "typography-focused",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["agency", "general", "education"],
    features: ["custom-typography", "text-animations", "minimal-graphics"]
  },
  {
    id: "premium_04",
    name: "E-Commerce Deluxe",
    type: "premium",
    layout: "product-showcase",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["ecommerce"],
    features: ["product-gallery", "shopping-cart", "wishlist-feature"]
  },
  {
    id: "premium_05",
    name: "Health & Wellness Pro",
    type: "premium",
    layout: "wellness-premium",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["health"],
    features: ["appointment-booking", "service-showcase", "testimonial-video"]
  },
  {
    id: "premium_06",
    name: "Video Hero",
    type: "premium",
    layout: "video-background",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["tech", "agency", "app"],
    features: ["video-hero", "parallax-scrolling", "animated-stats"]
  },
  {
    id: "premium_07",
    name: "Illustrated Story",
    type: "premium",
    layout: "illustrated-journey",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["education", "general", "agency"],
    features: ["custom-illustrations", "storytelling-layout", "animated-graphics"]
  },
  {
    id: "premium_08",
    name: "Restaurant Elite",
    type: "premium",
    layout: "culinary-premium",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["food"],
    features: ["menu-builder", "reservation-system", "food-gallery"]
  },
  {
    id: "premium_09",
    name: "Dark Mode Pro",
    type: "premium",
    layout: "dark-theme",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["tech", "saas", "app"],
    features: ["dark-light-toggle", "neon-accents", "animated-transitions"]
  },
  {
    id: "premium_10",
    name: "Split Screen Showcase",
    type: "premium",
    layout: "dual-content",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["agency", "tech", "general"],
    features: ["split-screen-layout", "scroll-animations", "content-reveal"]
  },
  {
    id: "premium_11",
    name: "3D Elements",
    type: "premium",
    layout: "3d-showcase",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["tech", "app", "general"],
    features: ["3d-elements", "interactive-models", "animated-transitions"]
  },
  {
    id: "premium_12",
    name: "App Showcase Elite",
    type: "premium",
    layout: "app-premium",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["app"],
    features: ["device-mockups", "feature-showcase", "app-screenshots"]
  },
  {
    id: "premium_13",
    name: "Course Creator Pro",
    type: "premium",
    layout: "education-premium",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["education"],
    features: ["course-preview", "lesson-structure", "student-testimonials"]
  },
  {
    id: "premium_14",
    name: "Agency Portfolio",
    type: "premium",
    layout: "portfolio-showcase",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["agency"],
    features: ["case-studies", "team-profiles", "service-showcase"]
  },
  {
    id: "premium_15",
    name: "SaaS Dashboard",
    type: "premium",
    layout: "dashboard-preview",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["saas", "tech"],
    features: ["dashboard-mockup", "feature-tour", "pricing-calculator"]
  },
  {
    id: "premium_16",
    name: "Parallax Scrolling",
    type: "premium",
    layout: "parallax-story",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["general", "agency", "tech"],
    features: ["parallax-effects", "scroll-animations", "storytelling-layout"]
  },
  {
    id: "premium_17",
    name: "Interactive Product",
    type: "premium",
    layout: "interactive-showcase",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["ecommerce", "tech"],
    features: ["interactive-product-view", "feature-highlight", "customization-preview"]
  },
  {
    id: "premium_18",
    name: "Subscription Service",
    type: "premium",
    layout: "subscription-focused",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["saas", "general"],
    features: ["pricing-tiers", "feature-comparison", "testimonial-carousel"]
  },
  {
    id: "premium_19",
    name: "Event Launch",
    type: "premium",
    layout: "event-countdown",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["general", "education"],
    features: ["countdown-timer", "speaker-profiles", "schedule-overview"]
  },
  {
    id: "premium_20",
    name: "Ultimate Business",
    type: "premium",
    layout: "business-premium",
    responsive: true,
    graphics: true,
    premium: true,
    industry: ["general", "agency", "tech"],
    features: ["all-in-one", "customizable-sections", "animation-library"]
  }
];
