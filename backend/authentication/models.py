from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user model with profile fields for EmotiSense."""
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True, default='')
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    @property
    def total_analyses(self):
        return self.emotion_records.count()
