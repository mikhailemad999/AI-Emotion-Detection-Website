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
                'fields': _get_field_errors(response),
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
                    'fields': {},
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response


def _get_field_errors(response):
    """Extract per-field error details from DRF response data."""
    fields = {}
    if isinstance(response.data, dict):
        for field, errors in response.data.items():
            if field in ('detail',):
                continue
            if isinstance(errors, list):
                fields[field] = [str(e) for e in errors]
            elif isinstance(errors, dict):
                # Nested field errors
                for sub_field, sub_errors in errors.items():
                    key = f"{field}.{sub_field}"
                    if isinstance(sub_errors, list):
                        fields[key] = [str(e) for e in sub_errors]
                    else:
                        fields[key] = [str(sub_errors)]
            else:
                fields[field] = [str(errors)]
    return fields


def _get_error_message(response):
    """Extract a human-readable error message from the DRF response."""
    if isinstance(response.data, dict):
        # First, check for 'detail' key (standard DRF error)
        if 'detail' in response.data:
            return str(response.data['detail'])

        # Collect first error from each field for a summary
        messages = []
        for field, errors in response.data.items():
            if isinstance(errors, list):
                for error in errors:
                    label = field.replace('_', ' ').capitalize()
                    messages.append(f"{label}: {error}" if field != 'non_field_errors' else str(error))
            elif isinstance(errors, dict):
                for sub_field, sub_errors in errors.items():
                    label = sub_field.replace('_', ' ').capitalize()
                    if isinstance(sub_errors, list):
                        for e in sub_errors:
                            messages.append(f"{label}: {e}")
                    else:
                        messages.append(f"{label}: {sub_errors}")
            else:
                messages.append(str(errors))
        return ' | '.join(messages) if messages else 'An error occurred.'
    elif isinstance(response.data, list):
        return ' | '.join(str(e) for e in response.data)
    return str(response.data)
