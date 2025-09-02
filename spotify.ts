interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  external_urls: { spotify: string };
  preview_url: string | null;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

export interface MusicRecommendation {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  previewUrl: string | null;
  trackId: string;
}

class SpotifyService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private async getAccessToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Spotify credentials not configured");
    }

    // Create base64 encoded credentials
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify auth error:', response.status, response.statusText, errorText);
      throw new Error(`Spotify authentication failed: ${response.statusText}`);
    }

    const data: SpotifyTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

    return this.accessToken;
  }

  private async makeSpotifyRequest<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API error:', response.status, response.statusText, `URL: ${`https://api.spotify.com/v1${endpoint}`}`, errorText);
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get music recommendations based on emotion with language/country support
  public async getRecommendationsByEmotion(emotion: string, language?: string): Promise<MusicRecommendation[]> {
    try {
      // Generate multiple search queries to avoid repetition
      const searchQueries = this.getMultipleSearchQueries(emotion, language);
      const allTracks: any[] = [];
      const seenTrackIds = new Set<string>();

      for (const query of searchQueries) {
        console.log('Searching Spotify with query:', query);
        
        const searchResults = await this.makeSpotifyRequest<SpotifySearchResponse>(
          `/search?q=${encodeURIComponent(query)}&type=track&limit=5&market=${this.getMarketByLanguage(language)}`
        );

        // Add unique tracks
        for (const track of searchResults.tracks.items) {
          if (!seenTrackIds.has(track.id) && allTracks.length < 10) {
            seenTrackIds.add(track.id);
            allTracks.push(track);
          }
        }
      }

      if (allTracks.length > 0) {
        // Return first 5 unique tracks
        return allTracks.slice(0, 5).map(track => ({
          trackName: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          spotifyUrl: track.external_urls.spotify,
          previewUrl: track.preview_url,
          trackId: track.id,
        }));
      }

      // If no search results, return demo recommendations
      return this.getDemoRecommendations(emotion, language);

    } catch (error) {
      console.error('Spotify recommendation error:', error);
      // Return demo recommendations if Spotify fails
      return this.getDemoRecommendations(emotion, language);
    }
  }

  private getEmotionParameters(emotion: string): string {
    // Spotify audio features parameters (0.0 to 1.0)
    const params = new URLSearchParams();
    
    // Add seed genres based on emotion - Spotify only allows specific genres
    const genres = this.getValidSpotifyGenres(emotion);
    params.append('seed_genres', genres);
    
    switch (emotion.toUpperCase()) {
      case 'HAPPY':
        params.append('target_valence', '0.8');
        params.append('target_energy', '0.8');
        params.append('target_danceability', '0.7');
        params.append('target_tempo', '120');
        break;
      case 'SAD':
        params.append('target_valence', '0.2');
        params.append('target_energy', '0.3');
        params.append('target_acousticness', '0.8');
        params.append('target_tempo', '70');
        break;
      case 'ANGRY':
        params.append('target_valence', '0.3');
        params.append('target_energy', '0.9');
        params.append('target_loudness', '-5');
        params.append('target_tempo', '140');
        break;
      case 'ANXIOUS':
        params.append('target_valence', '0.4');
        params.append('target_energy', '0.4');
        params.append('target_acousticness', '0.7');
        params.append('target_instrumentalness', '0.6');
        break;
      case 'EXCITED':
        params.append('target_valence', '0.9');
        params.append('target_energy', '0.9');
        params.append('target_danceability', '0.8');
        params.append('target_tempo', '130');
        break;
      case 'CALM':
      default:
        params.append('target_valence', '0.6');
        params.append('target_energy', '0.4');
        params.append('target_acousticness', '0.6');
        params.append('target_tempo', '90');
        break;
    }
    
    return params.toString();
  }

  private getValidSpotifyGenres(emotion: string): string {
    // Use only Spotify's valid seed genres
    switch (emotion.toUpperCase()) {
      case 'HAPPY':
        return 'pop,dance,funk';
      case 'SAD':
        return 'acoustic,blues,indie';
      case 'ANGRY':
        return 'metal,rock,punk';
      case 'ANXIOUS':
        return 'ambient,chill,acoustic';
      case 'EXCITED':
        return 'electronic,dance,pop';
      case 'CALM':
      default:
        return 'ambient,chill,classical';
    }
  }

  private getEmotionGenres(emotion: string): string {
    switch (emotion.toUpperCase()) {
      case 'HAPPY':
        return 'pop,dance,funk';
      case 'SAD':
        return 'indie,folk,acoustic';
      case 'ANGRY':
        return 'rock,metal,punk';
      case 'ANXIOUS':
        return 'ambient,classical,chill';
      case 'EXCITED':
        return 'electronic,dance,pop';
      case 'CALM':
      default:
        return 'ambient,chill,classical';
    }
  }

  private getMultipleSearchQueries(emotion: string, language?: string): string[] {
    const baseQueries = this.getEmotionSearchQueries(emotion);
    const languageQueries = this.getLanguageSpecificQueries(emotion, language);
    
    return [...baseQueries, ...languageQueries];
  }

  private getEmotionSearchQueries(emotion: string): string[] {
    switch (emotion.toUpperCase()) {
      case 'HAPPY':
        return ['happy upbeat feel good', 'joyful celebration dance', 'positive energy motivation'];
      case 'SAD':
        return ['sad melancholy emotional', 'heartbreak acoustic ballad', 'melancholic indie folk'];
      case 'ANGRY':
        return ['aggressive rock intense', 'angry metal hardcore', 'rage punk alternative'];
      case 'ANXIOUS':
        return ['calm relaxing peaceful', 'anxiety relief meditation', 'soothing ambient instrumental'];
      case 'EXCITED':
        return ['energetic pump up motivation', 'party celebration high energy', 'workout intense beat'];
      case 'CALM':
      default:
        return ['chill relaxing ambient', 'peaceful meditation zen', 'soft acoustic tranquil'];
    }
  }

  private getLanguageSpecificQueries(emotion: string, language?: string): string[] {
    if (!language) return [];

    const emotionKeyword = this.getLocalizedEmotionKeyword(emotion, language);
    
    switch (language) {
      case 'fa': // Persian/Farsi
        return [
          `persian ${emotionKeyword} traditional`,
          `iranian ${emotionKeyword} classical`,
          `farsi pop ${emotionKeyword}`
        ];
      case 'de': // German
        return [
          `german ${emotionKeyword} musik`,
          `deutsche ${emotionKeyword} songs`,
          `german pop ${emotionKeyword}`
        ];
      case 'en':
      default:
        return [
          `english ${emotionKeyword} popular`,
          `american ${emotionKeyword} hits`,
          `british ${emotionKeyword} indie`
        ];
    }
  }

  private getLocalizedEmotionKeyword(emotion: string, language?: string): string {
    const translations = {
      HAPPY: { fa: 'شاد', de: 'fröhlich', en: 'happy' },
      SAD: { fa: 'غمگین', de: 'traurig', en: 'sad' },
      ANGRY: { fa: 'عصبانی', de: 'wütend', en: 'angry' },
      ANXIOUS: { fa: 'آرام', de: 'entspannend', en: 'calm' },
      EXCITED: { fa: 'هیجان‌زده', de: 'aufgeregt', en: 'excited' },
      CALM: { fa: 'آرام', de: 'ruhig', en: 'calm' }
    };

    const lang = language || 'en';
    return translations[emotion.toUpperCase() as keyof typeof translations]?.[lang as keyof any] || 'music';
  }

  private getMarketByLanguage(language?: string): string {
    switch (language) {
      case 'fa': return 'IR'; // Iran
      case 'de': return 'DE'; // Germany
      case 'en':
      default: return 'US'; // United States
    }
  }

  private getDemoRecommendations(emotion: string, language?: string): MusicRecommendation[] {
    const demoTracks = {
      HAPPY: [
        { trackName: "Happy", artist: "Pharrell Williams", spotifyUrl: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH", previewUrl: null, trackId: "60nZcImufyMA1MKQY3dcCH" },
        { trackName: "Can't Stop the Feeling!", artist: "Justin Timberlake", spotifyUrl: "https://open.spotify.com/track/0BxE4FqsDD1Ot4YuBXwlpU", previewUrl: null, trackId: "0BxE4FqsDD1Ot4YuBXwlpU" }
      ],
      SAD: [
        { trackName: "Someone Like You", artist: "Adele", spotifyUrl: "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV", previewUrl: null, trackId: "1zwMYTA5nlNjZxYrvBB2pV" },
        { trackName: "Mad World", artist: "Gary Jules", spotifyUrl: "https://open.spotify.com/track/3JOVTQ5h8HGFnDdp4VT3MP", previewUrl: null, trackId: "3JOVTQ5h8HGFnDdp4VT3MP" }
      ],
      ANGRY: [
        { trackName: "In the End", artist: "Linkin Park", spotifyUrl: "https://open.spotify.com/track/60a0Rd6pjrkxjPbaKzXjfq", previewUrl: null, trackId: "60a0Rd6pjrkxjPbaKzXjfq" },
        { trackName: "Break Stuff", artist: "Limp Bizkit", spotifyUrl: "https://open.spotify.com/track/3zBhihYUHBmGd2bcQIobrF", previewUrl: null, trackId: "3zBhihYUHBmGd2bcQIobrF" }
      ],
      ANXIOUS: [
        { trackName: "Weightless", artist: "Marconi Union", spotifyUrl: "https://open.spotify.com/track/2WfaOiMkCvy7F5fcp2zZ8L", previewUrl: null, trackId: "2WfaOiMkCvy7F5fcp2zZ8L" },
        { trackName: "Clair de Lune", artist: "Claude Debussy", spotifyUrl: "https://open.spotify.com/track/5XKIy7EzGRqEQcOJ6uZlhX", previewUrl: null, trackId: "5XKIy7EzGRqEQcOJ6uZlhX" }
      ],
      EXCITED: [
        { trackName: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", spotifyUrl: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS", previewUrl: null, trackId: "32OlwWuMpZ6b0aN2RZOeMS" },
        { trackName: "Thunder", artist: "Imagine Dragons", spotifyUrl: "https://open.spotify.com/track/1zB4vmk8tFRmM9UULNzbLB", previewUrl: null, trackId: "1zB4vmk8tFRmM9UULNzbLB" }
      ],
      CALM: [
        { trackName: "River", artist: "Leon Bridges", spotifyUrl: "https://open.spotify.com/track/4Gb6rBVeAHZKKp8gJyZuF3", previewUrl: null, trackId: "4Gb6rBVeAHZKKp8gJyZuF3" },
        { trackName: "Holocene", artist: "Bon Iver", spotifyUrl: "https://open.spotify.com/track/6KBeJB6Q3uOUTmmpF7AbzU", previewUrl: null, trackId: "6KBeJB6Q3uOUTmmpF7AbzU" }
      ]
    };

    return demoTracks[emotion.toUpperCase() as keyof typeof demoTracks] || demoTracks.CALM;
  }
}

export const spotifyService = new SpotifyService();