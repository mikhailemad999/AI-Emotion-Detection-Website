import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-primary font-medium mb-8">
          <SparklesIcon className="w-4 h-4" />
          <span>AI-Powered Emotional Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
          Understand your <br className="hidden md:block" />
          <span className="text-gradient">emotional landscape</span>
        </h1>

        <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          Type your thoughts, diary entries, or feelings. EmotiSense uses advanced Natural Language Processing to detect the nuanced emotions behind your words and provides personalized advice.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? "/analyzer" : "/register"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Start Analyzing <ArrowRightIcon className="w-5 h-5" />
          </Link>
          
          {!isAuthenticated && (
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 glass-panel rounded-xl font-bold text-lg hover:bg-surface-hover transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        {[
          {
            icon: SparklesIcon,
            title: "Real-time AI Analysis",
            desc: "Instantly detect 14 distinct emotions including nuanced states like anxiety and motivation."
          },
          {
            icon: ChartBarIcon,
            title: "Emotion Tracking",
            desc: "Visualize your mood over time with interactive charts to discover personal emotional patterns."
          },
          {
            icon: ShieldCheckIcon,
            title: "Private & Secure",
            desc: "Your thoughts belong to you. All entries are securely stored and completely private."
          }
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
            <p className="text-text-muted">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
