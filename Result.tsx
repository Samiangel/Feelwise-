import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '../hooks/useI18n';
import { useApp } from '../contexts/AppContext';
import { TimoriCharacter } from '../components/TimoriCharacter';
import { GlassCard } from '../components/GlassCard';
import { SpotifyTrackList } from '../components/SpotifyTrackList';
import { getEmotionInfo } from '../lib/emotions';
import { updateStats } from '../lib/storage';
import { Home, Share2, RefreshCw, Save } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface SpotifyTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  previewUrl: string | null;
  trackId: string;
}

interface ExtendedEmotionAnalysis {
  id: string;
  emotion: string;
  confidence: number;
  intensity?: string;
  quote?: string;
  musicRecommendation?: string;
  spotifyTracks?: SpotifyTrack[];
  timestamp: string;
}

export function Result() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { currentAnalysis } = useApp() as { currentAnalysis: ExtendedEmotionAnalysis | null };
  const { toast } = useToast();

  React.useEffect(() => {
    if (!currentAnalysis) {
      setLocation('/');
    }
  }, [currentAnalysis, setLocation]);

  if (!currentAnalysis) {
    return null;
  }

  const emotionInfo = getEmotionInfo(currentAnalysis.emotion);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FeelWise Emotion Analysis',
          text: `I just analyzed my emotions with FeelWise! Feeling ${currentAnalysis.emotion.toLowerCase()} with ${Math.round(currentAnalysis.confidence * 100)}% confidence.`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(
        `Check out my emotion analysis from FeelWise: ${currentAnalysis.emotion} (${Math.round(currentAnalysis.confidence * 100)}% confidence)`
      );
      toast({
        title: "Copied to clipboard!",
        description: "Result copied to clipboard for sharing.",
      });
    }
  };

  const handleSave = () => {
    updateStats(currentAnalysis.emotion);
    toast({
      title: "Result saved!",
      description: "Your emotion analysis has been saved to history.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-8">
        <button 
          onClick={() => setLocation('/')}
          className="glass glass-hover rounded-full p-3 shadow-lg"
        >
          <Home className="text-white text-lg" />
        </button>
        <h2 className="text-xl font-semibold text-white">{t('result.title')}</h2>
        <button 
          onClick={handleShare}
          className="glass glass-hover rounded-full p-3 shadow-lg"
        >
          <Share2 className="text-white text-lg" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {/* Timori with Emotion */}
        <div className="text-center mb-8">
          <TimoriCharacter 
            emotion={currentAnalysis.emotion} 
            size="xl" 
            className="mx-auto mb-6" 
          />
          
          <GlassCard className="p-6 mb-6">
            <h3 className="text-white text-lg mb-2">{t('result.detected_emotion')}</h3>
            <div className={`text-4xl font-bold mb-4 ${emotionInfo.color}`}>
              {emotionInfo.emoji} {currentAnalysis.emotion}
            </div>
            <div className="flex justify-center space-x-8 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${emotionInfo.color}`}>
                  {Math.round(currentAnalysis.confidence * 100)}%
                </div>
                <div className="text-white/70 text-xs">{t('result.confidence')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentAnalysis.intensity}</div>
                <div className="text-white/70 text-xs">{t('result.intensity')}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recommendations */}
        <div className="space-y-4 mb-8">
          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start space-x-3">
                <div className="text-white/70 text-lg mt-1">💭</div>
                <div>
                  <p className="text-white font-medium mb-2">"{currentAnalysis.quote}"</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Music Recommendation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🎵</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{t('result.recommended_music')}</h4>
                  <p className="text-white/80">{currentAnalysis.musicRecommendation}</p>
                  <p className="text-white/60 text-sm">Perfect for your current mood</p>
                </div>
                <button className="glass glass-hover rounded-full p-3">
                  <span className="text-white">▶️</span>
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Breathing Exercise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🫁</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{t('result.breathing_exercise')}</h4>
                  <p className="text-white/80">{t('result.breathing_desc')}</p>
                  <p className="text-white/60 text-sm">{t('result.breathing_time')}</p>
                </div>
                <button className="glass glass-hover rounded-full p-3">
                  <span className="text-white">▶️</span>
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Spotify Music Recommendations */}
        {currentAnalysis.spotifyTracks && currentAnalysis.spotifyTracks.length > 0 && (
          <SpotifyTrackList 
            tracks={currentAnalysis.spotifyTracks} 
            emotion={currentAnalysis.emotion}
          />
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard 
            hover 
            onClick={() => setLocation('/')}
            className="flex-1 p-4"
          >
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="text-white text-sm" />
              <span className="text-white font-semibold">{t('result.analyze_again')}</span>
            </div>
          </GlassCard>
          
          <GlassCard 
            hover 
            onClick={handleSave}
            className="flex-1 p-4"
          >
            <div className="flex items-center justify-center space-x-2">
              <Save className="text-white text-sm" />
              <span className="text-white font-semibold">{t('result.save')}</span>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
