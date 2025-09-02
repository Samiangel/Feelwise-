import { useState } from 'react';
import { Play, ExternalLink, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { useI18n } from '../hooks/useI18n';

export interface MusicTrack {
  trackName: string;
  artist: string;
  spotifyUrl: string;
  previewUrl: string | null;
  trackId: string;
}

interface SpotifyTrackListProps {
  tracks: MusicTrack[];
  emotion: string;
}

export function SpotifyTrackList({ tracks, emotion }: SpotifyTrackListProps) {
  const { t } = useI18n();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayPreview = (track: MusicTrack) => {
    if (!track.previewUrl) return;

    // Stop currently playing track
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    if (playingTrack === track.trackId) {
      setPlayingTrack(null);
      setAudioElement(null);
      return;
    }

    // Play new track
    const audio = new Audio(track.previewUrl);
    audio.addEventListener('ended', () => {
      setPlayingTrack(null);
      setAudioElement(null);
    });
    
    audio.play().then(() => {
      setPlayingTrack(track.trackId);
      setAudioElement(audio);
    }).catch(console.error);
  };

  const getEmotionIcon = () => {
    switch (emotion.toUpperCase()) {
      case 'HAPPY': return '🎵';
      case 'SAD': return '🎼';
      case 'ANGRY': return '🎸';
      case 'ANXIOUS': return '🌊';
      case 'EXCITED': return '⚡';
      case 'CALM': return '🕯️';
      default: return '🎶';
    }
  };

  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <GlassCard className="p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{getEmotionIcon()}</div>
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {t('spotifyRecommendations')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('musicForYourMood')}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {tracks.map((track, index) => (
            <motion.div
              key={track.trackId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
            >
              {/* Play Button */}
              <button
                onClick={() => handlePlayPreview(track)}
                disabled={!track.previewUrl}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full 
                  transition-all duration-200 
                  ${track.previewUrl
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-600 hover:text-green-500'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                  ${playingTrack === track.trackId ? 'bg-green-500/40 scale-110' : ''}
                `}
              >
                {track.previewUrl ? (
                  playingTrack === track.trackId ? (
                    <div className="w-3 h-3 border-2 border-current rounded-full animate-pulse" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )
                ) : (
                  <Headphones className="w-4 h-4" />
                )}
              </button>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {track.trackName}
                </h4>
                <p className="text-sm text-muted-foreground truncate">
                  {track.artist}
                </p>
              </div>

              {/* Spotify Link */}
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-600 hover:text-green-500 transition-all duration-200"
                title={t('openInSpotify')}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">S</span>
          </div>
          <span>{t('poweredBySpotify')}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}