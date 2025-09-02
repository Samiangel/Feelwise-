import { motion } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const { t } = useI18n();

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass rounded-2xl p-8 shadow-2xl text-center">
        <motion.div
          className="w-20 h-20 mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full border-4 border-white/20 border-t-white"></div>
        </motion.div>
        <h3 className="text-white font-semibold mb-2">{t('loading.analyzing')}</h3>
        <p className="text-white/80 text-sm">{t('loading.subtitle')}</p>
      </div>
    </motion.div>
  );
}
