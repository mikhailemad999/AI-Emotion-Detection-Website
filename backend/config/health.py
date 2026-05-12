from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError
import redis
from django.conf import settings

def health_check(request):
    """
    Lightweight health check for monitoring systems.
    Verifies DB and Redis connectivity.
    """
    health = {
        "status": "healthy",
        "services": {
            "database": "up",
            "redis": "up"
        }
    }
    
    # Check Database
    try:
        db_conn = connections['default']
        db_conn.cursor()
    except OperationalError:
        health["status"] = "unhealthy"
        health["services"]["database"] = "down"
        
    # Check Redis
    try:
        r = redis.from_url(settings.REDIS_URL, socket_connect_timeout=1)
        r.ping()
    except Exception:
        health["status"] = "unhealthy"
        health["services"]["redis"] = "down"
        
    status_code = 200 if health["status"] == "healthy" else 503
    return JsonResponse(health, status=status_code)
