from rest_framework import serializers
from .models import Trip, Activity, Expense, Checklist
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Activity
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)
    checklist_items = ChecklistSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    duration_days = serializers.ReadOnlyField()
    budget_remaining = serializers.ReadOnlyField()
    activities_count = serializers.SerializerMethodField()
    completed_activities = serializers.SerializerMethodField()
    
    class Meta:
        model = Trip
        fields = '__all__'
    
    def get_activities_count(self, obj):
        return obj.activities.count()
    
    def get_completed_activities(self, obj):
        return obj.activities.filter(completed=True).count()

class TripListSerializer(serializers.ModelSerializer):
    duration_days = serializers.ReadOnlyField()
    activities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Trip
        fields = ['id', 'title', 'destination', 'start_date', 'end_date', 'budget', 
                  'status', 'image', 'duration_days', 'activities_count', 'created_at']
    
    def get_activities_count(self, obj):
        return obj.activities.count()
