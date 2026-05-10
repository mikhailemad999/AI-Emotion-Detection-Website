import React from 'react';
import { motion } from 'framer-motion';

const EmotionCard = ({ emotion, confidence, emoji, color, isPrimary = false, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className={`glass-panel rounded-2xl overflow-hidden relative ${
        isPrimary ? 'p-6 sm:p-8 col-span-full md:col-span-2 shadow-2xl' : 'p-4 col-span-1 shadow-lg'
      }`}
      style={{
        borderColor: isPrimary ? `${color}40` : '',
        boxShadow: isPrimary ? `0 20px 40px -10px ${color}20` : ''
      }}
    >
      {/* Background Glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[64px] opacity-30"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className={`text-text-muted font-medium uppercase tracking-wider ${isPrimary ? 'text-sm mb-1' : 'text-xs mb-1'}`}>
              {isPrimary ? 'Primary Emotion' : 'Secondary'}
            </p>
            <h3 className={`font-display font-bold capitalize ${isPrimary ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>
              {emotion}
            </h3>
          </div>
          <div className={`${isPrimary ? 'text-5xl sm:text-6xl' : 'text-3xl'} drop-shadow-lg`}>
            {emoji}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono font-medium ${isPrimary ? 'text-xl' : 'text-sm'}`}>
              {confidence.toFixed(1)}%
            </span>
            <span className="text-xs text-text-muted">Confidence</span>
          </div>
          
          {/* Progress Bar */}
          <div className={`w-full bg-surface-hover rounded-full overflow-hidden ${isPrimary ? 'h-3' : 'h-1.5'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionCard;
