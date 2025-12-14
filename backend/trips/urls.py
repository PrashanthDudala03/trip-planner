from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, ActivityViewSet, ExpenseViewSet, ChecklistViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet, basename='trip')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'checklist', ChecklistViewSet, basename='checklist')

urlpatterns = [
    path('', include(router.urls)),
]
