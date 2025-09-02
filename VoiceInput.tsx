import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '../hooks/useI18n';
import { useApp } from '../contexts/AppContext';
import { TimoriCharacter } from '../components/TimoriCharacter';
import { GlassCard } from '../components/GlassCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ArrowLeft, Mic, Square, Play } from 'lucide-react';

export function VoiceInput() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { analyzeEmotion, isLoading, error } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Note: This is a simplified voice implementation
  // In a production app, you would integrate with Web Speech API or a service like OpenAI Whisper
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Simulate transcription for demo
      setTranscription("I'm feeling really stressed about work today. There's so much pressure and I don't know how to handle it all...");
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      setTranscription('');
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          handleToggleRecording();
        }
      }, 30000);
    }
  };

  const handleAnalyze = async () => {
    if (!transcription.trim()) return;
    
    await analyzeEmotion(transcription, 'voice');
    if (!error) {
      setLocation('/result');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <LoadingOverlay isVisible={isLoading} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-8">
        <button 
          onClick={() => setLocation('/')}
          className="glass glass-hover rounded-full p-3 shadow-lg"
        >
          <ArrowLeft className="text-white text-lg" />
        </button>
        <h2 className="text-xl font-semibold text-white">{t('voice_input.title')}</h2>
        <div className="w-10"></div>
      </div>

      {/* Timori Character */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TimoriCharacter 
          emotion="DEFAULT" 
          size="lg" 
          className="mx-auto" 
          animated={isRecording}
        />
        <p className="text-white/80 mt-4">{t('voice_input.prompt')}</p>
      </motion.div>

      {/* Voice Recording Interface */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Recording Button */}
        <motion.button
          onClick={handleToggleRecording}
          className="w-32 h-32 glass glass-hover rounded-full shadow-2xl mb-8 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={isRecording ? { duration: 1, repeat: Infinity } : {}}
        >
          {isRecording ? (
            <Square className="text-white text-4xl" />
          ) : (
            <Mic className="text-white text-4xl" />
          )}
        </motion.button>

        {/* Recording Status */}
        {isRecording && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white">{t('voice_input.recording')}</span>
            </div>
            <div className="text-white/70 text-sm">
              {formatTime(recordingTime)} / 02:00
            </div>
          </motion.div>
        )}

        {/* Transcription Display */}
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-6 mb-4">
              <h3 className="text-white font-semibold mb-3">{t('voice_input.transcription')}</h3>
              <p className="text-white/80 mb-4">{transcription}</p>
              <GlassCard 
                hover 
                onClick={handleAnalyze}
                className="w-full p-3"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Play className="text-white text-sm" />
                  <span className="text-white font-semibold">{t('voice_input.analyze')}</span>
                </div>
              </GlassCard>
            </GlassCard>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-4 border-red-400/50 mb-4">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Voice Tips */}
        {!transcription && !isRecording && (
          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm mb-2">{t('voice_input.tips_title')}</p>
            <ul className="text-white/60 text-xs space-y-1">
              <li>{t('voice_input.tip1')}</li>
              <li>{t('voice_input.tip2')}</li>
              <li>{t('voice_input.tip3')}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
