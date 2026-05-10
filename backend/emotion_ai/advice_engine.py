"""
EmotiSense Advice Engine — Generates emotion-specific advice and tips.

Curated response templates mapped to detected emotions, providing
contextual, helpful advice for each emotional state.
"""
import random

# ─── Advice Templates ────────────────────────────────
ADVICE_MAP = {
    'happy': {
        'responses': [
            "Your positive energy is wonderful! Keep nurturing what brings you joy.",
            "It's great to feel happy! Consider sharing this positivity with someone around you.",
            "Happiness looks good on you! Take a moment to appreciate what made you feel this way.",
        ],
        'tips': [
            "Write down what made you happy today — gratitude journaling boosts long-term wellbeing",
            "Share your good mood with someone you care about",
            "Use this positive energy to tackle something you've been putting off",
            "Take a photo or note to remember this moment",
            "Practice savoring — slow down and fully experience this positive feeling",
        ],
    },
    'sad': {
        'responses': [
            "It's okay to feel sad. Your emotions are valid, and this feeling will pass.",
            "Remember that sadness is a natural part of life. Be gentle with yourself right now.",
            "Take some rest and talk with someone you trust. You don't have to carry this alone.",
        ],
        'tips': [
            "Go for a short walk — movement naturally lifts mood",
            "Listen to relaxing or uplifting music",
            "Practice deep breathing: 4 counts in, 7 hold, 8 counts out",
            "Reach out to a friend or loved one for support",
            "Write about your feelings — expressive writing helps process emotions",
        ],
    },
    'angry': {
        'responses': [
            "Anger is a signal that something matters to you. Let's channel it constructively.",
            "Take a moment to breathe before reacting. Your feelings are valid but actions are choices.",
            "It's natural to feel angry sometimes. Let's work through this together.",
        ],
        'tips': [
            "Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you hear...",
            "Step away from the situation for 10 minutes",
            "Physical exercise is an excellent anger release",
            "Write down what triggered your anger — understanding patterns helps",
            "Practice progressive muscle relaxation",
        ],
    },
    'fear': {
        'responses': [
            "Fear is your mind trying to protect you. Let's separate real threats from anxious thoughts.",
            "You're braver than you think. This feeling will pass, and you'll grow from it.",
            "Acknowledge your fear without judgment. Courage isn't absence of fear, it's acting despite it.",
        ],
        'tips': [
            "Name your fear specifically — vague fears feel bigger than specific ones",
            "Practice box breathing: 4 counts in, 4 hold, 4 out, 4 hold",
            "Ask yourself: 'What's the worst that could realistically happen?'",
            "Focus on what you can control right now",
            "Ground yourself by pressing your feet firmly into the floor",
        ],
    },
    'anxiety': {
        'responses': [
            "Anxiety is tough, but you have the tools to manage it. Take it one moment at a time.",
            "Your anxious thoughts aren't facts. Let's ground you in the present moment.",
            "Remember: anxiety is temporary. You've gotten through this before.",
        ],
        'tips': [
            "Try the 4-7-8 breathing technique for immediate calm",
            "Limit caffeine and sugar intake today",
            "Practice the body scan: slowly check in with each body part",
            "Write down your worries and categorize them as 'can control' vs 'can't control'",
            "Put your phone down for 30 minutes and be present",
        ],
    },
    'calm': {
        'responses': [
            "What a peaceful state to be in. Cherish this calm and let it recharge you.",
            "Your calm presence is a strength. Use this clarity for mindful reflection.",
            "Being calm is a superpower. You're centered and ready for anything.",
        ],
        'tips': [
            "This is a great time for reflection and planning",
            "Practice mindfulness meditation to deepen this state",
            "Use this clarity to set intentions for the day",
            "Notice how your body feels in this calm state — remember it",
            "Consider journaling about what brought you to this peaceful place",
        ],
    },
    'love': {
        'responses': [
            "Love is the most powerful emotion. Let it flow freely and watch it multiply.",
            "The love you feel makes the world a better place. Express it openly.",
            "What a beautiful feeling. Love is both a gift you give and receive.",
        ],
        'tips': [
            "Express your love — tell someone important how you feel",
            "Write a letter of appreciation to someone you love",
            "Practice self-love: treat yourself as kindly as you'd treat a friend",
            "Create something beautiful inspired by this feeling",
            "Random act of kindness — spread the love to a stranger",
        ],
    },
    'excited': {
        'responses': [
            "Your excitement is contagious! Channel this energy into something amazing.",
            "What an electrifying feeling! Ride this wave and make it count.",
            "Excitement is the spark of great things to come. Embrace it fully!",
        ],
        'tips': [
            "Write down your ideas while this creative energy is flowing",
            "Share your excitement with others — it's a gift",
            "Set a specific goal to channel this energy productively",
            "Take action on something you've been thinking about",
            "Capture this feeling with a voice note or journal entry",
        ],
    },
    'stress': {
        'responses': [
            "Stress is your body's way of saying 'I need a break.' Listen to it.",
            "You're carrying a lot right now. Let's lighten the load, one step at a time.",
            "Stress is manageable. Let's break down what's overwhelming you.",
        ],
        'tips': [
            "Take 5 deep breaths right now — seriously, do it",
            "List your stressors and tackle the easiest one first for a quick win",
            "Step outside for 5 minutes of fresh air and sunlight",
            "Progressive muscle relaxation: tense and release each muscle group",
            "Delegate or postpone one non-essential task today",
        ],
    },
    'motivation': {
        'responses': [
            "Your motivation is powerful! Direct it with clear goals and watch yourself soar.",
            "This drive you feel is rare and precious. Make it count today.",
            "Motivated minds change the world. You're on the right track!",
        ],
        'tips': [
            "Set one specific, measurable goal right now",
            "Break your big goal into 3 small action items for today",
            "Visualize your success in vivid detail",
            "Share your goals with someone for accountability",
            "Start immediately — motivation fades, discipline sustains",
        ],
    },
    'depression': {
        'responses': [
            "I hear you, and your feelings matter. You're not alone in this.",
            "Depression lies to you — it says things won't get better, but they can and do.",
            "One small step at a time. Just getting through today is an achievement.",
        ],
        'tips': [
            "Please reach out to someone you trust or a professional counselor",
            "Try to do one small thing: take a shower, eat a meal, go outside for 2 minutes",
            "Remember: this is a medical condition, not a character flaw",
            "Crisis helpline: 988 Suicide & Crisis Lifeline (call or text 988)",
            "Be gentle with yourself today — you're fighting a hard battle",
        ],
    },
    'surprise': {
        'responses': [
            "Unexpected moments keep life interesting! Process this at your own pace.",
            "Surprise can be thrilling or unsettling — either way, you're handling it.",
            "Take a breath and assess. Surprises often lead to the best stories.",
        ],
        'tips': [
            "Take a moment to process before reacting",
            "Write down what surprised you and how it makes you feel",
            "Share the surprise with someone close to you",
            "Use this unexpected energy to try something new",
            "Reflect on how surprises have led to growth in the past",
        ],
    },
    'disgust': {
        'responses': [
            "Disgust often signals a boundary violation. Honor what feels wrong to you.",
            "Your reaction tells you something important about your values.",
            "It's okay to remove yourself from situations that feel wrong.",
        ],
        'tips': [
            "Identify what specifically triggered this feeling",
            "Set a clear boundary if someone or something crossed a line",
            "Redirect your attention to something positive",
            "Practice self-care to cleanse the emotional residue",
            "Talk about it — processing disgust helps move past it",
        ],
    },
    'neutral': {
        'responses': [
            "A neutral state is a blank canvas. What would you like to create with it?",
            "Sometimes neutral is exactly where you need to be. It's okay to just be.",
            "Use this balanced state for clear-headed thinking and decision making.",
        ],
        'tips': [
            "This is a good time for planning and reflection",
            "Try something new to spark a different emotion",
            "Practice gratitude — list 3 things you're thankful for",
            "Set an intention for how you'd like to feel today",
            "Use this balanced moment for an important conversation",
        ],
    },
}


def generate_advice(emotion: str) -> dict:
    """
    Generate contextual advice based on detected emotion.

    Args:
        emotion: The detected emotion string

    Returns:
        dict with ai_response (str) and tips (list of str)
    """
    advice = ADVICE_MAP.get(emotion, ADVICE_MAP['neutral'])

    return {
        'ai_response': random.choice(advice['responses']),
        'tips': random.sample(advice['tips'], k=min(3, len(advice['tips']))),
    }
