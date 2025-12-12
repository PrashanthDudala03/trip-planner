from django.http import JsonResponse

def home(request):
    return JsonResponse({
        'status': 'ok',
        'app': 'Trip Planner',
        'backend': 'running'
    })
