# EmotiSense — AI Emotion Detection Web Application

> Full-stack, production-ready emotion analysis platform powered by HuggingFace NLP.

EmotiSense allows users to type or speak their thoughts, diary notes, or feelings, and uses advanced Natural Language Processing (NLP) to analyze the emotional state behind the text.

## Features

- **Real-time AI Analysis**: Detects 14 nuanced emotional states (Happy, Sad, Angry, Fear, Anxiety, Calm, Love, Excited, Stress, Motivation, Depression, Surprise, Disgust, Neutral).
- **AI-Generated Advice**: Provides curated, contextual advice and actionable tips based on the detected emotion.
- **Voice Input**: Speak your thoughts using the Web Speech API.
- **Emotion Tracking**: Visualizes mood history over time with interactive charts.
- **Retro-Futuristic Design**: A premium glassmorphism UI with dynamic gradient backgrounds that shift colors based on your current emotion.
- **Secure & Private**: JWT authentication with completely private emotion records.

## Tech Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS, Framer Motion, Recharts, Axios
- **Backend**: Django 5, Django REST Framework, SimpleJWT
- **Database/Cache**: PostgreSQL 15, Redis 7
- **AI Engine**: HuggingFace Transformers (`j-hartmann/emotion-english-distilroberta-base`), PyTorch
- **DevOps**: Docker, Docker Compose, Nginx, Gunicorn, WhiteNoise

## Project Structure

```text
.
├── backend/          # Django backend & NLP engine
├── frontend/         # React + Vite frontend
├── nginx/            # Nginx reverse proxy & static file server
├── postman/          # API collection
├── .github/          # CI/CD workflows
└── docker-compose.yml
```

## Quick Start (Docker)

The easiest way to run the project is using Docker Compose.

1. **Clone the repository**
2. **Start the containers**
   ```bash
   docker compose up --build -d
   ```
   **Windows Users:** You can also simply double-click the `start_project.bat` file in the root directory.
   
   *Note: The first build will take several minutes as it downloads the HuggingFace model (~260MB) and PyTorch.*
3. **Access the Application**
   - Frontend: `http://localhost:8080`
   - Backend API: `http://localhost:8080/api/`
   - Django Admin: `http://localhost:8080/admin/`

## Manual Local Development Setup

If you prefer to run the services manually:

### Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Ensure PostgreSQL and Redis are running locally.
6. Create a `.env` file based on `.env.example`.
7. Run migrations: `python manage.py migrate`
8. Start the server: `python manage.py runserver`

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file with `VITE_API_URL=http://localhost:8000/api`
4. Start the dev server: `npm run dev`

## API Documentation

A Postman collection is included in `postman/EmotiSense.postman_collection.json`. Import this into Postman to explore the APIs.

### Main Endpoints
- `POST /api/auth/register/` - Create a new user
- `POST /api/auth/login/` - Get JWT tokens
- `POST /api/emotion/analyze/` - Submit text for NLP analysis
- `GET /api/emotion/history/` - Get user's past analyses
- `GET /api/emotion/stats/` - Get aggregated analytics data

## Troubleshooting

**Model taking too long to load:**
The PyTorch CPU model is downloaded during the Docker build process to speed up container startup. If the build seems stuck at `pipeline('text-classification', ...)`, it is downloading the ~260MB model.

**Database connection errors:**
Ensure the `postgres` container is healthy before the backend tries to connect. The `entrypoint.sh` script automatically waits for Postgres.
