import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useI18n } from '../hooks/useI18n';
import { useApp } from '../contexts/AppContext';
import { TimoriCharacter } from '../components/TimoriCharacter';
import { GlassCard } from '../components/GlassCard';
import { getEmotionInfo } from '../lib/emotions';
import { getStats } from '../lib/storage';
import { ArrowLeft, Download, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function History() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { history, loadHistory } = useApp();
  const stats = getStats();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'feelwise-history.json';
    link.click();
  };

  const getTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const emotionCounts = Object.entries(stats.thisWeek).map(([emotion, count]) => ({
    emotion,
    count,
    info: getEmotionInfo(emotion),
  }));

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-8">
        <button 
          onClick={() => setLocation('/')}
          className="glass glass-hover rounded-full p-3 shadow-lg"
        >
          <ArrowLeft className="text-white text-lg" />
        </button>
        <h2 className="text-xl font-semibold text-white">{t('history.title')}</h2>
        <button 
          onClick={handleExport}
          className="glass glass-hover rounded-full p-3 shadow-lg"
        >
          <Download className="text-white text-lg" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {/* Stats Overview */}
        <GlassCard className="p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">{t('history.this_week')}</h3>
          <div className="grid grid-cols-3 gap-4">
            {emotionCounts.slice(0, 3).map(({ emotion, count, info }) => (
              <div key={emotion} className="text-center">
                <div className="text-2xl mb-2">{info.emoji}</div>
                <div className="text-white font-bold text-lg">{count}</div>
                <div className="text-white/70 text-xs">{t(`emotions.${emotion.toLowerCase()}`)}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* History List */}
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-4">{t('history.recent')}</h3>
          
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <TimoriCharacter emotion="CALM" size="md" className="mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">{t('history.empty')}</h4>
              <p className="text-white/70 text-sm">{t('history.empty_desc')}</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {history.map((analysis, index) => {
                const emotionInfo = getEmotionInfo(analysis.emotion);
                return (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard hover className="p-4">
                      <div className="flex items-center space-x-4">
                        <TimoriCharacter 
                          emotion={analysis.emotion} 
                          size="sm" 
                          animated={false}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-white font-semibold ${emotionInfo.color}`}>
                              {emotionInfo.emoji} {analysis.emotion}
                            </span>
                            <div className="flex items-center space-x-1 text-white/70 text-sm">
                              <Clock className="w-3 h-3" />
                              <span>{getTimeAgo(analysis.timestamp)}</span>
                            </div>
                          </div>
                          <p className="text-white/80 text-sm mt-1 truncate">
                            {analysis.inputText}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-white/60 text-xs">
                              {Math.round(analysis.confidence * 100)}% confidence
                            </span>
                            <span className="text-white/40 text-xs">•</span>
                            <span className="text-white/60 text-xs">
                              {analysis.inputType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        {history.length > 0 && (
          <motion.div 
            className="mt-6 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="glass glass-hover rounded-full px-4 py-2 text-white text-sm">
              {t('history.all')}
            </button>
            {emotionCounts.map(({ emotion, info }) => (
              <button
                key={emotion}
                className="glass glass-hover rounded-full px-4 py-2 text-white text-sm"
              >
                {info.emoji} {t(`emotions.${emotion.toLowerCase()}`)}
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
