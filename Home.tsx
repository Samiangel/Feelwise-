import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '../hooks/useI18n';
import { useApp } from '../contexts/AppContext';
import { TimoriCharacter } from '../components/TimoriCharacter';
import { GlassCard } from '../components/GlassCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSelector } from '../components/LanguageSelector';
import { getStats } from '../lib/storage';
import { Keyboard, Mic, History } from 'lucide-react';

export function Home() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { history } = useApp();
  const stats = getStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      <motion.div
        className="w-full max-w-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Title */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <TimoriCharacter emotion="HAPPY" size="xl" className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-3">{t('app.title')}</h1>
          <p className="text-white/80 text-lg">{t('app.subtitle')}</p>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div className="space-y-4 mb-8" variants={itemVariants}>
          <GlassCard hover onClick={() => setLocation('/text-input')} className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Keyboard className="text-white text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg">{t('home.analyze_text')}</h3>
                <p className="text-white/70 text-sm">{t('home.analyze_text_desc')}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard hover onClick={() => setLocation('/voice-input')} className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="text-white text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg">{t('home.analyze_voice')}</h3>
                <p className="text-white/70 text-sm">{t('home.analyze_voice_desc')}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalAnalyses}</div>
                <div className="text-white/70 text-xs">{t('home.analyses')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.streak}</div>
                <div className="text-white/70 text-xs">{t('home.days_streak')}</div>
              </div>
              <button 
                onClick={() => setLocation('/history')} 
                className="text-center hover:scale-105 transition-transform"
              >
                <History className="text-2xl text-white mx-auto" />
                <div className="text-white/70 text-xs">{t('home.history')}</div>
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
