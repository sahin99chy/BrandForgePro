import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const brandGenerations = pgTable("brand_generations", {
  id: serial("id").primaryKey(),
  idea: text("idea").notNull(),
  generated_content: jsonb("generated_content").notNull(),
  template_type: text("template_type").default("general"),
  created_at: text("created_at").notNull(),
  user_id: integer("user_id"),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  prompt_modifier: text("prompt_modifier").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBrandGenerationSchema = createInsertSchema(brandGenerations).pick({
  idea: true,
  generated_content: true,
});

export const generateRequestSchema = z.object({
  idea: z.string().min(10, "Please provide at least 10 characters describing your startup idea"),
  templateType: z.string().optional().default("general"),
});

export const templateSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  description: z.string(),
  prompt_modifier: z.string(),
});

export const generatedContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).length(3),
  cta: z.string(),
  colorPalette: z.array(z.string()).length(3),
  emojiStyle: z.string(),
  brandTone: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBrandGeneration = z.infer<typeof insertBrandGenerationSchema>;
export type BrandGeneration = typeof brandGenerations.$inferSelect;
export type GenerateRequest = z.infer<typeof generateRequestSchema>;
export type GeneratedContent = z.infer<typeof generatedContentSchema>;
