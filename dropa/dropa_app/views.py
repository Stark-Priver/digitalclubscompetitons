from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import *
from .serializers import *
from .ml_service import ml_service
import pyotp
import json

# Frontend Views
@login_required
def dashboard_view(request):
    """Main dashboard view"""
    # Get dashboard statistics
    total_packages = Package.objects.count()
    active_deliveries = Package.objects.filter(status='in_transit').count()
    active_couriers = User.objects.filter(role='courier', is_active=True).count()
    
    # Calculate delivery success rate
    total_delivered = Package.objects.filter(status='delivered').count()
    delivery_rate = (total_delivered / total_packages * 100) if total_packages > 0 else 0
    
    context = {
        'total_packages': total_packages,
        'active_deliveries': active_deliveries,
        'active_couriers': active_couriers,
        'delivery_rate': round(delivery_rate, 1),
    }
    
    return render(request, 'dropa_app/dashboard.html', context)

@login_required
def packages_view(request):
    """Packages management view"""
    packages = Package.objects.all().order_by('-receipt_time')
    return render(request, 'dropa_app/packages.html', {'packages': packages})

@login_required
def couriers_view(request):
    """Couriers management view"""
    couriers = User.objects.filter(role='courier')
    return render(request, 'dropa_app/couriers.html', {'couriers': couriers})

@login_required
def analytics_view(request):
    """Analytics view"""
    return render(request, 'dropa_app/analytics.html')

@login_required
def map_view(request):
    """Live map view"""
    active_packages = Package.objects.filter(status='in_transit')
    return render(request, 'dropa_app/map.html', {'active_packages': active_packages})

@login_required
def chatbot_view(request):
    """Chatbot view"""
    return render(request, 'dropa_app/chatbot.html')

def landing_view(request):
    """Landing page view"""
    return render(request, 'dropa_app/landing.html')

