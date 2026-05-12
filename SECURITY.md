# EmotiSense Security Overview

This document outlines the security measures implemented in the EmotiSense platform to protect user data and ensure system reliability.

## 1. Authentication & Authorization
- **JWT (JSON Web Tokens)**: We use Stateless JWT authentication via `djangorestframework-simplejwt`.
- **Refresh Token Rotation**: Tokens are rotated on every refresh to prevent long-lived session hijacking.
- **Timing Attack Mitigation**: The `LoginView` implements dummy password hashing when a user is not found, ensuring consistent response times and preventing user enumeration.
- **Secure Password Storage**: Passwords are hashed using PBKDF2 with SHA256 (Django default).

## 2. API Security
- **CORS (Cross-Origin Resource Sharing)**: Strictly configured to allow only the production domain and authorized local development ports.
- **Input Sanitization**: All user input is validated through Django Rest Framework serializers. Input text for AI analysis is truncated to 512 characters to prevent DoS attacks on the NLP model.
- **Rate Limiting**: (Planned) Implementation of DRF Throttling for authentication endpoints.

## 3. Data Protection
- **Secrets Management**: Sensitive credentials (DB passwords, Secret Keys, Redis URLs) are managed via `.env` files and never committed to version control.
- **Database Isolation**: PostgreSQL runs in a private Docker network, accessible only by the backend service.

## 4. Infrastructure Security
- **Dockerized Environment**: Services are isolated in containers with minimal privileges.
- **Nginx Proxy**: Serves as a secure gateway, handling static files and routing API requests while hiding internal service architecture.
- **Health Monitoring**: A dedicated `/api/health/` endpoint provides real-time status of critical dependencies (DB, Redis).

## 5. Security Best Practices
- **Custom Exception Handling**: API errors are sanitized to prevent leaking stack traces or internal configuration details to the end user.
- **Secure Defaults**: All production settings (Debug=False, Allowed Hosts, etc.) are strictly enforced in the Docker environment.
