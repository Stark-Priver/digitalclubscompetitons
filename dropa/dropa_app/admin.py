from django.contrib import admin
from .models import User, Package, CourierLog, OTPLog, Anomaly, DashboardFeedback, DeliveryRoute, PerformanceMetrics

class OTPLogInline(admin.TabularInline):
    model = OTPLog
    extra = 0
    readonly_fields = ('otp_code', 'created_at', 'verified', 'verified_at', 'attempts')
    can_delete = False

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'sender', 'receiver', 'status', 'priority', 'created_at')
    list_filter = ('status', 'priority', 'from_city_name', 'to_city_name')
    search_fields = ('order_id', 'sender__username', 'receiver__username')
    inlines = [OTPLogInline]

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')

admin.site.register(CourierLog)
admin.site.register(OTPLog)
admin.site.register(Anomaly)
admin.site.register(DashboardFeedback)
admin.site.register(DeliveryRoute)
admin.site.register(PerformanceMetrics)
