import { apiRequest } from "./queryClient";
import type { GenerateRequest, GeneratedContent } from "@shared/schema";

export async function generateContent(request: GenerateRequest): Promise<GeneratedContent> {
  // Use Puter.js for AI generation without API keys
  try {
    // Get template-specific prompt modifiers
    const templatePrompts = {
      saas: "Focus on scalability, efficiency, and user productivity. Use tech-savvy language and emphasize ROI.",
      ecommerce: "Highlight product quality, customer satisfaction, and shopping convenience. Use action-oriented language.",
      agency: "Emphasize expertise, results, and professional partnerships. Use confident, authority-building language.",
      app: "Focus on user experience, convenience, and mobile-first features. Use modern, trendy language.",
      health: "Prioritize trust, safety, and wellness benefits. Use caring, professional language.",
      education: "Emphasize learning outcomes, skill development, and knowledge growth. Use encouraging, supportive language.",
      food: "Highlight taste, quality, and dining experience. Use appetizing, sensory language.",
      tech: "Focus on innovation, cutting-edge technology, and future solutions. Use forward-thinking language.",
      general: "Use versatile, engaging language that works for any business type."
    };

    const templateModifier = templatePrompts[request.templateType as keyof typeof templatePrompts] || templatePrompts.general;

    const systemPrompt = `You are an expert copywriter specializing in startup landing pages. Create compelling, conversion-focused copy that includes:

1. A powerful headline (8-12 words)
2. A compelling subheadline (15-25 words)
3. 4 key features/benefits
4. A strong call-to-action
5. 4 specific benefits with metrics when possible

${templateModifier} Make the copy persuasive and conversion-focused.

Respond with JSON in this exact format:
{
  "headline": "string",
  "subheadline": "string", 
  "features": ["string", "string", "string", "string"],
  "cta": "string",
  "benefits": ["string", "string", "string", "string"]
}`;

    const userPrompt = `Create landing page copy for this startup idea: ${request.idea}`;

    // Use Puter.js AI
    const response = await (window as any).puter.ai.chat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], {
      model: "gpt-4o",
      response_format: { type: "json_object" }
    });

    const generatedText = response.message.content;
    const parsedContent = JSON.parse(generatedText);

    return {
      headline: parsedContent.headline,
      subheadline: parsedContent.subheadline,
      features: parsedContent.features,
      cta: parsedContent.cta,
      benefits: parsedContent.benefits
    };

  } catch (error) {
    console.error('Generation error:', error);
    throw new Error("Failed to generate content. Please try again.");
  }
}

export async function getAnalytics() {
  const response = await apiRequest("GET", "/api/analytics");
  return response.json();
}
