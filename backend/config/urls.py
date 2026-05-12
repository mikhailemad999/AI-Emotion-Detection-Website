"""EmotiSense URL Configuration"""
from django.contrib import admin
from django.urls import path, include

from .health import health_check
from .views import api_root

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/health/', health_check, name='health_check'),
    path('api/auth/', include('authentication.urls')),
    path('api/emotion/', include('emotion_ai.urls')),
]
