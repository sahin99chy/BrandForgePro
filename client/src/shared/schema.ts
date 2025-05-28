// API Request Types
export interface GenerateRequest {
  idea: string;
  templateType: string;
}

// Generated Content Types
export interface Feature {
  title: string;
  description: string;
}

export interface FontPairing {
  heading: string;
  body: string;
}

export interface GeneratedContent {
  brandName?: string;
  headline: string;
  subheadline: string;
  features: Feature[];
  cta: string;
  colorPalette: string[];
  emojiSet?: string;
  emojiStyle?: string;
  brandTone: string;
  templateId?: string;
  templateName?: string;
  templateType?: string;
  isPremium?: boolean;
  layoutStyle?: string;
  animationLevel?: string;
  fontPairing?: FontPairing;
  originalIdea?: string;
  originalIndustry?: string;
}
