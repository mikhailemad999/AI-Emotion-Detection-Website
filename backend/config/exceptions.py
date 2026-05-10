"""Custom exception handler for DRF."""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Handle exceptions with consistent JSON response format."""
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            'success': False,
            'error': {
                'status_code': response.status_code,
                'message': _get_error_message(response),
            }
        }
        response.data = custom_data
    else:
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        response = Response(
            {
                'success': False,
                'error': {
                    'status_code': 500,
                    'message': 'An unexpected error occurred.',
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response


def _get_error_message(response):
    """Extract a human-readable error message from the DRF response."""
    if isinstance(response.data, dict):
        messages = []
        for field, errors in response.data.items():
            if isinstance(errors, list):
                for error in errors:
                    messages.append(f"{field}: {error}" if field != 'detail' else str(error))
            else:
                messages.append(str(errors))
        return ' | '.join(messages) if messages else 'An error occurred.'
    elif isinstance(response.data, list):
        return ' | '.join(str(e) for e in response.data)
    return str(response.data)
