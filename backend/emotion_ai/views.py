import logging
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import EmotionRecord
from .serializers import (
    EmotionAnalyzeRequestSerializer,
    EmotionRecordSerializer,
)
from .ai_engine import analyze_emotion
from .advice_engine import generate_advice

logger = logging.getLogger('emotion_ai')


class EmotionAnalyzeView(APIView):
    """Analyze text for emotional content using NLP."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EmotionAnalyzeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data['text']
        logger.info(f"Analyzing emotion for user {request.user.id}")

        # Run NLP analysis
        analysis = analyze_emotion(text)

        # Generate advice
        advice = generate_advice(analysis['emotion'])

        # Save to database
        record = EmotionRecord.objects.create(
            user=request.user,
            text_input=text,
            detected_emotion=analysis['emotion'],
            confidence_score=analysis['confidence'],
            secondary_emotions=analysis['secondary_emotions'],
            ai_response=advice['ai_response'],
            tips=advice['tips'],
        )

        return Response({
            'success': True,
            'data': {
                'record_id': record.id,
                'emotion': analysis['emotion'],
                'confidence': analysis['confidence'],
                'secondary_emotions': analysis['secondary_emotions'],
                'ai_response': advice['ai_response'],
                'tips': advice['tips'],
                'emoji': analysis['emoji'],
                'color': analysis['color'],
                'all_emotions': analysis.get('all_emotions', []),
            }
        })


class EmotionHistoryView(APIView):
    """Get user's emotion analysis history."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        limit = int(request.query_params.get('limit', 20))
        records = EmotionRecord.objects.filter(
            user=request.user
        )[:limit]

        serializer = EmotionRecordSerializer(records, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': records.count() if hasattr(records, 'count') else len(serializer.data),
        })


class EmotionStatsView(APIView):
    """Get aggregated emotion statistics."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)

        user_records = EmotionRecord.objects.filter(user=request.user)
        total = user_records.count()

        # Most common emotion
        most_common = user_records.values('detected_emotion').annotate(
            count=Count('id')
        ).order_by('-count').first()

        # Weekly data (last 7 days)
        weekly_records = user_records.filter(created_at__gte=week_ago)
        weekly_data = []
        for i in range(7):
            day = now - timedelta(days=6 - i)
            day_records = weekly_records.filter(
                created_at__date=day.date()
            )
            day_emotions = day_records.values('detected_emotion').annotate(
                count=Count('id')
            ).order_by('-count')

            weekly_data.append({
                'date': day.strftime('%Y-%m-%d'),
                'day': day.strftime('%a'),
                'count': day_records.count(),
                'dominant': day_emotions[0]['detected_emotion'] if day_emotions else None,
            })

        # Monthly data
        monthly_records = user_records.filter(created_at__gte=month_ago)
        monthly_distribution = list(
            monthly_records.values('detected_emotion').annotate(
                count=Count('id')
            ).order_by('-count')
        )

        # Emotion distribution (all time)
        distribution = list(
            user_records.values('detected_emotion').annotate(
                count=Count('id')
            ).order_by('-count')
        )

        return Response({
            'success': True,
            'data': {
                'total_analyses': total,
                'most_common_emotion': most_common['detected_emotion'] if most_common else None,
                'weekly_data': weekly_data,
                'monthly_data': monthly_distribution,
                'emotion_distribution': distribution,
            }
        })
