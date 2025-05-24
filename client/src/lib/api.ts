import { apiRequest } from "./queryClient";
import type { GenerateRequest, GeneratedContent } from "@shared/schema";

export async function generateContent(request: GenerateRequest): Promise<GeneratedContent> {
  const response = await apiRequest("POST", "/api/generate", request);
  return response.json();
}

export async function getAnalytics() {
  const response = await apiRequest("GET", "/api/analytics");
  return response.json();
}
