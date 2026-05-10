import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmotionCard from '../EmotionCard';

describe('EmotionCard Component', () => {
  const mockProps = {
    emotion: 'happy',
    confidence: 95.5,
    emoji: '😊',
    color: '#FFD700',
    isPrimary: true,
  };

  it('renders emotion text correctly', () => {
    render(<EmotionCard {...mockProps} />);
    expect(screen.getByText('happy')).toBeDefined();
  });

  it('renders confidence score correctly', () => {
    render(<EmotionCard {...mockProps} />);
    expect(screen.getByText('95.5%')).toBeDefined();
  });

  it('renders emoji correctly', () => {
    render(<EmotionCard {...mockProps} />);
    expect(screen.getByText('😊')).toBeDefined();
  });

  it('displays "Primary Emotion" when isPrimary is true', () => {
    render(<EmotionCard {...mockProps} />);
    expect(screen.getByText('Primary Emotion')).toBeDefined();
  });

  it('displays "Secondary" when isPrimary is false', () => {
    render(<EmotionCard {...mockProps} isPrimary={false} />);
    expect(screen.getByText('Secondary')).toBeDefined();
  });
});
