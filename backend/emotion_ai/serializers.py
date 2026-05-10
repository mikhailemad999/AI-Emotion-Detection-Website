from rest_framework import serializers
from .models import EmotionRecord, MoodInsight


class EmotionAnalyzeRequestSerializer(serializers.Serializer):
    text = serializers.CharField(min_length=3, max_length=5000)


class EmotionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionRecord
        fields = [
            'id', 'text_input', 'detected_emotion', 'confidence_score',
            'secondary_emotions', 'ai_response', 'tips', 'created_at',
        ]
        read_only_fields = fields


class EmotionStatsSerializer(serializers.Serializer):
    total_analyses = serializers.IntegerField()
    most_common_emotion = serializers.CharField(allow_null=True)
    weekly_data = serializers.ListField()
    monthly_data = serializers.ListField()
    emotion_distribution = serializers.ListField()


class MoodInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodInsight
        fields = ['id', 'insight', 'emotion_summary', 'period', 'created_at']
        read_only_fields = fields