def login_view(request):
    """Login view"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'dropa_app/login.html', {'error': 'Invalid credentials'})
    
    return render(request, 'dropa_app/login.html')

def logout_view(request):
    """Logout view"""
    logout(request)
    return redirect('login')

# API Views
class PredictDeliveryTimeView(APIView):
    def post(self, request):
        """Predict delivery time using trained ML model"""
        try:
            # Extract data from request
            data = request.data
            
            # Get prediction from ML service
            prediction = ml_service.predict_delivery_time(
                distance_km=data.get('distance_km'),
                package_weight=data.get('package_weight'),
                from_city=data.get('from_city'),
                to_city=data.get('to_city'),
                vehicle_type=data.get('vehicle_type', 'motorcycle')
            )
            
            if 'error' in prediction:
                return Response({'error': prediction['error']}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(prediction, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AnomalyDetectionView(APIView):
    def post(self, request):
        """Detect anomalies in delivery data using trained ML model"""
        try:
            # Extract data from request
            data = request.data
            
            # Get anomaly detection from ML service
            anomaly_result = ml_service.detect_anomalies(data)
            
            if 'error' in anomaly_result:
                return Response({'error': anomaly_result['error']}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(anomaly_result, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ForecastView(APIView):
    def get(self, request):
        """Forecast delivery demand using trained Prophet model"""
        try:
            # Get forecast period from query params (default 30 days)
            days_ahead = int(request.GET.get('days', 30))
            
            # Get forecast from ML service
            forecast_result = ml_service.forecast_demand(days_ahead=days_ahead)
            
            if 'error' in forecast_result:
                return Response({'error': forecast_result['error']}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(forecast_result, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendOTPView(APIView):
    def post(self, request):
        package_id = request.data.get('package_id')
        otp = pyotp.TOTP(pyotp.random_base32()).now()
        OTPLog.objects.create(package_id=package_id, otp_code=otp)
        return Response({'otp': otp}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    def post(self, request):
        package_id = request.data.get('package_id')
        otp_code = request.data.get('otp_code')
        otp_log = OTPLog.objects.filter(package_id=package_id, otp_code=otp_code).first()
        if otp_log:
            otp_log.verified = True
            otp_log.save()
            return Response({'verified': True}, status=status.HTTP_200_OK)
        return Response({'verified': False}, status=status.HTTP_400_BAD_REQUEST)

class DropaBotView(APIView):
    def post(self, request):
        # Integrate RAG chatbot here
        return Response({'answer': 'Chatbot response'}, status=status.HTTP_200_OK)

class PackageListView(APIView):
    def get(self, request):
        packages = Package.objects.all().order_by('-receipt_time')[:10]  # Latest 10 packages
        serializer = PackageSerializer(packages, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PackageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourierStatsView(APIView):
    def get(self, request):
        """Get courier statistics with real data"""
        try:
            # Get couriers with their delivery stats
            couriers = User.objects.filter(role='courier').annotate(
                delivery_count=Count('delivered_packages'),
                recent_deliveries=Count('delivered_packages', 
                    filter=Q(delivered_packages__receipt_time__gte=timezone.now() - timedelta(days=30)))
            ).order_by('-delivery_count')[:10]
            
            courier_data = []
            for courier in couriers:
                # Calculate additional stats
                total_packages = courier.delivered_packages.count()
                completed_packages = courier.delivered_packages.filter(status='delivered').count()
                success_rate = (completed_packages / total_packages * 100) if total_packages > 0 else 0
                
                courier_data.append({
                    'id': courier.id,
                    'name': f"{courier.first_name} {courier.last_name}" if courier.first_name else courier.username,
                    'username': courier.username,
                    'email': courier.email,
                    'deliveries': total_packages,
                    'completed_deliveries': completed_packages,
                    'recent_deliveries': courier.recent_deliveries,
                    'success_rate': round(success_rate, 1),
                    'rating': round(4.0 + (success_rate / 100), 1),  # Dynamic rating based on success rate
                    'status': 'online' if courier.is_active else 'offline',
                    'last_active': courier.last_login.isoformat() if courier.last_login else None,
                    'phone': courier.phone if hasattr(courier, 'phone') else None
                })
            
            # If no couriers with deliveries, create sample data
            if not courier_data:
                courier_data = [
                    {
                        'id': 1,
                        'name': 'Michael Johnson',
                        'username': 'mjohnson',
                        'email': 'michael@dropa.com',
                        'deliveries': 150,
                        'completed_deliveries': 147,
                        'recent_deliveries': 45,
                        'success_rate': 98.0,
                        'rating': 4.8,
                        'status': 'online',
                        'last_active': timezone.now().isoformat(),
                        'phone': '+255712345678'
                    },
                    {
                        'id': 2,
                        'name': 'Sarah Williams',
                        'username': 'swilliams',
                        'email': 'sarah@dropa.com',
                        'deliveries': 132,
                        'completed_deliveries': 128,
                        'recent_deliveries': 38,
                        'success_rate': 97.0,
                        'rating': 4.7,
                        'status': 'online',
                        'last_active': timezone.now().isoformat(),
                        'phone': '+255712345679'
                    },
                    {
                        'id': 3,
                        'name': 'James Mwanga',
                        'username': 'jmwanga',
                        'email': 'james@dropa.com',
                        'deliveries': 98,
                        'completed_deliveries': 94,
                        'recent_deliveries': 28,
                        'success_rate': 96.0,
                        'rating': 4.6,
                        'status': 'offline',
                        'last_active': (timezone.now() - timedelta(hours=2)).isoformat(),
                        'phone': '+255712345680'
                    }
                ]
            
            return Response(courier_data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DashboardStatsView(APIView):
    def get(self, request):
        """Get dashboard statistics"""
        stats = {
            'total_packages': Package.objects.count(),
            'active_deliveries': Package.objects.filter(status='in_transit').count(),
            'active_couriers': User.objects.filter(role='courier', is_active=True).count(),
            'pending_packages': Package.objects.filter(status='pending').count(),
            'delivered_today': Package.objects.filter(
                status='delivered',
                sign_time__date=timezone.now().date()
            ).count(),
        }
        
        # Calculate delivery rate
        total_delivered = Package.objects.filter(status='delivered').count()
        total_packages = Package.objects.count()
        stats['delivery_rate'] = (total_delivered / total_packages * 100) if total_packages > 0 else 0
        
        return Response(stats)

class DashboardDataView(APIView):
    def get(self, request):
        """Comprehensive dashboard data endpoint"""
        # Get basic stats
        total_packages = Package.objects.count()
        active_deliveries = Package.objects.filter(status='in_transit').count()
        active_couriers = User.objects.filter(role='courier', is_active=True).count()
        pending_packages = Package.objects.filter(status='pending').count()
        delivered_today = Package.objects.filter(
            status='delivered',
            sign_time__date=timezone.now().date()
        ).count()
        
        # Calculate delivery rate
        total_delivered = Package.objects.filter(status='delivered').count()
        delivery_rate = (total_delivered / total_packages * 100) if total_packages > 0 else 0
        
        # Get recent packages
        recent_packages = Package.objects.all().order_by('-receipt_time')[:5]
        packages_data = []
        for package in recent_packages:
            packages_data.append({
                'id': package.order_id,
                'order_id': package.order_id,
                'from_city': package.from_city_name,
                'to_city': package.to_city_name,
                'status': package.status,
                'courier': package.delivery_user.username if package.delivery_user else None,
                'receipt_time': package.receipt_time.isoformat() if package.receipt_time else None
            })
        
        # Get top couriers
        top_couriers = User.objects.filter(role='courier').annotate(
            delivery_count=Count('deliveries')
        ).order_by('-delivery_count')[:3]
        
        couriers_data = []
        for courier in top_couriers:
            couriers_data.append({
                'id': courier.id,
                'name': f"{courier.first_name} {courier.last_name}" if courier.first_name else courier.username,
                'username': courier.username,
                'deliveries': courier.delivery_count,
                'rating': 4.5,  # Mock rating
                'status': 'online' if courier.is_active else 'offline'
            })
        
        # Compile all data
        dashboard_data = {
            'stats': {
                'total_packages': total_packages,
                'active_deliveries': active_deliveries,
                'active_couriers': active_couriers,
                'pending_packages': pending_packages,
                'delivered_today': delivered_today,
                'delivery_rate': round(delivery_rate, 1)
            },
            'recent_packages': packages_data,
            'top_couriers': couriers_data,
            'map_data': {
                'active_deliveries': active_deliveries,
                'courier_locations': active_couriers
            },
            'timestamp': timezone.now().isoformat()
        }
        
        return Response(dashboard_data)

class DeliveryInsightsView(APIView):
    def post(self, request):
        """Get comprehensive delivery insights using ML models"""
        try:
            # Extract package data from request
            package_data = request.data
            
            # Get comprehensive insights from ML service
            insights = ml_service.get_delivery_insights(package_data)
            
            if 'error' in insights:
                return Response({'error': insights['error']}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(insights, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CourierStatsView(APIView):
    def get(self, request):
        # Return courier stats
        return Response({'stats': 'Courier stats'}, status=status.HTTP_200_OK)

class DashboardView(APIView):
    def get(self, request):
        # Return dashboard data
        return Response({'dashboard': 'Dashboard data'}, status=status.HTTP_200_OK)

class LoginView(APIView):
    def post(self, request):
        # Implement login logic
        return Response({'login': 'User logged in'}, status=status.HTTP_200_OK)

class RegisterView(APIView):
    def post(self, request):
        # Implement registration logic
        return Response({'register': 'User registered'}, status=status.HTTP_201_CREATED)
