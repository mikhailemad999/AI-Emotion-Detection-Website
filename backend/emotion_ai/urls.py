from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.EmotionAnalyzeView.as_view(), name='emotion-analyze'),
    path('history/', views.EmotionHistoryView.as_view(), name='emotion-history'),
    path('stats/', views.EmotionStatsView.as_view(), name='emotion-stats'),
]
