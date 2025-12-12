from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, ActivityViewSet, ExpenseViewSet, ChecklistViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'checklist', ChecklistViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
