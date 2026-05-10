#!/bin/bash
set -e

echo "=== EmotiSense Backend Starting ==="

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! python -c "
import psycopg2
import os
try:
    conn = psycopg2.connect(
        dbname=os.environ.get('DB_NAME', 'emotisense'),
        user=os.environ.get('DB_USER', 'emotisense_user'),
        password=os.environ.get('DB_PASSWORD', 'emotisense_pass_2024'),
        host=os.environ.get('DB_HOST', 'postgres'),
        port=os.environ.get('DB_PORT', '5432')
    )
    conn.close()
    print('PostgreSQL is ready!')
except Exception as e:
    print(f'Waiting... {e}')
    exit(1)
" 2>/dev/null; do
    sleep 2
done

echo "Running migrations..."
python manage.py makemigrations authentication emotion_ai --noinput
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
