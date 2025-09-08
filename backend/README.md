# Dropa Backend (Django)

This folder contains the Django backend for Dropa: AI-Powered Delivery Intelligence System.

## Features

- Delivery time prediction (ML integration)
- Anomaly detection
- Time-series forecasting
- RAG chatbot endpoint
- Secure OTP/QR delivery authentication
- Multi-role user management (Sender, Receiver, Courier, Admin)
- Geo-fencing and route monitoring
- Interactive dashboards via API

## Main API Endpoints

- `/api/predict/` : Predict delivery ETA
- `/api/anomaly/` : Detect delivery anomalies
- `/api/forecast/` : Forecast parcel volume
- `/api/otp/send/` : Send OTP for delivery
- `/api/otp/verify/` : Verify OTP
- `/api/chatbot/` : DropaBot analytics chatbot
- `/api/packages/` : List active/in-transit packages
- `/api/couriers/` : Courier stats and logs

## Setup

1. Create virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install django djangorestframework psycopg2-binary pyotp
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start server:
   ```bash
   python manage.py runserver
   ```

## ML Integration

- Place trained models in `ml_models/`
- Use Django views to load and serve predictions

---

See `instructions.md` for full system requirements.
