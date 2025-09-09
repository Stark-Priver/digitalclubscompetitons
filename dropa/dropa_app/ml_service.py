"""
ML Models Integration Service
Integrates trained ML models for delivery predictions, anomaly detection, and forecasting
"""

import os
import pickle
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from django.conf import settings
import joblib
from prophet import Prophet
import logging

logger = logging.getLogger(__name__)

class MLService:
    """Service class to handle ML model operations"""
    
    def __init__(self):
        self.ml_models_path = os.path.join(settings.BASE_DIR, '../ml/src/')
        self.data_path = os.path.join(settings.BASE_DIR, '../data/')
        self.models = {}
        self.load_models()
    
    def load_models(self):
        """Load all trained ML models"""
        try:
            # Load delivery time prediction model
            delivery_model_path = os.path.join(self.ml_models_path, 'delivery_time_model.pkl')
            if os.path.exists(delivery_model_path):
                try:
                    with open(delivery_model_path, 'rb') as f:
                        self.models['delivery_time'] = pickle.load(f)
                    logger.info("Delivery time model loaded successfully")
                except Exception as e:
                    logger.error(f"Error loading delivery time model: {str(e)}")
                    # Try with joblib
                    try:
                        self.models['delivery_time'] = joblib.load(delivery_model_path)
                        logger.info("Delivery time model loaded successfully with joblib")
                    except Exception as e2:
                        logger.error(f"Error loading delivery time model with joblib: {str(e2)}")
            
            # Load anomaly detection model
            anomaly_model_path = os.path.join(self.ml_models_path, 'anomaly_detection_model.pkl')
            if os.path.exists(anomaly_model_path):
                try:
                    self.models['anomaly_detection'] = joblib.load(anomaly_model_path)
                    logger.info("Anomaly detection model loaded successfully with joblib")
                except Exception as e:
                    logger.error(f"Error loading anomaly detection model with joblib: {str(e)}")
                    try:
                        with open(anomaly_model_path, 'rb') as f:
                            self.models['anomaly_detection'] = pickle.load(f)
                        logger.info("Anomaly detection model loaded successfully with pickle")
                    except Exception as e2:
                        logger.error(f"Error loading anomaly detection model with pickle: {str(e2)}")
            
            # Load Prophet forecasting model
            forecasting_model_path = os.path.join(self.ml_models_path, 'prophet_forecasting_model.pkl')
            if os.path.exists(forecasting_model_path):
                try:
                    self.models['forecasting'] = joblib.load(forecasting_model_path)
                    logger.info("Forecasting model loaded successfully with joblib")
                except Exception as e:
                    logger.error(f"Error loading forecasting model with joblib: {str(e)}")
                    try:
                        self.models['forecasting'] = joblib.load(forecasting_model_path)
                        logger.info("Forecasting model loaded successfully with joblib")
                    except Exception as e2:
                        logger.error(f"Error loading forecasting model with joblib: {str(e2)}")
                
        except Exception as e:
            logger.error(f"Error loading ML models: {str(e)}")
    
    def predict_delivery_time(self, distance_km=None, package_weight=None, from_city=None, to_city=None, vehicle_type=None):
        """
        Predict delivery time using the trained model
        
        Args:
            distance_km (float): Distance in kilometers
            package_weight (float): Package weight in kg
            from_city (str): Origin city
            to_city (str): Destination city
            vehicle_type (str): Type of vehicle
            
        Returns:
            dict: Prediction results
        """
        try:
            if 'delivery_time' not in self.models:
                return {'error': 'Delivery time model not loaded'}
            
            model = self.models['delivery_time']
            
            # Prepare input features based on the actual model training
            # The model expects: ['from_city_name', 'delivery_user_id', 'poi_lng', 'poi_lat', 'receipt_lng', 'receipt_lat', 'sign_lng', 'sign_lat']
            features = self._prepare_delivery_features_v2(
                from_city, to_city, distance_km
            )
            
            # Make prediction (result is in minutes)
            predicted_minutes = model.predict([features])[0]
            predicted_hours = predicted_minutes / 60
            
            # Calculate estimated delivery time
            estimated_delivery = datetime.now() + timedelta(hours=predicted_hours)
            
            return {
                'predicted_hours': round(predicted_hours, 2),
                'predicted_minutes': round(predicted_minutes, 2),
                'estimated_delivery': estimated_delivery.isoformat(),
                'confidence': 'high' if predicted_minutes > 0 else 'low'
            }
            
        except Exception as e:
            logger.error(f"Error predicting delivery time: {str(e)}")
            return {'error': str(e)}
    
    def detect_anomalies(self, delivery_data):
        """
        Detect anomalies in delivery data
        
        Args:
            delivery_data (dict): Delivery data to analyze
            
        Returns:
            dict: Anomaly detection results
        """
        try:
            if 'anomaly_detection' not in self.models:
                return {'error': 'Anomaly detection model not loaded'}
            
            model = self.models['anomaly_detection']
            
            # Prepare features for anomaly detection
            features = self._prepare_anomaly_features(delivery_data)
            
            # Detect anomalies (-1 for anomaly, 1 for normal)
            prediction = model.predict([features])[0]
            anomaly_score = model.decision_function([features])[0]
            
            is_anomaly = prediction == -1
            
            return {
                'is_anomaly': is_anomaly,
                'anomaly_score': float(anomaly_score),
                'severity': self._get_anomaly_severity(anomaly_score),
                'recommendations': self._get_anomaly_recommendations(is_anomaly, anomaly_score)
            }
            
        except Exception as e:
            logger.error(f"Error detecting anomalies: {str(e)}")
            return {'error': str(e)}
    
    def forecast_demand(self, days_ahead=30):
        """
        Forecast delivery demand using Prophet model
        
        Args:
            days_ahead (int): Number of days to forecast
            
        Returns:
            dict: Forecasting results
        """
        try:
            if 'forecasting' not in self.models:
                return {'error': 'Forecasting model not loaded'}
            
            model = self.models['forecasting']
            
            # Create future dates
            future_dates = pd.date_range(
                start=datetime.now().date(),
                periods=days_ahead,
                freq='D'
            )
            
            future_df = pd.DataFrame({'ds': future_dates})
            
            # Make forecast
            forecast = model.predict(future_df)
            
            # Format results
            forecast_data = []
            for i, row in forecast.iterrows():
                forecast_data.append({
                    'date': row['ds'].strftime('%Y-%m-%d'),
                    'predicted_demand': max(0, round(row['yhat'])),
                    'lower_bound': max(0, round(row['yhat_lower'])),
                    'upper_bound': max(0, round(row['yhat_upper'])),
                    'confidence_interval': f"{round(row['yhat_lower'])}-{round(row['yhat_upper'])}"
                })
            
            return {
                'forecast': forecast_data,
                'total_predicted_volume': sum([d['predicted_demand'] for d in forecast_data]),
                'average_daily_demand': round(sum([d['predicted_demand'] for d in forecast_data]) / days_ahead),
                'forecast_period': f"{days_ahead} days"
            }
            
        except Exception as e:
            logger.error(f"Error forecasting demand: {str(e)}")
            return {'error': str(e)}
    
    def get_delivery_insights(self, package_data):
        """
        Get comprehensive delivery insights combining all models
        
        Args:
            package_data (dict): Package and delivery data
            
        Returns:
            dict: Combined insights
        """
        try:
            insights = {}
            
            # Delivery time prediction
            if all(k in package_data for k in ['distance_km', 'package_weight']):
                delivery_prediction = self.predict_delivery_time(
                    distance_km=package_data['distance_km'],
                    package_weight=package_data.get('package_weight', 1.0),
                    from_city=package_data.get('from_city'),
                    to_city=package_data.get('to_city'),
                    vehicle_type=package_data.get('vehicle_type', 'motorcycle')
                )
                insights['delivery_prediction'] = delivery_prediction
            
            # Anomaly detection
            anomaly_result = self.detect_anomalies(package_data)
            insights['anomaly_detection'] = anomaly_result
            
            # Risk assessment
            insights['risk_assessment'] = self._assess_delivery_risk(package_data, anomaly_result)
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating delivery insights: {str(e)}")
            return {'error': str(e)}
    
    def _prepare_delivery_features(self, distance_km, package_weight, from_city, to_city, vehicle_type):
        """Prepare features for delivery time prediction (legacy method)"""
        # Default values based on training data
        features = [
            distance_km or 10.0,  # distance_km
            package_weight or 1.0,  # package_weight_kg
            1 if vehicle_type == 'motorcycle' else 0,  # vehicle_motorcycle
            1 if vehicle_type == 'car' else 0,  # vehicle_car
            1 if vehicle_type == 'truck' else 0,  # vehicle_truck
            1 if from_city == 'Dar es Salaam' else 0,  # from_dar_es_salaam
            1 if from_city == 'Arusha' else 0,  # from_arusha
            1 if from_city == 'Mwanza' else 0,  # from_mwanza
            1 if from_city == 'Dodoma' else 0,  # from_dodoma
            1 if from_city == 'Mbeya' else 0,  # from_mbeya
            1 if to_city == 'Dar es Salaam' else 0,  # to_dar_es_salaam
            1 if to_city == 'Arusha' else 0,  # to_arusha
            1 if to_city == 'Mwanza' else 0,  # to_mwanza
            1 if to_city == 'Dodoma' else 0,  # to_dodoma
            1 if to_city == 'Mbeya' else 0,  # to_mbeya
        ]
        return features
    
    def _prepare_delivery_features_v2(self, from_city, to_city, distance_km):
        """Prepare features matching the actual trained model"""
        # City name encoding (simplified - in production use the same LabelEncoder)
        city_encoding = {
            'Dar es Salaam': 0,
            'Arusha': 1, 
            'Mwanza': 2,
            'Dodoma': 3,
            'Mbeya': 4
        }
        
        # Default coordinates for major Tanzanian cities
        city_coords = {
            'Dar es Salaam': {'lat': -6.7924, 'lng': 39.2083},
            'Arusha': {'lat': -3.3869, 'lng': 36.6830},
            'Mwanza': {'lat': -2.5164, 'lng': 32.9175},
            'Dodoma': {'lat': -6.1630, 'lng': 35.7516},
            'Mbeya': {'lat': -8.9094, 'lng': 33.4607}
        }
        
        from_city_encoded = city_encoding.get(from_city, 0)
        delivery_user_id = 1  # Default courier ID
        
        # Get coordinates
        from_coords = city_coords.get(from_city, city_coords['Dar es Salaam'])
        to_coords = city_coords.get(to_city, city_coords['Arusha'])
        
        # Features: ['from_city_name', 'delivery_user_id', 'poi_lng', 'poi_lat', 'receipt_lng', 'receipt_lat', 'sign_lng', 'sign_lat']
        features = [
            from_city_encoded,           # from_city_name (encoded)
            delivery_user_id,            # delivery_user_id  
            to_coords['lng'],            # poi_lng (destination longitude)
            to_coords['lat'],            # poi_lat (destination latitude)
            from_coords['lng'],          # receipt_lng (pickup longitude)
            from_coords['lat'],          # receipt_lat (pickup latitude)  
            to_coords['lng'],            # sign_lng (delivery longitude)
            to_coords['lat']             # sign_lat (delivery latitude)
        ]
        
        return features
    
    def _prepare_anomaly_features(self, delivery_data):
        """Prepare features for anomaly detection"""
        # Model trained with: delivery_minutes, delivery_cost, package_weight
        features = [
            delivery_data.get('delivery_time_hours', 2.0) * 60,  # convert to minutes
            delivery_data.get('delivery_cost', 5000.0),
            delivery_data.get('package_weight', 1.0),
        ]
        return features
    
    def _get_anomaly_severity(self, anomaly_score):
        """Determine anomaly severity based on score"""
        if anomaly_score < -0.5:
            return 'high'
        elif anomaly_score < -0.2:
            return 'medium'
        else:
            return 'low'
    
    def _get_anomaly_recommendations(self, is_anomaly, anomaly_score):
        """Get recommendations based on anomaly detection"""
        if not is_anomaly:
            return ['Delivery appears normal', 'Continue with standard process']
        
        recommendations = []
        if anomaly_score < -0.5:
            recommendations.extend([
                'High risk delivery detected',
                'Consider additional verification',
                'Monitor delivery progress closely',
                'Alert supervisors'
            ])
        elif anomaly_score < -0.2:
            recommendations.extend([
                'Moderate anomaly detected',
                'Review delivery details',
                'Consider alternative route'
            ])
        else:
            recommendations.extend([
                'Minor anomaly detected',
                'Standard monitoring recommended'
            ])
        
        return recommendations
    
    def _assess_delivery_risk(self, package_data, anomaly_result):
        """Assess overall delivery risk"""
        risk_factors = []
        risk_score = 0
        
        # Distance-based risk
        distance = package_data.get('distance_km', 0)
        if distance > 500:
            risk_factors.append('Long distance delivery')
            risk_score += 0.3
        elif distance > 200:
            risk_factors.append('Medium distance delivery')
            risk_score += 0.1
        
        # Weight-based risk
        weight = package_data.get('package_weight', 0)
        if weight > 20:
            risk_factors.append('Heavy package')
            risk_score += 0.2
        
        # Anomaly-based risk
        if anomaly_result.get('is_anomaly'):
            risk_factors.append('Anomalous delivery pattern')
            risk_score += 0.4
        
        # Time-based risk (late hours)
        current_hour = datetime.now().hour
        if current_hour < 6 or current_hour > 20:
            risk_factors.append('Off-hours delivery')
            risk_score += 0.1
        
        # Determine risk level
        if risk_score > 0.7:
            risk_level = 'high'
        elif risk_score > 0.4:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'risk_level': risk_level,
            'risk_score': round(risk_score, 2),
            'risk_factors': risk_factors,
            'recommendations': self._get_risk_recommendations(risk_level)
        }
    
    def _get_risk_recommendations(self, risk_level):
        """Get recommendations based on risk level"""
        if risk_level == 'high':
            return [
                'Assign experienced courier',
                'Provide GPS tracking',
                'Implement frequent check-ins',
                'Consider insurance coverage'
            ]
        elif risk_level == 'medium':
            return [
                'Standard monitoring protocols',
                'Regular status updates',
                'Backup courier on standby'
            ]
        else:
            return [
                'Standard delivery process',
                'Normal monitoring'
            ]

# Global ML service instance
ml_service = MLService()
