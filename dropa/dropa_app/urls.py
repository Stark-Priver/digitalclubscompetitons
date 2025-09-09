from django.urls import path
from . import views

urlpatterns = [
    # Frontend Views
    path('', views.landing_view, name='landing'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('packages/', views.packages_view, name='packages'),
    path('couriers/', views.couriers_view, name='couriers'),
    path('analytics/', views.analytics_view, name='analytics'),
    path('map/', views.map_view, name='map_view'),
    path('chatbot/', views.chatbot_view, name='chatbot'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # API Endpoints
    path('api/dashboard-data/', views.DashboardDataView.as_view(), name='api_dashboard_data'),
    path('api/delivery-insights/', views.DeliveryInsightsView.as_view(), name='api_delivery_insights'),
    path('api/predict/', views.PredictDeliveryTimeView.as_view(), name='api_predict'),
    path('api/anomaly/', views.AnomalyDetectionView.as_view(), name='api_anomaly'),
    path('api/forecast/', views.ForecastView.as_view(), name='api_forecast'),
    path('api/otp/send/', views.SendOTPView.as_view(), name='api_otp_send'),
    path('api/otp/verify/', views.VerifyOTPView.as_view(), name='api_otp_verify'),
    path('api/chatbot/', views.DropaBotView.as_view(), name='api_chatbot'),
    path('api/packages/', views.PackageListView.as_view(), name='api_packages'),
    path('api/couriers/', views.CourierStatsView.as_view(), name='api_couriers'),
    path('api/stats/', views.DashboardStatsView.as_view(), name='api_stats'),
]
