from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    ROLE_CHOICES = [
        ('sender', 'Sender'),
        ('receiver', 'Receiver'),
        ('courier', 'Courier'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
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

class Package(models.Model):
    order_id = models.CharField(max_length=64, unique=True)
    from_dipan_id = models.CharField(max_length=64)
    from_city_name = models.CharField(max_length=64)
    delivery_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='deliveries')
    poi_lng = models.FloatField()
    poi_lat = models.FloatField()
    aoi_id = models.CharField(max_length=64)
    typecode = models.CharField(max_length=64)
    receipt_time = models.DateTimeField()
    receipt_lng = models.FloatField()
    receipt_lat = models.FloatField()
    sign_time = models.DateTimeField()
    sign_lng = models.FloatField()
    sign_lat = models.FloatField()
    ds = models.CharField(max_length=32)
    status = models.CharField(max_length=32, default='in_transit')

class CourierLog(models.Model):
    courier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courier_logs')
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    log_time = models.DateTimeField(auto_now_add=True)
    event = models.CharField(max_length=128)

class OTPLog(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=16)
    created_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)

class Anomaly(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    detected_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField()

class DashboardFeedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
