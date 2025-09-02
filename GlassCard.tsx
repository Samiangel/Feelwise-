import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  animated?: boolean;
}

export function GlassCard({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  animated = false 
}: GlassCardProps) {
  const baseClasses = 'glass rounded-2xl shadow-xl';
  const hoverClasses = hover ? 'glass-hover cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const allClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  const motionProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  if (animated) {
    return (
      <motion.div
        className={allClasses}
        onClick={onClick}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={allClasses} onClick={onClick}>
      {children}
    </div>
  );
}
