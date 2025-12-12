from rest_framework.views import APIView
from rest_framework.response import Response

class HealthV1(APIView):
    def get(self, request):
        return Response({
            "service": "trip-planner",
            "status": "healthy",
            "api_version": "v1",
            "framework": "DRF"
        })
