from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Trip, Activity, Expense, Checklist
from .serializers import (TripSerializer, TripListSerializer, ActivitySerializer, 
                          ExpenseSerializer, ChecklistSerializer)
from django.db.models import Sum, Count, Q

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'destination']
    search_fields = ['title', 'destination', 'description']
    ordering_fields = ['start_date', 'created_at', 'budget']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TripListSerializer
        return TripSerializer

    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        trip = self.get_object()
        activities = trip.activities.all()
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        trip = self.get_object()
        stats = {
            'total_activities': trip.activities.count(),
            'completed_activities': trip.activities.filter(completed=True).count(),
            'total_expenses': trip.expenses.aggregate(total=Sum('amount'))['total'] or 0,
            'expenses_by_category': list(
                trip.expenses.values('category')
                .annotate(total=Sum('amount'))
                .order_by('-total')
            ),
            'checklist_progress': {
                'total': trip.checklist_items.count(),
                'completed': trip.checklist_items.filter(completed=True).count()
            },
            'budget_status': {
                'budget': float(trip.budget) if trip.budget else 0,
                'spent': float(trip.actual_cost),
                'remaining': float(trip.budget_remaining) if trip.budget_remaining else 0
            }
        }
        return Response(stats)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        trips = self.get_queryset()
        data = {
            'total_trips': trips.count(),
            'upcoming_trips': trips.filter(status='upcoming').count(),
            'ongoing_trips': trips.filter(status='ongoing').count(),
            'completed_trips': trips.filter(status='completed').count(),
            'recent_trips': TripListSerializer(trips[:5], many=True).data,
        }
        return Response(data)

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['trip', 'category', 'completed']
    ordering_fields = ['date', 'time']

    @action(detail=True, methods=['post'])
    def toggle_complete(self, request, pk=None):
        activity = self.get_object()
        activity.completed = not activity.completed
        activity.save()
        return Response({'completed': activity.completed})

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['trip', 'category']
    ordering_fields = ['date', 'amount']

class ChecklistViewSet(viewsets.ModelViewSet):
    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['trip', 'completed']

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        item = self.get_object()
        item.completed = not item.completed
        item.save()
        return Response({'completed': item.completed})
