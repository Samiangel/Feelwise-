import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const emotionAnalyses = pgTable("emotion_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  inputText: text("input_text").notNull(),
  inputType: varchar("input_type", { enum: ["text", "voice"] }).notNull(),
  detectedEmotion: varchar("detected_emotion").notNull(),
  confidence: real("confidence").notNull(),
  intensity: varchar("intensity").notNull(),
  quote: text("quote"),
  musicRecommendation: text("music_recommendation"),
  spotifyTracks: text("spotify_tracks"), // JSON string of MusicTrack[]
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmotionAnalysisSchema = createInsertSchema(emotionAnalyses).omit({
  id: true,
  createdAt: true,
});

export const analyzeEmotionSchema = z.object({
  text: z.string().min(1, "Text is required"),
  type: z.enum(["text", "voice"]),
  language: z.string().optional(),
});

export interface MusicTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  previewUrl: string | null;
  trackId: string;
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEmotionAnalysis = z.infer<typeof insertEmotionAnalysisSchema>;
export type EmotionAnalysis = typeof emotionAnalyses.$inferSelect;
export type AnalyzeEmotionRequest = z.infer<typeof analyzeEmotionSchema>;
