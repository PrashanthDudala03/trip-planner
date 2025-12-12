from django.contrib import admin
from .models import Trip, Activity, Expense, Checklist

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['title', 'destination', 'start_date', 'end_date', 'status', 'budget', 'actual_cost']
    list_filter = ['status', 'start_date']
    search_fields = ['title', 'destination']
    date_hierarchy = 'start_date'

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['name', 'trip', 'category', 'date', 'time', 'completed', 'cost']
    list_filter = ['completed', 'category', 'date']
    search_fields = ['name', 'trip__title']

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['description', 'trip', 'category', 'amount', 'date']
    list_filter = ['category', 'date']
    search_fields = ['description', 'trip__title']

@admin.register(Checklist)
class ChecklistAdmin(admin.ModelAdmin):
    list_display = ['item', 'trip', 'completed', 'priority']
    list_filter = ['completed']
