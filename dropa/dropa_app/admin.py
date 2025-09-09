from django.contrib import admin
from .models import User, Package, CourierLog, OTPLog, Anomaly, DashboardFeedback

admin.site.register(User)
admin.site.register(Package)
admin.site.register(CourierLog)
admin.site.register(OTPLog)
admin.site.register(Anomaly)
admin.site.register(DashboardFeedback)
