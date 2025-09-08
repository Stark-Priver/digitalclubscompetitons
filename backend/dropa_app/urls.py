from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.PredictDeliveryTimeView.as_view()),
    path('anomaly/', views.AnomalyDetectionView.as_view()),
    path('forecast/', views.ForecastView.as_view()),
    path('otp/send/', views.SendOTPView.as_view()),
    path('otp/verify/', views.VerifyOTPView.as_view()),
    path('chatbot/', views.DropaBotView.as_view()),
    path('packages/', views.PackageListView.as_view()),
    path('couriers/', views.CourierStatsView.as_view()),
    path('dashboard/', views.DashboardView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('register/', views.RegisterView.as_view()),
]
