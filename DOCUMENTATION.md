# EmotiSense Full Project Documentation

## 1. Project Overview
EmotiSense is a full-stack, AI-powered emotion detection web application. It allows users to input their thoughts, feelings, or diary notes (via text or speech), and uses advanced Natural Language Processing (NLP) to analyze the underlying emotional state.

### Key Features
- **Real-time AI Emotion Analysis**: Detects 14 nuanced emotional states using the `j-hartmann/emotion-english-distilroberta-base` model.
- **AI-Generated Advice**: Provides contextual advice and actionable tips based on the detected emotion.
- **Emotion Tracking & Analytics**: Visualizes mood history over time with interactive charts.
- **Voice Input**: Allows users to speak their thoughts using the Web Speech API.
- **Secure Authentication**: JWT-based user authentication.
- **Retro-Futuristic Design**: A premium glassmorphism UI with dynamic gradient backgrounds that shift colors based on the current emotion.

## 2. Technology Stack
- **Frontend**: React.js 18, Vite, Tailwind CSS, Framer Motion (for animations), Recharts (for analytics), Axios.
- **Backend**: Django 5, Django REST Framework, SimpleJWT (for authentication), Pytest (for testing).
- **AI Engine**: HuggingFace Transformers, PyTorch.
- **Database**: PostgreSQL (Production/Docker), SQLite (Local Testing fallback).
- **Caching**: Redis.
- **DevOps**: Docker, Docker Compose, Nginx, Gunicorn, WhiteNoise.

## 3. Architecture Design
The application is structured into isolated containers managed by Docker Compose:

1. **Frontend Container (`frontend`)**: Serves the React application (built with Vite) using a lightweight Node.js server during development, or statically served via Nginx in production.
2. **Backend Container (`backend`)**: Runs the Django application via Gunicorn. It handles API requests, interacts with the database, and performs NLP inference. The HuggingFace model is loaded using a Singleton pattern to optimize memory and inference speed.
3. **Database Container (`postgres`)**: A PostgreSQL instance storing user data, emotion records, and analytics.
4. **Cache Container (`redis`)**: A Redis instance (can be used for caching AI responses or session management).
5. **Reverse Proxy (`nginx`)**: An Nginx container that routes traffic to the frontend and backend, and serves static/media files.

## 4. Setup & Installation

### Option A: Docker Setup (Recommended)
1. **Clone the repository.**
2. **Set up Environment Variables**: Copy `.env.example` to `backend/.env` and `frontend/.env`.
3. **Start the containers**:
   ```bash
   docker compose up --build
   ```
   *Note: The first build downloads the NLP model (~260MB) and PyTorch.*
4. **Access the App**: Navigate to `http://localhost:8080`.

### Option B: Local Manual Setup
**Backend:**
1. `cd backend`
2. `python -m venv venv`
3. Activate: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

**Frontend:**
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 5. Testing Framework

The project implements a robust automated testing strategy.

### Backend Testing (Pytest)
The backend uses `pytest` and `pytest-django`. It is configured to fall back to a local SQLite database for fast, isolated test execution without requiring Docker.
- **Run Tests**:
  ```bash
  cd backend
  pytest
  ```
- **Coverage**: The test suite covers User Authentication (Registration, Login, Profile) and Emotion AI (Text Analysis, History Retrieval, Stats Aggregation).

### Frontend Testing (Vitest & React Testing Library)
The frontend testing infrastructure uses `vitest`, `jsdom`, and `@testing-library/react`.
- **Run Tests**:
  ```bash
  cd frontend
  npm run test
  ```

## 6. API Reference

### Authentication (`/api/auth/`)
- `POST /register/`: Create a new user. Requires `username`, `email`, `password`.
- `POST /login/`: Obtain JWT tokens. Requires `email`, `password`.
- `GET /profile/`: Get the authenticated user's profile. Requires Bearer Token.

### Emotion AI (`/api/emotion/`)
- `POST /analyze/`: Submit text for analysis. Requires `text`. Returns detected emotion, confidence score, and AI advice.
- `GET /history/`: Retrieve past emotion records.
- `GET /stats/`: Retrieve aggregated analytics (weekly/monthly data, most common emotion).

## 7. Environment Variables

### Backend (`backend/.env`)
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=emotisense
DB_USER=emotisense_user
DB_PASSWORD=emotisense_pass
DB_HOST=postgres
DB_PORT=5432
JWT_SECRET=your_jwt_secret
AI_MODEL_NAME=j-hartmann/emotion-english-distilroberta-base
REDIS_URL=redis://redis:6379/0
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80,http://localhost
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080/api
```
