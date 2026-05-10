import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth';
import emotionService from '../services/emotionService';

const Profile = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFullHistory = async () => {
      try {
        const res = await emotionService.getHistory(50); // Get more for profile
        if (res.success) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    loadFullHistory();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[64px]" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="w-24 h-24 rounded-full object-cover border-4 border-surface" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-display font-bold text-4xl border-4 border-surface shadow-xl">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-display font-bold mb-1">{user?.username}</h1>
            <p className="text-text-muted mb-4">{user?.email}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
              <div className="bg-surface px-4 py-2 rounded-xl border border-border">
                <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">Joined</span>
                <span className="font-medium">{user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'Recently'}</span>
              </div>
              <div className="bg-surface px-4 py-2 rounded-xl border border-border">
                <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">Total Entries</span>
                <span className="font-medium">{user?.total_analyses || history.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* History Feed */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">Complete History</h2>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {history.map((record, idx) => (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-5 rounded-2xl hover:bg-surface-hover transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold capitalize px-2 py-1 bg-surface rounded text-sm">
                      {record.detected_emotion}
                    </span>
                    <time className="text-xs text-text-muted font-mono">
                      {format(new Date(record.created_at), 'MMM d, HH:mm')}
                    </time>
                  </div>
                  <p className="text-text italic opacity-90 leading-relaxed text-sm">"{record.text_input}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-10 rounded-2xl text-center text-text-muted">
            No history found. Start analyzing your emotions to build your timeline.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
