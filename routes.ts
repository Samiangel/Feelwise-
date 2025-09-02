import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeEmotionSchema, insertEmotionAnalysisSchema } from "@shared/schema";
import { analyzeEmotion } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze emotion endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text, type, language } = analyzeEmotionSchema.parse(req.body);
      
      const analysis = await analyzeEmotion(text, language);
      
      const emotionAnalysis = await storage.createEmotionAnalysis({
        userId: null, // Anonymous for now
        inputText: text,
        inputType: type,
        detectedEmotion: analysis.emotion,
        confidence: analysis.confidence,
        intensity: analysis.intensity,
        quote: analysis.quote,
        musicRecommendation: analysis.musicRecommendation,
        spotifyTracks: analysis.spotifyTracks ? JSON.stringify(analysis.spotifyTracks) : null,
      });

      res.json({
        id: emotionAnalysis.id,
        emotion: analysis.emotion,
        confidence: analysis.confidence,
        intensity: analysis.intensity,
        quote: analysis.quote,
        musicRecommendation: analysis.musicRecommendation,
        spotifyTracks: analysis.spotifyTracks || [],
        timestamp: emotionAnalysis.createdAt,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ 
        error: "Failed to analyze emotion",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get emotion history
  app.get("/api/history", async (req, res) => {
    try {
      const analyses = await storage.getEmotionAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("History fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch history",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get specific analysis
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const analysis = await storage.getEmotionAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Analysis fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch analysis",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
