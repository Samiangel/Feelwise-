import OpenAI from "openai";
import { spotifyService, type MusicRecommendation } from "./spotify.js";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
console.log('OpenAI API Key status:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set', process.env.OPENAI_API_KEY?.substring(0, 7) + '...');

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export interface EmotionAnalysisResult {
  emotion: string;
  confidence: number;
  intensity: "Low" | "Medium" | "High";
  quote: string;
  musicRecommendation: string;
  spotifyTracks?: MusicRecommendation[];
}

export async function analyzeEmotion(text: string, language?: string): Promise<EmotionAnalysisResult> {
  // Check if we have a valid OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.startsWith('sk-') || apiKey.length < 40) {
    console.log("Invalid or missing OpenAI API key, using demo mode");
    // Demo mode with realistic analysis based on text content
    return analyzeDemoEmotion(text, language);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert emotion analysis AI. Analyze the emotional content of text and provide detailed insights. 

Respond with JSON in this exact format:
{
  "emotion": "one of: HAPPY, SAD, ANGRY, ANXIOUS, EXCITED, CALM",
  "confidence": "number between 0 and 1",
  "intensity": "Low, Medium, or High",
  "quote": "a relevant motivational or supportive quote",
  "musicRecommendation": "suggest a specific song or music genre that would help with this emotion"
}

Consider context, word choice, and emotional indicators to determine the primary emotion.`
        },
        {
          role: "user",
          content: `Analyze the emotion in this text: "${text}"`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    const emotion = result.emotion || "CALM";

    // Get Spotify music recommendations
    let spotifyTracks: MusicRecommendation[] = [];
    try {
      spotifyTracks = await spotifyService.getRecommendationsByEmotion(emotion, language);
    } catch (error) {
      console.log("Spotify recommendations failed, using demo mode");
    }

    return {
      emotion,
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      intensity: result.intensity || "Medium",
      quote: result.quote || "Every moment is a fresh beginning.",
      musicRecommendation: result.musicRecommendation || "Peaceful ambient music",
      spotifyTracks,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Fallback to demo mode if API fails
    return analyzeDemoEmotion(text, language);
  }
}

async function analyzeDemoEmotion(text: string, language?: string): Promise<EmotionAnalysisResult> {
  const lowerText = text.toLowerCase();
  
  // Simple keyword-based emotion detection for demo
  let emotion = "CALM";
  let confidence = 0.7;
  let intensity = "Medium";
  let quote = "Every moment is a fresh beginning.";
  let musicRecommendation = "Peaceful ambient music";

  if (lowerText.includes("happy") || lowerText.includes("joy") || lowerText.includes("excited") || 
      lowerText.includes("glücklich") || lowerText.includes("freude") || lowerText.includes("aufgeregt")) {
    emotion = "HAPPY";
    confidence = 0.85;
    intensity = "High";
    quote = "Happiness is not something ready made. It comes from your own actions.";
    musicRecommendation = "Upbeat pop music or your favorite feel-good songs";
  } else if (lowerText.includes("sad") || lowerText.includes("depressed") || lowerText.includes("down") ||
             lowerText.includes("traurig") || lowerText.includes("deprimiert")) {
    emotion = "SAD";
    confidence = 0.8;
    intensity = "Medium";
    quote = "It's okay to not be okay. Tomorrow is a new day with new possibilities.";
    musicRecommendation = "Gentle acoustic music or calming classical pieces";
  } else if (lowerText.includes("angry") || lowerText.includes("mad") || lowerText.includes("frustrated") ||
             lowerText.includes("wütend") || lowerText.includes("sauer") || lowerText.includes("frustriert")) {
    emotion = "ANGRY";
    confidence = 0.75;
    intensity = "High";
    quote = "Anger is an acid that can do more harm to the vessel than to anything it's poured on.";
    musicRecommendation = "Energetic rock music or intense workout songs";
  } else if (lowerText.includes("anxious") || lowerText.includes("worried") || lowerText.includes("nervous") ||
             lowerText.includes("ängstlich") || lowerText.includes("besorgt") || lowerText.includes("nervös")) {
    emotion = "ANXIOUS";
    confidence = 0.8;
    intensity = "Medium";
    quote = "Anxiety is the dizziness of freedom. Take one step at a time.";
    musicRecommendation = "Calming nature sounds or meditation music";
  } else if (lowerText.includes("excited") || lowerText.includes("thrilled") || lowerText.includes("energetic") ||
             lowerText.includes("aufgeregt") || lowerText.includes("begeistert")) {
    emotion = "EXCITED";
    confidence = 0.9;
    intensity = "High";
    quote = "The way to get started is to quit talking and begin doing.";
    musicRecommendation = "Energetic dance music or motivational songs";
  }

  // Get Spotify music recommendations for demo mode too
  let spotifyTracks: MusicRecommendation[] = [];
  try {
    spotifyTracks = await spotifyService.getRecommendationsByEmotion(emotion, language);
  } catch (error) {
    console.log("Spotify demo recommendations failed, using fallback");
  }

  return { emotion, confidence, intensity, quote, musicRecommendation, spotifyTracks };
}

export async function getMotivationalQuote(emotion: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a supportive therapist. Provide a single, meaningful motivational quote that would help someone feeling this emotion. Respond with just the quote in JSON format."
        },
        {
          role: "user",
          content: `Provide a motivational quote for someone feeling ${emotion}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.quote || "You are stronger than you think.";
  } catch (error) {
    console.error("Quote generation error:", error);
    return "Every moment is a fresh beginning.";
  }
}
