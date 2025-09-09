"""
Management command to load delivery data from CSV file
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
import pandas as pd
import os
import random
from dropa_app.models import User, Package

class Command(BaseCommand):
    help = 'Load delivery data from CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--csv-path',
            type=str,
            help='Path to CSV file (optional, uses default data if not provided)',
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=100,
            help='Limit number of records to load (default: 100)',
        )

    def handle(self, *args, **options):
        csv_path = options['csv_path']
        limit = options['limit']
        
        if not csv_path:
            # Use the default CSV file
            csv_path = os.path.join(
                os.path.dirname(__file__), 
                '../../../data/delivery_five_cities_tanzania.csv'
            )
        
        if not os.path.exists(csv_path):
            self.stdout.write(
                self.style.ERROR(f'CSV file not found: {csv_path}')
            )
            return
        
        try:
            # Load CSV data
            df = pd.read_csv(csv_path)
            self.stdout.write(f'Loaded {len(df)} records from CSV')
            
            # Limit records if specified
            if limit and len(df) > limit:
                df = df.head(limit)
                self.stdout.write(f'Limited to {limit} records')
            
            # Create sample users if they don't exist
            self.create_sample_users()
            
            # Load package data
            self.load_packages(df)
            
            self.stdout.write(
                self.style.SUCCESS('Successfully loaded delivery data')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error loading data: {str(e)}')
            )

    def create_sample_users(self):
        """Create sample users if they don't exist"""
        
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@dropa.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write('Created admin user')
        
        # Create sample couriers
        couriers_data = [
            {
                'username': 'mjohnson',
                'email': 'michael@dropa.com',
                'first_name': 'Michael',
                'last_name': 'Johnson',
                'phone': '+255712345678'
            },
            {
                'username': 'swilliams',
                'email': 'sarah@dropa.com',
                'first_name': 'Sarah',
                'last_name': 'Williams',
                'phone': '+255712345679'
            },
            {
                'username': 'jmwanga',
                'email': 'james@dropa.com',
                'first_name': 'James',
                'last_name': 'Mwanga',
                'phone': '+255712345680'
            },
            {
                'username': 'amoses',
                'email': 'anna@dropa.com',
                'first_name': 'Anna',
                'last_name': 'Moses',
                'phone': '+255712345681'
            },
            {
                'username': 'pkibiki',
                'email': 'peter@dropa.com',
                'first_name': 'Peter',
                'last_name': 'Kibiki',
                'phone': '+255712345682'
            }
        ]
        
        for courier_data in couriers_data:
            if not User.objects.filter(username=courier_data['username']).exists():
                User.objects.create_user(
                    username=courier_data['username'],
                    email=courier_data['email'],
                    password='courier123',
                    first_name=courier_data['first_name'],
                    last_name=courier_data['last_name'],
                    phone=courier_data['phone'],
                    role='courier',
                    is_active=True
                )
                self.stdout.write(f"Created courier: {courier_data['username']}")

    def load_packages(self, df):
        """Load package data from DataFrame"""
        
        # Get all couriers
        couriers = list(User.objects.filter(role='courier'))
        
        if not couriers:
            self.stdout.write(self.style.WARNING('No couriers found. Creating sample couriers first.'))
            return
        
        # Status mapping
        status_options = ['pending', 'in_transit', 'delivered', 'cancelled']
        
        packages_created = 0
        
        for index, row in df.iterrows():
            try:
                # Generate order ID if not present
                order_id = row.get('order_id', f'DR{str(index + 1).zfill(6)}')
                
                # Skip if package already exists
                if Package.objects.filter(order_id=order_id).exists():
                    continue
                
                # Assign random courier
                courier = random.choice(couriers)
                
                # Determine status based on data or random
                if 'delivery_time_hours' in row and pd.notna(row['delivery_time_hours']):
                    # If delivery time is recorded, it's likely delivered
                    status = 'delivered' if row['delivery_time_hours'] > 0 else random.choice(status_options)
                else:
                    status = random.choice(status_options)
                
                # Calculate dates
                base_date = timezone.now() - timedelta(days=random.randint(0, 30))
                receipt_time = base_date
                
                if status == 'delivered':
                    delivery_hours = row.get('delivery_time_hours', random.uniform(1, 48))
                    sign_time = receipt_time + timedelta(hours=delivery_hours)
                else:
                    sign_time = None
                
                # Create package
                package = Package.objects.create(
                    order_id=order_id,
                    from_city_name=row.get('from_city', 'Dar es Salaam'),
                    to_city_name=row.get('to_city', 'Arusha'),
                    distance_km=row.get('distance_km', 100.0),
                    package_weight_kg=row.get('package_weight_kg', 1.0),
                    vehicle_type=row.get('vehicle_type', 'motorcycle'),
                    delivery_cost_tsh=row.get('delivery_cost_tsh', 5000.0),
                    status=status,
                    receipt_time=receipt_time,
                    sign_time=sign_time,
                    delivery_user=courier,
                    sender_name=f"Sender {index + 1}",
                    recipient_name=f"Recipient {index + 1}",
                    sender_phone=f"+25571234{str(index).zfill(4)}",
                    recipient_phone=f"+25571235{str(index).zfill(4)}",
                    package_description=f"Package from {row.get('from_city', 'Unknown')} to {row.get('to_city', 'Unknown')}",
                    special_instructions="Handle with care"
                )
                
                packages_created += 1
                
                if packages_created % 10 == 0:
                    self.stdout.write(f'Created {packages_created} packages...')
                    
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'Error creating package {index}: {str(e)}')
                )
                continue
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {packages_created} packages')
        )
