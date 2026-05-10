"""
EmotiSense AI Engine — NLP Emotion Classification

Uses HuggingFace j-hartmann/emotion-english-distilroberta-base model
to classify text into emotional categories with confidence scores.
Singleton pattern ensures the model is loaded once and reused.
"""
import logging
from transformers import pipeline
from django.conf import settings

logger = logging.getLogger('emotion_ai')

# ─── Singleton Model Instance ────────────────────────
_emotion_pipeline = None


def get_emotion_pipeline():
    """Load and cache the emotion classification pipeline (singleton)."""
    global _emotion_pipeline
    if _emotion_pipeline is None:
        logger.info(f"Loading AI model: {settings.AI_MODEL_NAME}")
        _emotion_pipeline = pipeline(
            'text-classification',
            model=settings.AI_MODEL_NAME,
            top_k=None,
            device=-1,  # CPU
        )
        logger.info("AI model loaded successfully.")
    return _emotion_pipeline


# ─── Emotion Mapping ────────────────────────────────
# The base model outputs: anger, disgust, fear, joy, neutral, sadness, surprise
# We map these to our extended emotion categories
EMOTION_MAP = {
    'anger': 'angry',
    'disgust': 'disgust',
    'fear': 'fear',
    'joy': 'happy',
    'neutral': 'calm',
    'sadness': 'sad',
    'surprise': 'excited',
}

# Extended emotion inference rules (based on combinations + thresholds)
EXTENDED_EMOTIONS = {
    'anxiety': {'primary': ['fear'], 'min_score': 0.3, 'secondary': ['sadness']},
    'stress': {'primary': ['anger', 'fear'], 'min_score': 0.25, 'secondary': ['sadness']},
    'love': {'primary': ['joy'], 'min_score': 0.7, 'keywords': ['love', 'adore', 'heart', 'cherish', 'dear']},
    'motivation': {'primary': ['joy', 'surprise'], 'min_score': 0.5, 'keywords': ['goal', 'achieve', 'dream', 'future', 'success', 'motivated', 'determined']},
    'depression': {'primary': ['sadness'], 'min_score': 0.6, 'secondary': ['neutral'], 'keywords': ['depressed', 'hopeless', 'empty', 'worthless', 'numb']},
    'excited': {'primary': ['surprise', 'joy'], 'min_score': 0.4, 'keywords': ['excited', 'amazing', 'awesome', 'incredible', 'thrilled']},
}

# Emoji mapping for each emotion
EMOTION_EMOJIS = {
    'happy': '😊',
    'sad': '😢',
    'angry': '😠',
    'fear': '😰',
    'anxiety': '😟',
    'calm': '😌',
    'love': '❤️',
    'excited': '🤩',
    'stress': '😤',
    'motivation': '💪',
    'depression': '😞',
    'surprise': '😮',
    'disgust': '🤢',
    'neutral': '😐',
}

# Color mapping for UI
EMOTION_COLORS = {
    'happy': '#FFD93D',
    'sad': '#6C9BCF',
    'angry': '#FF6B6B',
    'fear': '#9B59B6',
    'anxiety': '#E67E22',
    'calm': '#4ECDC4',
    'love': '#FF69B4',
    'excited': '#FF6B6B',
    'stress': '#E74C3C',
    'motivation': '#2ECC71',
    'depression': '#34495E',
    'surprise': '#F39C12',
    'disgust': '#95A5A6',
    'neutral': '#BDC3C7',
}


def analyze_emotion(text: str) -> dict:
    """
    Analyze text for emotional content.

    Returns:
        dict with emotion, confidence, secondary_emotions, emoji, color
    """
    if not text or not text.strip():
        return {
            'emotion': 'neutral',
            'confidence': 0.0,
            'secondary_emotions': [],
            'emoji': EMOTION_EMOJIS['neutral'],
            'color': EMOTION_COLORS['neutral'],
        }

    pipe = get_emotion_pipeline()
    results = pipe(text[:512])[0]  # Limit input to model max

    # Sort by score descending
    results = sorted(results, key=lambda x: x['score'], reverse=True)

    # Map base model labels to our categories
    mapped_results = []
    raw_scores = {}
    for r in results:
        label = r['label'].lower()
        mapped_label = EMOTION_MAP.get(label, label)
        score = round(r['score'] * 100, 1)
        raw_scores[label] = r['score']
        mapped_results.append({
            'emotion': mapped_label,
            'score': score,
            'emoji': EMOTION_EMOJIS.get(mapped_label, '❓'),
        })

    # Check for extended emotions
    text_lower = text.lower()
    extended_candidates = []

    for ext_emotion, rules in EXTENDED_EMOTIONS.items():
        score = 0
        primary_match = False

        for primary in rules['primary']:
            if primary in raw_scores and raw_scores[primary] >= rules['min_score']:
                primary_match = True
                score = max(score, raw_scores[primary])

        if primary_match:
            # Boost score if keywords match
            keywords = rules.get('keywords', [])
            if keywords:
                keyword_match = any(kw in text_lower for kw in keywords)
                if keyword_match:
                    score = min(score * 1.3, 1.0)
                    extended_candidates.append({
                        'emotion': ext_emotion,
                        'score': round(score * 100, 1),
                        'emoji': EMOTION_EMOJIS.get(ext_emotion, '❓'),
                    })
            else:
                extended_candidates.append({
                    'emotion': ext_emotion,
                    'score': round(score * 100 * 0.85, 1),
                    'emoji': EMOTION_EMOJIS.get(ext_emotion, '❓'),
                })

    # Determine primary emotion
    primary = mapped_results[0]

    # Check if an extended emotion should be primary
    if extended_candidates:
        best_extended = max(extended_candidates, key=lambda x: x['score'])
        if best_extended['score'] > primary['score'] * 0.8:
            primary = best_extended

    # Build secondary emotions (top 3, excluding primary)
    all_emotions = mapped_results + extended_candidates
    seen = set()
    secondary = []
    for e in sorted(all_emotions, key=lambda x: x['score'], reverse=True):
        if e['emotion'] != primary['emotion'] and e['emotion'] not in seen:
            seen.add(e['emotion'])
            secondary.append(e)
            if len(secondary) >= 3:
                break

    return {
        'emotion': primary['emotion'],
        'confidence': primary['score'],
        'secondary_emotions': secondary,
        'emoji': EMOTION_EMOJIS.get(primary['emotion'], '❓'),
        'color': EMOTION_COLORS.get(primary['emotion'], '#BDC3C7'),
        'all_emotions': mapped_results[:7],
    }
