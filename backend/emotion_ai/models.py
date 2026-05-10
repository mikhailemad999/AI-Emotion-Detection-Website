from django.db import models
from django.conf import settings


class EmotionRecord(models.Model):
    """Stores each emotion analysis result."""
    EMOTION_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('fear', 'Fear'),
        ('anxiety', 'Anxiety'),
        ('calm', 'Calm'),
        ('love', 'Love'),
        ('excited', 'Excited'),
        ('stress', 'Stress'),
        ('motivation', 'Motivation'),
        ('depression', 'Depression'),
        ('surprise', 'Surprise'),
        ('disgust', 'Disgust'),
        ('neutral', 'Neutral'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='emotion_records',
    )
    text_input = models.TextField()
    detected_emotion = models.CharField(max_length=50, choices=EMOTION_CHOICES)
    confidence_score = models.FloatField()
    secondary_emotions = models.JSONField(default=list)
    ai_response = models.TextField(blank=True, default='')
    tips = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'emotion_records'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['detected_emotion']),
        ]

    def __str__(self):
        return f"{self.user.username} — {self.detected_emotion} ({self.confidence_score:.1f}%)"


class MoodInsight(models.Model):
    """AI-generated mood insights for users."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mood_insights',
    )
    insight = models.TextField()
    emotion_summary = models.JSONField(default=dict)
    period = models.CharField(max_length=20, default='weekly')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'mood_insights'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — Insight ({self.created_at.date()})"
