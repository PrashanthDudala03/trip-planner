from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Trip(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips', null=True, blank=True)
    title = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    image = models.ImageField(upload_to='trip_images/', null=True, blank=True)
    is_public = models.BooleanField(default=False)
    travelers_count = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def duration_days(self):
        return (self.end_date - self.start_date).days + 1

    @property
    def budget_remaining(self):
        if self.budget:
            return self.budget - self.actual_cost
        return None

class Activity(models.Model):
    CATEGORY_CHOICES = [
        ('sightseeing', 'Sightseeing'),
        ('food', 'Food & Dining'),
        ('adventure', 'Adventure'),
        ('relaxation', 'Relaxation'),
        ('shopping', 'Shopping'),
        ('entertainment', 'Entertainment'),
        ('transport', 'Transport'),
        ('accommodation', 'Accommodation'),
        ('other', 'Other'),
    ]
    
    trip = models.ForeignKey(Trip, related_name='activities', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=300, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    completed = models.BooleanField(default=False)
    rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    notes = models.TextField(blank=True)
    booking_reference = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.name} - {self.trip.title}"

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('accommodation', 'Accommodation'),
        ('food', 'Food & Drinks'),
        ('transport', 'Transport'),
        ('activities', 'Activities'),
        ('shopping', 'Shopping'),
        ('other', 'Other'),
    ]
    
    trip = models.ForeignKey(Trip, related_name='expenses', on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, related_name='expenses', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    date = models.DateField()
    currency = models.CharField(max_length=3, default='USD')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.description} - ${self.amount}"

class Checklist(models.Model):
    trip = models.ForeignKey(Trip, related_name='checklist_items', on_delete=models.CASCADE)
    item = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    category = models.CharField(max_length=50, default='general')
    priority = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-priority', 'completed', 'created_at']

    def __str__(self):
        return self.item
