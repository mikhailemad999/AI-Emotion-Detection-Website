from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """Root API endpoint providing project information and health status."""
    return Response({
        'name': 'EmotiSense AI API',
        'version': '1.0.0',
        'status': 'operational',
        'endpoints': {
            'health': '/api/health/',
            'auth': '/api/auth/',
            'emotion': '/api/emotion/',
        }
    })
