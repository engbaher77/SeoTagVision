import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Analysis Types
export const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type UrlInput = z.infer<typeof urlSchema>;

export interface MetaTag {
  name: string;
  content: string;
  property?: string;
  httpEquiv?: string;
  charset?: string;
}

export interface SeoAnalysisResult {
  url: string;
  title: string;
  metaTags: Record<string, string>;
  seoScore: number;
  totalTags: number;
  metaTagsCount: number;
  otherTagsCount: number;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  totalSuggestions: number;
  googleStructuredData: boolean;
  suggestions: SuggestionItem[];
  allMetaTags: Record<string, MetaTag[]>;
}

export interface SuggestionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  codeExample?: string;
}
