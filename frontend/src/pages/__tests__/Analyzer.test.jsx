import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Analyzer from '../Analyzer';
import { EmotionContext } from '../../context/EmotionContext';

// Mock heroicons to avoid issues with SVG rendering in tests
vi.mock('@heroicons/react/24/outline', () => ({
  SparklesIcon: () => <div data-testid="sparkles-icon" />,
  MicrophoneIcon: () => <div data-testid="microphone-icon" />,
  DocumentArrowDownIcon: () => <div data-testid="document-icon" />,
  StopIcon: () => <div data-testid="stop-icon" />,
  LightBulbIcon: () => <div data-testid="lightbulb-icon" />,
  HeartIcon: () => <div data-testid="heart-icon" />,
}));

const mockContextValue = {
  analyzeEmotion: vi.fn(),
  currentAnalysis: null,
  isLoading: false,
  error: null,
  clearCurrentAnalysis: vi.fn(),
};

const renderWithContext = (ui, { contextValue = mockContextValue } = {}) => {
  return render(
    <EmotionContext.Provider value={contextValue}>
      {ui}
    </EmotionContext.Provider>
  );
};

describe('Analyzer Page', () => {
  it('renders input section correctly', () => {
    renderWithContext(<Analyzer />);
    expect(screen.getByPlaceholderText(/How are you feeling/i)).toBeDefined();
    expect(screen.getByText('Analyze')).toBeDefined();
  });

  it('updates textarea value on change', () => {
    renderWithContext(<Analyzer />);
    const textarea = screen.getByPlaceholderText(/How are you feeling/i);
    fireEvent.change(textarea, { target: { value: 'I am happy' } });
    expect(textarea.value).toBe('I am happy');
  });

  it('calls analyzeEmotion when button is clicked', async () => {
    const analyzeEmotion = vi.fn();
    renderWithContext(<Analyzer />, { 
      contextValue: { ...mockContextValue, analyzeEmotion } 
    });
    
    const textarea = screen.getByPlaceholderText(/How are you feeling/i);
    fireEvent.change(textarea, { target: { value: 'I am happy' } });
    
    const analyzeButton = screen.getByText('Analyze');
    fireEvent.click(analyzeButton);
    
    expect(analyzeEmotion).toHaveBeenCalledWith('I am happy');
  });

  it('shows loading state', () => {
    renderWithContext(<Analyzer />, { 
      contextValue: { ...mockContextValue, isLoading: true } 
    });
    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled();
  });

  it('renders analysis results when available', () => {
    const currentAnalysis = {
      emotion: 'joy',
      confidence: 90,
      emoji: '😊',
      color: '#FFD700',
      ai_response: 'That is great!',
      tips: ['Keep smiling'],
      secondary_emotions: [],
    };
    
    renderWithContext(<Analyzer />, { 
      contextValue: { ...mockContextValue, currentAnalysis } 
    });
    
    expect(screen.getByText('joy')).toBeDefined();
    expect(screen.getByText('90.0%')).toBeDefined();
    expect(screen.getByText(/That is great!/i)).toBeDefined();
  });
});
