from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    RegisterSerializer, CustomTokenObtainPairSerializer
)

User = get_user_model()

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.role == 'admin' or request.user.role == 'superadmin')

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'superadmin'

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'superadmin':
            return User.objects.all().order_by('-created_at')
        elif user.role == 'admin':
            return User.objects.filter(role='user').order_by('-created_at')
        return User.objects.none()
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsSuperAdmin])
    def change_role(self, request, pk=None):
        user = self.get_object()
        new_role = request.data.get('role')
        
        if new_role not in ['user', 'admin', 'superadmin']:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.role = new_role
        user.save()
        
        return Response(UserSerializer(user).data)
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({'is_active': user.is_active})
    
    @action(detail=True, methods=['get'])
    def activity_log(self, request, pk=None):
        user = self.get_object()
        from trips.models import Trip
        from trips.serializers import TripListSerializer
        
        trips = user.trips.all()[:10]
        
        return Response({
            'recent_trips': TripListSerializer(trips, many=True).data,
            'total_trips': user.trips.count(),
            'active_trips': user.trips.filter(status__in=['upcoming', 'ongoing']).count()
        })

class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        from trips.models import Trip
        from trips.serializers import TripListSerializer
        
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        total_trips = Trip.objects.count()
        active_trips = Trip.objects.filter(status__in=['upcoming', 'ongoing']).count()
        
        users_by_role = {
            'superadmin': User.objects.filter(role='superadmin').count(),
            'admin': User.objects.filter(role='admin').count(),
            'user': User.objects.filter(role='user').count(),
        }
        
        trips_by_status = {
            'planning': Trip.objects.filter(status='planning').count(),
            'upcoming': Trip.objects.filter(status='upcoming').count(),
            'ongoing': Trip.objects.filter(status='ongoing').count(),
            'completed': Trip.objects.filter(status='completed').count(),
            'cancelled': Trip.objects.filter(status='cancelled').count(),
        }
        
        total_budget = Trip.objects.aggregate(total=Sum('budget'))['total'] or 0
        total_expenses = Trip.objects.aggregate(total=Sum('actual_cost'))['total'] or 0
        
        recent_users = User.objects.order_by('-created_at')[:5]
        recent_trips = Trip.objects.select_related('user').order_by('-created_at')[:10]
        
        top_destinations = Trip.objects.values('destination').annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        thirty_days_ago = datetime.now() - timedelta(days=30)
        new_users_month = User.objects.filter(created_at__gte=thirty_days_ago).count()
        new_trips_month = Trip.objects.filter(created_at__gte=thirty_days_ago).count()
        
        return Response({
            'system_stats': {
                'total_users': total_users,
                'active_users': active_users,
                'total_trips': total_trips,
                'active_trips': active_trips,
                'total_budget': float(total_budget),
                'total_expenses': float(total_expenses),
                'new_users_month': new_users_month,
                'new_trips_month': new_trips_month,
            },
            'users_by_role': users_by_role,
            'trips_by_status': trips_by_status,
            'recent_users': UserSerializer(recent_users, many=True).data,
            'recent_trips': TripListSerializer(recent_trips, many=True).data,
            'top_destinations': list(top_destinations),
        })

class UserDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        from trips.models import Trip
        from trips.serializers import TripListSerializer
        
        user = request.user
        
        if user.role == 'admin' or user.role == 'superadmin':
            return Response({'error': 'Admins should use admin dashboard'}, status=status.HTTP_403_FORBIDDEN)
        
        trips = user.trips.all()
        
        total_trips = trips.count()
        upcoming_trips = trips.filter(status='upcoming').count()
        ongoing_trips = trips.filter(status='ongoing').count()
        completed_trips = trips.filter(status='completed').count()
        
        total_expenses = trips.aggregate(total=Sum('actual_cost'))['total'] or 0
        total_budget = trips.aggregate(total=Sum('budget'))['total'] or 0
        
        favorite_destinations = trips.values('destination').annotate(
            count=Count('id')
        ).order_by('-count')[:3]
        
        recent_trips = trips.order_by('-created_at')[:5]
        upcoming = trips.filter(status='upcoming').order_by('start_date')[:3]
        
        return Response({
            'personal_stats': {
                'total_trips': total_trips,
                'upcoming_trips': upcoming_trips,
                'ongoing_trips': ongoing_trips,
                'completed_trips': completed_trips,
                'total_expenses': float(total_expenses),
                'total_budget': float(total_budget),
            },
            'favorite_destinations': list(favorite_destinations),
            'recent_trips': TripListSerializer(recent_trips, many=True).data,
            'upcoming_trips': TripListSerializer(upcoming, many=True).data,
        })
