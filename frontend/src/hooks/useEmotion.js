import { useContext } from 'react';
import { EmotionContext } from '../context/EmotionContext';

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
};

export default useEmotion;
