"""
Management command to test ML model integration
"""

from django.core.management.base import BaseCommand
from dropa_app.ml_service import ml_service

class Command(BaseCommand):
    help = 'Test ML model integration'

    def handle(self, *args, **options):
        self.stdout.write("Testing ML Service Integration...")
        
        # Test delivery time prediction
        self.stdout.write("\n1. Testing Delivery Time Prediction:")
        prediction_data = {
            'distance_km': 150.0,
            'package_weight': 2.5,
            'from_city': 'Dar es Salaam',
            'to_city': 'Arusha',
            'vehicle_type': 'car'
        }
        
        prediction = ml_service.predict_delivery_time(**prediction_data)
        self.stdout.write(f"   Prediction: {prediction}")
        
        # Test anomaly detection
        self.stdout.write("\n2. Testing Anomaly Detection:")
        anomaly_data = {
            'distance_km': 150.0,
            'package_weight': 2.5,
            'delivery_time_hours': 3.0,
            'delivery_cost': 8000.0
        }
        
        anomaly_result = ml_service.detect_anomalies(anomaly_data)
        self.stdout.write(f"   Anomaly Result: {anomaly_result}")
        
        # Test forecasting
        self.stdout.write("\n3. Testing Demand Forecasting:")
        forecast = ml_service.forecast_demand(days_ahead=7)
        self.stdout.write(f"   Forecast: {forecast}")
        
        # Test comprehensive insights
        self.stdout.write("\n4. Testing Comprehensive Insights:")
        insights_data = {
            'distance_km': 100.0,
            'package_weight': 1.5,
            'from_city': 'Dar es Salaam',
            'to_city': 'Dodoma',
            'vehicle_type': 'motorcycle'
        }
        
        insights = ml_service.get_delivery_insights(insights_data)
        self.stdout.write(f"   Insights: {insights}")
        
        self.stdout.write(
            self.style.SUCCESS('\nML Service integration test completed!')
        )
