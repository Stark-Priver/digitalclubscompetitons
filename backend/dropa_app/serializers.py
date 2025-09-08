from rest_framework import serializers
from .models import User, Package, CourierLog, OTPLog, Anomaly, DashboardFeedback

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = '__all__'

class CourierLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourierLog
        fields = '__all__'

class OTPLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTPLog
        fields = '__all__'

class AnomalySerializer(serializers.ModelSerializer):
    class Meta:
        model = Anomaly
        fields = '__all__'

class DashboardFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardFeedback
        fields = '__all__'
