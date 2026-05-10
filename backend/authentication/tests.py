import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def make_user(**kwargs):
        return User.objects.create_user(**kwargs)
    return make_user

@pytest.mark.django_db
class TestAuthenticationAPI:
    def test_user_registration(self, api_client):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'TestPassword123!',
            'password_confirm': 'TestPassword123!'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data['data']
        assert 'user' in response.data['data']
        assert User.objects.count() == 1

    def test_user_registration_password_mismatch(self, api_client):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'TestPassword123!',
            'password_confirm': 'WrongPassword!'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_user_login(self, api_client, create_user):
        user = create_user(username='loginuser', email='login@example.com', password='TestPassword123!')
        url = reverse('login')
        data = {
            'email': 'login@example.com',
            'password': 'TestPassword123!'
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data['data']['tokens']
        assert 'refresh' in response.data['data']['tokens']

    def test_profile_retrieval(self, api_client, create_user):
        user = create_user(username='profileuser', email='profile@example.com', password='TestPassword123!')
        
        # Authenticate
        url = reverse('login')
        response = api_client.post(url, {'email': 'profile@example.com', 'password': 'TestPassword123!'}, format='json')
        token = response.data['data']['tokens']['access']
        
        # Get profile
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        profile_url = reverse('profile')
        profile_response = api_client.get(profile_url)
        
        assert profile_response.status_code == status.HTTP_200_OK
        assert profile_response.data['data']['username'] == 'profileuser'
        assert profile_response.data['data']['email'] == 'profile@example.com'
