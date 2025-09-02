import { type User, type InsertUser, type EmotionAnalysis, type InsertEmotionAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEmotionAnalysis(analysis: InsertEmotionAnalysis): Promise<EmotionAnalysis>;
  getEmotionAnalyses(userId?: string): Promise<EmotionAnalysis[]>;
  getEmotionAnalysis(id: string): Promise<EmotionAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emotionAnalyses: Map<string, EmotionAnalysis>;

  constructor() {
    this.users = new Map();
    this.emotionAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEmotionAnalysis(insertAnalysis: InsertEmotionAnalysis): Promise<EmotionAnalysis> {
    const id = randomUUID();
    const analysis: EmotionAnalysis = {
      ...insertAnalysis,
      id,
      userId: insertAnalysis.userId || null,
      quote: insertAnalysis.quote || null,
      musicRecommendation: insertAnalysis.musicRecommendation || null,
      spotifyTracks: insertAnalysis.spotifyTracks || null,
      createdAt: new Date(),
    };
    this.emotionAnalyses.set(id, analysis);
    return analysis;
  }

  async getEmotionAnalyses(userId?: string): Promise<EmotionAnalysis[]> {
    const analyses = Array.from(this.emotionAnalyses.values());
    if (userId) {
      return analyses.filter(analysis => analysis.userId === userId);
    }
    return analyses.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getEmotionAnalysis(id: string): Promise<EmotionAnalysis | undefined> {
    return this.emotionAnalyses.get(id);
  }
}

export const storage = new MemStorage();
