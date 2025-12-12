from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "healthy"
    except:
        db_status = "unhealthy"
    
    return JsonResponse({
        'status': 'healthy',
        'service': 'trip-planner-backend',
        'database': db_status
    })
