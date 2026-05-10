import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import useEmotion from '../hooks/useEmotion';

// Helper to map emotion to its color (must match backend mapping)
const getEmotionColor = (emotion) => {
  const colors = {
    happy: '#FFD93D', sad: '#6C9BCF', angry: '#FF6B6B',
    fear: '#9B59B6', anxiety: '#E67E22', calm: '#4ECDC4',
    love: '#FF69B4', excited: '#FF6B6B', stress: '#E74C3C',
    motivation: '#2ECC71', depression: '#34495E', surprise: '#F39C12',
    disgust: '#95A5A6', neutral: '#BDC3C7',
  };
  return colors[emotion] || colors.neutral;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-border shadow-xl">
        <p className="font-medium text-text">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.payload.fill }}>
            {entry.name === 'count' ? 'Entries' : entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { stats, fetchStats } = useEmotion();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchStats();
      setLoading(false);
    };
    loadData();
  }, [fetchStats]);

  // Format data for Recharts
  const weeklyData = useMemo(() => {
    if (!stats?.weekly_data) return [];
    // Ensure chronological order (backend might return newest first depending on query)
    return [...stats.weekly_data].reverse();
  }, [stats]);

  const pieData = useMemo(() => {
    if (!stats?.emotion_distribution) return [];
    return stats.emotion_distribution.map(item => ({
      name: item.detected_emotion.charAt(0).toUpperCase() + item.detected_emotion.slice(1),
      value: item.count,
      fill: getEmotionColor(item.detected_emotion)
    }));
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Mood Analytics</h1>
        <p className="text-text-muted">Understand your emotional patterns over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl lg:col-span-2"
        >
          <h3 className="text-lg font-bold font-display mb-6">Last 7 Days Activity</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-hover)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.dominant ? getEmotionColor(entry.dominant) : 'var(--color-border)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-text-muted mt-4 text-center">Colors indicate the dominant emotion for that day.</p>
        </motion.div>

        {/* Emotion Distribution Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl flex flex-col items-center"
        >
          <h3 className="text-lg font-bold font-display mb-2 self-start">All-Time Distribution</h3>
          
          {pieData.length > 0 ? (
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              Not enough data yet.
            </div>
          )}
        </motion.div>

        {/* Top Emotions List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h3 className="text-lg font-bold font-display mb-6">Top Emotions</h3>
          <div className="space-y-4">
            {pieData.slice(0, 5).map((emotion, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: emotion.fill }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{emotion.name}</span>
                    <span className="text-text-muted">{emotion.value} entries</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(emotion.value / stats.total_analyses) * 100}%`,
                        backgroundColor: emotion.fill 
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
            {pieData.length === 0 && (
              <p className="text-text-muted text-center py-8">Not enough data to display.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
