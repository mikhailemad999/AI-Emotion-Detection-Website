import pytest
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from emotion_ai.models import EmotionRecord

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_client(api_client):
    user = User.objects.create_user(username='testuser', email='test@test.com', password='Password123!')
    response = api_client.post(reverse('login'), {'email': 'test@test.com', 'password': 'Password123!'}, format='json')
    token = response.data['data']['tokens']['access']
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    api_client.user = user
    return api_client

@pytest.mark.django_db
class TestEmotionAPI:
    @patch('emotion_ai.views.analyze_emotion')
    @patch('emotion_ai.views.generate_advice')
    def test_analyze_emotion(self, mock_generate_advice, mock_analyze_emotion, auth_client):
        # Mock the AI responses to avoid loading the real model during tests
        mock_analyze_emotion.return_value = {
            'emotion': 'happy',
            'confidence': 95.5,
            'secondary_emotions': [{'emotion': 'excited', 'score': 80.0}],
            'emoji': '😊',
            'color': '#FFD700',
            'all_emotions': []
        }
        mock_generate_advice.return_value = {
            'ai_response': "You seem very happy today!",
            'tips': ["Share your joy with others."]
        }

        url = reverse('emotion-analyze')
        data = {'text': "I am feeling wonderful!"}
        response = auth_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['emotion'] == 'happy'
        assert response.data['data']['confidence'] == 95.5
        assert 'ai_response' in response.data['data']
        assert EmotionRecord.objects.count() == 1
        assert EmotionRecord.objects.first().user == auth_client.user

    def test_get_history(self, auth_client):
        EmotionRecord.objects.create(
            user=auth_client.user,
            text_input="I am sad",
            detected_emotion="sad",
            confidence_score=90.0,
            secondary_emotions={}
        )
        url = reverse('emotion-history')
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['data']) == 1
        assert response.data['data'][0]['detected_emotion'] == 'sad'

    def test_get_stats(self, auth_client):
        EmotionRecord.objects.create(
            user=auth_client.user, text_input="I am sad", detected_emotion="sad", confidence_score=90.0, secondary_emotions={}
        )
        EmotionRecord.objects.create(
            user=auth_client.user, text_input="I am happy", detected_emotion="happy", confidence_score=95.0, secondary_emotions={}
        )
        
        url = reverse('emotion-stats')
        response = auth_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['data']['total_analyses'] == 2
        # Stats are dynamically calculated so checking for presence is usually enough
        assert 'most_common_emotion' in response.data['data']
        assert 'emotion_distribution' in response.data['data']
