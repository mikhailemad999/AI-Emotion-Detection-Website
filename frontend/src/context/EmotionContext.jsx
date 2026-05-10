import React, { createContext, useState, useCallback } from 'react';
import emotionService from '../services/emotionService';

export const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeEmotion = async (text) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await emotionService.analyze(text);
      if (res.success) {
        setCurrentAnalysis(res.data);
        // Refresh history and stats in the background after analysis
        fetchHistory(5);
        fetchStats();
        return res.data;
      } else {
        throw new Error(res.error?.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'An error occurred during analysis');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = useCallback(async (limit = 20) => {
    try {
      const res = await emotionService.getHistory(limit);
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await emotionService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
  };

  return (
    <EmotionContext.Provider value={{
      currentAnalysis,
      history,
      stats,
      isLoading,
      error,
      analyzeEmotion,
      fetchHistory,
      fetchStats,
      clearCurrentAnalysis
    }}>
      {children}
    </EmotionContext.Provider>
  );
};
