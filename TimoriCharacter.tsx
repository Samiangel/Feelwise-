import { motion } from 'framer-motion';
import timoriHappy from '@assets/timori_happy_1753687523686.png';
import timoriSad from '@assets/timori_sad_1753687523686.png';
import timoriAngry from '@assets/timori_angry_1753687523686.png';
import timoriAnxious from '@assets/timori_anxious_1753687523686.png';
import timoriExcited from '@assets/timori_excited_1753687523686.png';
import timoriCalm from '@assets/timori_calm_1753687523686.png';

interface TimoriCharacterProps {
  emotion?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const emotionImages = {
  HAPPY: timoriHappy,
  SAD: timoriSad,
  ANGRY: timoriAngry,
  ANXIOUS: timoriAnxious,
  EXCITED: timoriExcited,
  CALM: timoriCalm,
  DEFAULT: timoriCalm,
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

export function TimoriCharacter({ 
  emotion = 'DEFAULT', 
  size = 'lg', 
  animated = true,
  className = '' 
}: TimoriCharacterProps) {
  const imageUrl = emotionImages[emotion as keyof typeof emotionImages] || emotionImages.DEFAULT;
  
  const motionProps = animated ? {
    animate: {
      y: [0, -10, 0],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative`}
      {...motionProps}
    >
      <img
        src={imageUrl}
        alt={`Timori expressing ${emotion.toLowerCase()}`}
        className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-white/20"
      />
      
      {/* Status indicator */}
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-2 border-white">
        <motion.div
          className="w-full h-full bg-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}
