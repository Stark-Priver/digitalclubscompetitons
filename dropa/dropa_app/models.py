from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone
from datetime import timedelta
import os
import pickle
import pandas as pd
import numpy as np

class User(AbstractUser):
    ROLE_CHOICES = [
        ('sender', 'Sender'),
        ('receiver', 'Receiver'),
        ('courier', 'Courier'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='sender')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    rating = models.FloatField(default=5.0)
    total_deliveries = models.IntegerField(default=0)
    is_online = models.BooleanField(default=False)
    last_location_lat = models.FloatField(null=True, blank=True)
    last_location_lng = models.FloatField(null=True, blank=True)
    last_active = models.DateTimeField(auto_now=True)
    
    groups = models.ManyToManyField(
        Group,
        related_name='dropa_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='dropa_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )
    
    def __str__(self):
        return f"{self.username} ({self.role})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    def update_rating(self):
        """Update courier rating based on delivery performance"""
        if self.role == 'courier':
            deliveries = self.deliveries.filter(status='delivered')
            if deliveries.exists():
                # Calculate rating based on delivery time performance
                avg_rating = 0
                for delivery in deliveries:
                    predicted_time = delivery.predicted_delivery_time or 60
                    actual_time = delivery.actual_delivery_time or 60
                    performance = min(5.0, max(1.0, 5.0 - abs(actual_time - predicted_time) / 30))
                    avg_rating += performance
                self.rating = avg_rating / deliveries.count()
                self.save()

class Package(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Pickup'),
        ('picked_up', 'Picked Up'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('failed', 'Failed Delivery'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Original fields from CSV data
    order_id = models.CharField(max_length=64, unique=True)
    from_dipan_id = models.CharField(max_length=64)
    from_city_name = models.CharField(max_length=64)
    to_city_name = models.CharField(max_length=64, blank=True, null=True)
    delivery_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='deliveries')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_packages', null=True, blank=True)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_packages', null=True, blank=True)
    
    # Location fields
    poi_lng = models.FloatField()  # Pickup longitude
    poi_lat = models.FloatField()  # Pickup latitude
    receipt_lng = models.FloatField(null=True, blank=True)  # Actual pickup longitude
    receipt_lat = models.FloatField(null=True, blank=True)  # Actual pickup latitude
    sign_lng = models.FloatField(null=True, blank=True)  # Delivery longitude
    sign_lat = models.FloatField(null=True, blank=True)  # Delivery latitude
    
    # Time fields
    receipt_time = models.DateTimeField(null=True, blank=True)  # Actual pickup time
    sign_time = models.DateTimeField(null=True, blank=True)  # Actual delivery time
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional fields
    aoi_id = models.CharField(max_length=64, blank=True)
    typecode = models.CharField(max_length=64, blank=True)
    ds = models.CharField(max_length=32, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    
    # ML prediction fields
    predicted_delivery_time = models.FloatField(null=True, blank=True, help_text="Predicted delivery time in minutes")
    is_anomaly = models.BooleanField(default=False)
    anomaly_score = models.FloatField(null=True, blank=True)
    
    # Additional package details
    package_weight = models.FloatField(null=True, blank=True)
    package_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    special_instructions = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Package {self.order_id} - {self.status}"
    
    @property
    def actual_delivery_time(self):
        """Calculate actual delivery time in minutes"""
        if self.receipt_time and self.sign_time:
            return (self.sign_time - self.receipt_time).total_seconds() / 60
        return None
    
    @property
    def distance_km(self):
        """Calculate approximate distance using haversine formula"""
        if all([self.poi_lat, self.poi_lng, self.sign_lat, self.sign_lng]):
            from math import radians, cos, sin, asin, sqrt
            
            lat1, lon1 = radians(self.poi_lat), radians(self.poi_lng)
            lat2, lon2 = radians(self.sign_lat), radians(self.sign_lng)
            
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
            c = 2 * asin(sqrt(a))
            r = 6371  # Earth's radius in km
            return c * r
        return None
    
    def predict_delivery_time(self):
        """Predict delivery time using ML model"""
        try:
            # Load the trained model
            model_path = os.path.join(os.path.dirname(__file__), '../../ml/src/delivery_time_model.pkl')
            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    model = pickle.load(f)
                
                # Prepare features for prediction
                features = np.array([[
                    hash(self.from_city_name) % 1000,  # Simplified city encoding
                    self.delivery_user.id if self.delivery_user else 0,
                    self.poi_lng,
                    self.poi_lat,
                    self.poi_lng,  # Use poi as receipt initially
                    self.poi_lat,
                    self.sign_lng or self.poi_lng,
                    self.sign_lat or self.poi_lat
                ]])
                
                prediction = model.predict(features)[0]
                self.predicted_delivery_time = max(10, prediction)  # Minimum 10 minutes
                self.save()
                return self.predicted_delivery_time
        except Exception as e:
            print(f"Error predicting delivery time: {e}")
            # Fallback to simple distance-based estimation
            distance = self.distance_km
            if distance:
                # Assume 30 km/h average speed + 10 minutes handling
                self.predicted_delivery_time = (distance / 30) * 60 + 10
            else:
                self.predicted_delivery_time = 60  # Default 1 hour
            self.save()
            return self.predicted_delivery_time
    
    def detect_anomaly(self):
        """Detect if this delivery is anomalous using ML model"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), '../../ml/src/anomaly_detection_model.pkl')
            if os.path.exists(model_path) and self.actual_delivery_time:
                with open(model_path, 'rb') as f:
                    model = pickle.load(f)
                
                features = np.array([[
                    hash(self.from_city_name) % 1000,
                    self.delivery_user.id if self.delivery_user else 0,
                    self.actual_delivery_time,
                    self.distance_km or 0
                ]])
                
                anomaly_score = model.decision_function(features)[0]
                self.anomaly_score = float(anomaly_score)
                self.is_anomaly = anomaly_score < -0.5  # Threshold for anomaly
                self.save()
                
                if self.is_anomaly:
                    Anomaly.objects.create(
                        package=self,
                        description=f"Anomalous delivery time: {self.actual_delivery_time:.1f} minutes (score: {anomaly_score:.2f})"
                    )
        except Exception as e:
            print(f"Error detecting anomaly: {e}")

class CourierLog(models.Model):
    EVENT_CHOICES = [
        ('pickup_assigned', 'Pickup Assigned'),
        ('pickup_started', 'Pickup Started'),
        ('package_picked_up', 'Package Picked Up'),
        ('delivery_started', 'Delivery Started'),
        ('package_delivered', 'Package Delivered'),
        ('delivery_failed', 'Delivery Failed'),
        ('location_update', 'Location Update'),
    ]
    
    courier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courier_logs')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='logs')
    log_time = models.DateTimeField(auto_now_add=True)
    event = models.CharField(max_length=50, choices=EVENT_CHOICES)
    location_lat = models.FloatField(null=True, blank=True)
    location_lng = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-log_time']
    
    def __str__(self):
        return f"{self.courier.username} - {self.event} - {self.package.order_id}"

class OTPLog(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='otp_logs')
    otp_code = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    attempts = models.IntegerField(default=0)
    
    def __str__(self):
        return f"OTP {self.otp_code} for {self.package.order_id}"

class Anomaly(models.Model):
    ANOMALY_TYPES = [
        ('delivery_time', 'Unusual Delivery Time'),
        ('route_deviation', 'Route Deviation'),
        ('location_anomaly', 'Location Anomaly'),
        ('performance_drop', 'Performance Drop'),
        ('fraud_detection', 'Potential Fraud'),
    ]
    
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='anomalies')
    courier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='anomalies', null=True, blank=True)
    detected_at = models.DateTimeField(auto_now_add=True)
    anomaly_type = models.CharField(max_length=20, choices=ANOMALY_TYPES, default='delivery_time')
    description = models.TextField()
    severity = models.CharField(max_length=10, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical')
    ], default='medium')
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_anomalies')
    
    class Meta:
        ordering = ['-detected_at']
    
    def __str__(self):
        return f"Anomaly: {self.anomaly_type} - {self.package.order_id}"

class DashboardFeedback(models.Model):
    FEEDBACK_TYPES = [
        ('bug_report', 'Bug Report'),
        ('feature_request', 'Feature Request'),
        ('general_feedback', 'General Feedback'),
        ('performance_issue', 'Performance Issue'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback')
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES, default='general_feedback')
    feedback = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback from {self.user.username} - {self.feedback_type}"

class DeliveryRoute(models.Model):
    """Track detailed route information for deliveries"""
    package = models.OneToOneField(Package, on_delete=models.CASCADE, related_name='route')
    route_points = models.JSONField(default=list, help_text="List of GPS coordinates for the route")
    estimated_distance_km = models.FloatField(null=True, blank=True)
    actual_distance_km = models.FloatField(null=True, blank=True)
    estimated_duration_minutes = models.FloatField(null=True, blank=True)
    traffic_conditions = models.CharField(max_length=20, choices=[
        ('light', 'Light'),
        ('moderate', 'Moderate'),
        ('heavy', 'Heavy'),
        ('severe', 'Severe')
    ], default='moderate')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Route for {self.package.order_id}"

class PerformanceMetrics(models.Model):
    """Store daily performance metrics for analytics"""
    date = models.DateField(unique=True)
    total_packages = models.IntegerField(default=0)
    delivered_packages = models.IntegerField(default=0)
    failed_packages = models.IntegerField(default=0)
    average_delivery_time = models.FloatField(null=True, blank=True)
    average_distance = models.FloatField(null=True, blank=True)
    total_couriers = models.IntegerField(default=0)
    active_couriers = models.IntegerField(default=0)
    customer_satisfaction = models.FloatField(null=True, blank=True)
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Metrics for {self.date}"
    
    @classmethod
    def calculate_daily_metrics(cls, date=None):
        """Calculate and store metrics for a given date"""
        if date is None:
            date = timezone.now().date()
        
        packages = Package.objects.filter(created_at__date=date)
        delivered = packages.filter(status='delivered')
        failed = packages.filter(status='failed')
        
        metrics, created = cls.objects.get_or_create(
            date=date,
            defaults={
                'total_packages': packages.count(),
                'delivered_packages': delivered.count(),
                'failed_packages': failed.count(),
                'average_delivery_time': delivered.aggregate(
                    avg_time=models.Avg('predicted_delivery_time')
                )['avg_time'],
                'total_couriers': User.objects.filter(role='courier').count(),
                'active_couriers': User.objects.filter(
                    role='courier',
                    last_active__date=date
                ).count(),
            }
        )
        
        if not created:
            # Update existing metrics
            metrics.total_packages = packages.count()
            metrics.delivered_packages = delivered.count()
            metrics.failed_packages = failed.count()
            metrics.average_delivery_time = delivered.aggregate(
                avg_time=models.Avg('predicted_delivery_time')
            )['avg_time']
            metrics.save()
        
        return metrics


class DeliveryRoute(models.Model):
    """Model for tracking delivery routes and waypoints"""
    
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='routes')
    courier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routes')
    
    # Route information
    start_lat = models.FloatField()
    start_lng = models.FloatField()
    end_lat = models.FloatField() 
    end_lng = models.FloatField()
    
    # Route metadata
    estimated_distance_km = models.FloatField()
    estimated_duration_minutes = models.IntegerField()
    actual_distance_km = models.FloatField(null=True, blank=True)
    actual_duration_minutes = models.IntegerField(null=True, blank=True)
    
    # Status and timestamps
    status = models.CharField(max_length=20, choices=[
        ('planned', 'Planned'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='planned')
    
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Route optimization data
    waypoints = models.JSONField(default=list, blank=True)  # List of [lat, lng] coordinates
    traffic_conditions = models.CharField(max_length=20, choices=[
        ('light', 'Light Traffic'),
        ('moderate', 'Moderate Traffic'),
        ('heavy', 'Heavy Traffic'),
        ('unknown', 'Unknown'),
    ], default='unknown')
    
    weather_conditions = models.CharField(max_length=20, choices=[
        ('clear', 'Clear'),
        ('rain', 'Rain'),
        ('heavy_rain', 'Heavy Rain'),
        ('unknown', 'Unknown'),
    ], default='unknown')
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Delivery Route'
        verbose_name_plural = 'Delivery Routes'
    
    def __str__(self):
        return f"Route for {self.package.order_id} - {self.status}"
    
    @property
    def is_active(self):
        return self.status == 'active'
    
    @property
    def completion_rate(self):
        """Calculate route completion percentage"""
        if self.status == 'completed':
            return 100.0
        elif self.status == 'active' and self.started_at:
            # Simple calculation based on time elapsed
            if self.estimated_duration_minutes > 0:
                elapsed = (timezone.now() - self.started_at).total_seconds() / 60
                return min(100.0, (elapsed / self.estimated_duration_minutes) * 100)
        return 0.0
    
    def start_route(self):
        """Mark route as started"""
        self.status = 'active'
        self.started_at = timezone.now()
        self.save()
    
    def complete_route(self, actual_distance=None, actual_duration=None):
        """Mark route as completed"""
        self.status = 'completed'
        self.completed_at = timezone.now()
        
        if actual_distance:
            self.actual_distance_km = actual_distance
        
        if actual_duration:
            self.actual_duration_minutes = actual_duration
        elif self.started_at:
            # Calculate actual duration
            duration = (timezone.now() - self.started_at).total_seconds() / 60
            self.actual_duration_minutes = int(duration)
        
        self.save()
    
    def add_waypoint(self, lat, lng):
        """Add a waypoint to the route"""
        self.waypoints.append([lat, lng])
        self.save()
    
    def get_route_efficiency(self):
        """Calculate route efficiency compared to estimates"""
        if self.actual_distance_km and self.actual_duration_minutes:
            distance_efficiency = (self.estimated_distance_km / self.actual_distance_km) * 100
            time_efficiency = (self.estimated_duration_minutes / self.actual_duration_minutes) * 100
            
            return {
                'distance_efficiency': min(100.0, distance_efficiency),
                'time_efficiency': min(100.0, time_efficiency),
                'overall_efficiency': (distance_efficiency + time_efficiency) / 2
            }
        return None
