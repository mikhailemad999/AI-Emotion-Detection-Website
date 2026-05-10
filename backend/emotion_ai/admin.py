from django.contrib import admin
from .models import EmotionRecord, MoodInsight


@admin.register(EmotionRecord)
class EmotionRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'detected_emotion', 'confidence_score', 'created_at']
    list_filter = ['detected_emotion', 'created_at']
    search_fields = ['user__email', 'text_input']
    readonly_fields = ['created_at']


@admin.register(MoodInsight)
class MoodInsightAdmin(admin.ModelAdmin):
    list_display = ['user', 'period', 'created_at']
    list_filter = ['period', 'created_at']
