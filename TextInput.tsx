import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '../hooks/useI18n';
import { useApp } from '../contexts/AppContext';
import { TimoriCharacter } from '../components/TimoriCharacter';
import { GlassCard } from '../components/GlassCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { quickEmotionTexts } from '../lib/emotions';
import { ArrowLeft, Brain } from 'lucide-react';

export function TextInput() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { analyzeEmotion, isLoading, error } = useApp();
  const [text, setText] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    await analyzeEmotion(text, 'text');
    if (!error) {
      setLocation('/result');
    }
  };

  const handleQuickEmotion = (emotion: keyof typeof quickEmotionTexts) => {
    setText(quickEmotionTexts[emotion]);
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
        <h2 className="text-xl font-semibold text-white">{t('text_input.title')}</h2>
        <div className="w-10"></div>
      </div>

      {/* Timori Character */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TimoriCharacter emotion="DEFAULT" size="md" className="mx-auto" />
        <p className="text-white/80 mt-4">{t('text_input.prompt')}</p>
      </motion.div>

      {/* Text Input */}
      <div className="flex-1 flex flex-col">
        <GlassCard className="p-1 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('text_input.placeholder')}
            className="w-full h-40 bg-transparent text-white placeholder-white/50 p-4 rounded-xl resize-none border-none outline-none"
            maxLength={1000}
          />
        </GlassCard>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <GlassCard className="p-4 border-red-400/50">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Submit Button */}
        <GlassCard 
          hover 
          onClick={handleAnalyze}
          className="p-4 mb-6"
        >
          <div className="flex items-center justify-center space-x-3">
            <Brain className="text-white text-xl group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold text-lg">{t('text_input.analyze')}</span>
          </div>
        </GlassCard>

        {/* Quick Emotion Buttons */}
        <div className="mt-6">
          <p className="text-white/70 text-sm mb-3">{t('text_input.quick_select')}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(quickEmotionTexts) as Array<keyof typeof quickEmotionTexts>).map((emotion) => (
              <motion.button
                key={emotion}
                onClick={() => handleQuickEmotion(emotion)}
                className="glass glass-hover rounded-full px-4 py-2 text-white text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {emotion === 'happy' && '😊'} {t(`emotions.${emotion}`)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
