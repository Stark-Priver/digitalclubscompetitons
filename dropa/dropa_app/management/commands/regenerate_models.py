"""
Django management command to regenerate ML models with proper serialization
"""

from django.core.management.base import BaseCommand
import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.metrics import mean_absolute_error
import lightgbm as lgb
import joblib
import pickle
from prophet import Prophet
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Regenerate ML models with proper serialization'

    def handle(self, *args, **options):
        self.stdout.write("Regenerating ML models...")
        
        try:
            # Train and save delivery time model
            delivery_model = self.train_delivery_time_model()
            self.save_model(delivery_model, 'delivery_time_model.pkl')
            self.stdout.write(self.style.SUCCESS("✓ Delivery time model saved"))
            
            # Train and save anomaly detection model  
            anomaly_model = self.train_anomaly_detection_model()
            self.save_model(anomaly_model, 'anomaly_detection_model.pkl')
            self.stdout.write(self.style.SUCCESS("✓ Anomaly detection model saved"))
            
            # Train and save forecasting model
            forecasting_model = self.train_forecasting_model()
            self.save_model(forecasting_model, 'prophet_forecasting_model.pkl')
            self.stdout.write(self.style.SUCCESS("✓ Forecasting model saved"))
            
            self.stdout.write(self.style.SUCCESS("\nAll models regenerated successfully!"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error regenerating models: {str(e)}"))

    def create_sample_data(self):
        """Create sample data for model training"""
        np.random.seed(42)
        
        cities = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya']
        city_coords = {
            'Dar es Salaam': (-6.7924, 39.2083),
            'Arusha': (-3.3869, 36.6830), 
            'Mwanza': (-2.5164, 32.9175),
            'Dodoma': (-6.1630, 35.7516),
            'Mbeya': (-8.9094, 33.4607)
        }
        
        n_samples = 1000
        data = []
        
        for i in range(n_samples):
            from_city = np.random.choice(cities)
            to_city = np.random.choice([c for c in cities if c != from_city])
            
            from_coords = city_coords[from_city]
            to_coords = city_coords[to_city]
            
            # Calculate approximate distance
            lat_diff = abs(from_coords[0] - to_coords[0])
            lng_diff = abs(from_coords[1] - to_coords[1])
            distance_approx = np.sqrt(lat_diff**2 + lng_diff**2) * 111  # rough km conversion
            
            # Simulate delivery time based on distance with noise
            base_time = distance_approx * 2 + np.random.normal(0, 30)  # 2 minutes per km base
            delivery_minutes = max(30, base_time)  # minimum 30 minutes
            
            data.append({
                'from_city_name': from_city,
                'delivery_user_id': np.random.randint(1, 6),  # 5 couriers
                'poi_lng': to_coords[1],
                'poi_lat': to_coords[0],
                'receipt_lng': from_coords[1], 
                'receipt_lat': from_coords[0],
                'sign_lng': to_coords[1],
                'sign_lat': to_coords[0],
                'delivery_minutes': delivery_minutes,
                'delivery_cost': delivery_minutes * 50 + np.random.normal(0, 500),  # cost correlation
                'package_weight': np.random.uniform(0.5, 10.0)
            })
        
        return pd.DataFrame(data)

    def train_delivery_time_model(self):
        """Train delivery time prediction model"""
        self.stdout.write("Training delivery time model...")
        
        df = self.create_sample_data()
        
        # Prepare features
        features = ['from_city_name', 'delivery_user_id', 'poi_lng', 'poi_lat', 'receipt_lng', 'receipt_lat', 'sign_lng', 'sign_lat']
        
        # Encode categorical features
        le = LabelEncoder()
        df['from_city_name'] = le.fit_transform(df['from_city_name'])
        
        X = df[features]
        y = df['delivery_minutes']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        model = lgb.LGBMRegressor(
            num_leaves=31,
            learning_rate=0.1,
            n_estimators=100,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        self.stdout.write(f"Delivery time model MAE: {mae:.2f} minutes")
        
        return model

    def train_anomaly_detection_model(self):
        """Train anomaly detection model"""
        self.stdout.write("Training anomaly detection model...")
        
        df = self.create_sample_data()
        
        # Features for anomaly detection
        features = ['delivery_minutes', 'delivery_cost', 'package_weight']
        X = df[features]
        
        # Train isolation forest
        model = IsolationForest(
            contamination=0.1,
            random_state=42
        )
        model.fit(X)
        
        self.stdout.write("Anomaly detection model trained")
        return model

    def train_forecasting_model(self):
        """Train Prophet forecasting model"""
        self.stdout.write("Training forecasting model...")
        
        # Create time series data
        dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
        
        # Simulate delivery volume with trend and seasonality
        base_volume = 50
        trend = np.linspace(0, 20, len(dates))  # Growing trend
        seasonal = 10 * np.sin(2 * np.pi * np.arange(len(dates)) / 365.25)  # Yearly pattern
        weekly = 5 * np.sin(2 * np.pi * np.arange(len(dates)) / 7)  # Weekly pattern
        noise = np.random.normal(0, 5, len(dates))
        
        volume = base_volume + trend + seasonal + weekly + noise
        volume = np.maximum(volume, 0)  # No negative volumes
        
        # Prepare data for Prophet
        df_prophet = pd.DataFrame({
            'ds': dates,
            'y': volume
        })
        
        # Train Prophet model
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True
        )
        model.fit(df_prophet)
        
        self.stdout.write("Forecasting model trained")
        return model

    def save_model(self, model, filename):
        """Save model to the ml/src directory"""
        # Get the ml/src directory relative to Django project
        output_dir = os.path.join(
            os.path.dirname(__file__), 
            '../../../ml/src/'
        )
        os.makedirs(output_dir, exist_ok=True)
        
        filepath = os.path.join(output_dir, filename)
        joblib.dump(model, filepath)
        self.stdout.write(f"Model saved to: {filepath}")
