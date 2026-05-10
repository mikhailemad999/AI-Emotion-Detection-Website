import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ChartBarIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import useEmotion from '../hooks/useEmotion';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const { history, stats, fetchHistory, fetchStats } = useEmotion();

  useEffect(() => {
    fetchHistory(5);
    fetchStats();
  }, [fetchHistory, fetchStats]);

  // Determine dominant emotion color for the background
  const dominantColor = stats?.most_common_emotion === 'happy' ? '#FFD93D' : 
                        stats?.most_common_emotion === 'sad' ? '#6C9BCF' : 
                        stats?.most_common_emotion === 'anxiety' ? '#E67E22' : '#4ECDC4';

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Hello, {user?.username}</h1>
          <p className="text-text-muted">Here is your emotional overview.</p>
        </div>
        <Link
          to="/analyzer"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          New Entry
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40"
        >
          <p className="text-text-muted font-medium">Total Entries</p>
          <h2 className="text-5xl font-display font-bold">{stats?.total_analyses || 0}</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40 relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[40px] opacity-20" style={{ backgroundColor: dominantColor }} />
          <p className="text-text-muted font-medium relative z-10">Dominant Mood</p>
          <h2 className="text-4xl font-display font-bold capitalize relative z-10">
            {stats?.most_common_emotion || 'Neutral'}
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40 bg-gradient-to-br from-primary/10 to-secondary/10"
        >
          <div className="flex items-center justify-between">
            <p className="text-text-muted font-medium">Deep Dive</p>
            <ChartBarIcon className="w-6 h-6 text-primary" />
          </div>
          <Link to="/analytics" className="flex items-center gap-2 text-primary font-bold group">
            View Analytics <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Recent History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold">Recent Entries</h2>
          <Link to="/profile" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((record, idx) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (idx * 0.05) }}
                className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-surface-hover transition-colors"
              >
                <div className="flex-1 max-w-2xl">
                  <p className="text-text line-clamp-2 italic mb-2">"{record.text_input}"</p>
                  <p className="text-xs text-text-muted">
                    {formatDistanceToNow(new Date(record.created_at), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="font-bold capitalize">{record.detected_emotion}</p>
                    <p className="text-xs text-text-muted">{record.confidence_score.toFixed(1)}% confidence</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-panel p-10 rounded-2xl text-center">
              <p className="text-text-muted mb-4">You haven't recorded any entries yet.</p>
              <Link to="/analyzer" className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors">
                Create your first entry
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
