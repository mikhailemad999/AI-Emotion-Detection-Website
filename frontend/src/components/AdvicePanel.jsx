import React from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon, HeartIcon } from '@heroicons/react/24/outline';

const AdvicePanel = ({ aiResponse, tips, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden"
    >
      {/* Decorative side accent */}
      <div 
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center gap-3 mb-6">
        <div 
          className="p-2 rounded-xl"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          <LightBulbIcon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-display font-bold">AI Insights</h3>
      </div>

      <div className="space-y-6">
        {/* Main Response */}
        <div className="bg-surface-hover rounded-xl p-5 border border-border">
          <p className="text-lg leading-relaxed font-medium">
            "{aiResponse}"
          </p>
        </div>

        {/* Tips List */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
            <HeartIcon className="w-4 h-4" /> Recommended Actions
          </h4>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                className="flex items-start gap-3"
              >
                <div 
                  className="mt-1 w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-text-muted">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvicePanel;
