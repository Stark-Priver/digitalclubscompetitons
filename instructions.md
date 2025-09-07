📦 Dropa: AI-Powered Delivery Intelligence System

"Deliver Smarter. Detect Faster. Predict Better."

📘 Executive Summary

Dropa is a comprehensive AI-powered Delivery Intelligence System built to transform the postal and courier sub-sector. It leverages machine learning, real-time analytics, geo-fencing, and predictive tools to optimize parcel delivery operations across cities.

The system enables:

Delivery time prediction

Anomaly detection

Geo-fencing and route monitoring

Secure OTP verification for sensitive parcels

Multi-user roles for senders, receivers, and courier companies

Interactive dashboards

A mini logistics chatbot assistant (Dropa AI)

🧑‍💼 Use Case: Posta Office & Courier Industry

Designed for Posta Offices and Courier Companies, Dropa solves operational pain points:

Inconsistent delivery times

Delays and route deviations

Lack of predictive analytics

No customer transparency or secure authentication

🔐 User Roles & Permissions
Role Capabilities
Sender (User) Create package delivery, track delivery status, receive OTP for authentication
Receiver (User) Receive delivery, input OTP, give feedback
Courier Company Assign couriers, monitor routes, manage anomalies
Admin/Posta Staff View all system data, performance dashboards, manage accounts
🧠 Key Features
✅ Core Functionalities
Feature Description
Delivery Time Prediction AI model predicts Estimated Time of Arrival (ETA) for any parcel
Anomaly Detection Flags delivery patterns that are too fast/slow or outside working hours
Secure Delivery (OTP/QR) Sensitive parcels require 2FA via OTP or QR scan to ensure recipient authenticity
Real-time Dashboards Visualize ETAs, delays, courier performance, anomalies
💡 Extra Features (To Impress Judges)
Feature Description
📍 Geo-Fencing Alerts Map view alerts when a courier strays from the optimal delivery path
📊 What-if Predictions Simulation of ETA based on different schedules (e.g., “What if delivered at 8am?”)
🕓 Time-Series Forecasts Predict volume of packages per city per day using time series models
🧠 Dropa Mini AI Chatbot (RAG) Answers questions like “Which courier has most delays?” using a Retrieval-Augmented Generation pipeline
🎨 Dark Mode Toggle Slick UI toggle between Light & Dark themes for enhanced user experience
⚙️ System Architecture
+-------------------------+
| React Frontend |
| - MapView (Leaflet) |
| - OTP Authenticator |
| - Dashboard (Charts) |
| - Chatbot Widget |
+------------+------------+
|
v
+-------------------------+
| Django Backend API |
| - Predict ETA |
| - Anomaly Detection |
| - OTP Auth + JWT |
| - Chatbot Endpoint |
+------------+------------+
|
v
+-------------------------+
| Machine Learning |
| - Time Prediction Model|
| - Anomaly Model |
| - Time Series Model |
| - RAG Chatbot Embeddings|
+-------------------------+
|
v
+-------------------------+
| PostgreSQL DB |
| - Users, Packages |
| - Courier Logs |
| - OTP logs |
+-------------------------+

🛠️ Tech Stack
Layer Technology
Frontend React, Tailwind CSS, Chart.js, Leaflet.js
Backend Django, Django REST Framework, JWT Auth, PyOTP
ML Python, Jupyter, scikit-learn, XGBoost, LightGBM, Prophet (for forecasting), Transformers (for chatbot)
Database PostgreSQL
DevOps Docker, GitHub
NLP HuggingFace + Faiss (for Dropa Chatbot RAG)
🧪 Machine Learning Models
Model Task Metric
Delivery ETA XGBoost Regression MAE, RMSE
Anomaly Detection Isolation Forest Accuracy on labeled anomalies
Forecasting Prophet or ARIMA RMSE on daily parcel volume
RAG Chatbot SentenceTransformers + Retrieval + LLM Precision@k
🔐 Security Features

JWT authentication for all user accounts

Role-based access control

OTP authentication for parcel handoff (PyOTP)

QR code simulation for delivery scan

Admin-only views for sensitive data

🌐 API Endpoints (Backend)
Endpoint Method Description
/api/predict/ POST Predict delivery time for a given parcel
/api/anomaly/ POST Check for delivery anomalies
/api/forecast/ GET Return forecasted delivery volume
/api/otp/send/ POST Send OTP to sender or receiver
/api/otp/verify/ POST Verify OTP on delivery
/api/chatbot/ POST Answer user queries via Dropa Chatbot
/api/packages/ GET List of active/in-transit packages
/api/couriers/ GET Courier stats and logs
🖼️ Frontend Pages
Page Components
Home.jsx General overview, welcome screen
Dashboard.jsx ETA graph, courier leaderboards, alerts feed
PackageTrack.jsx Track parcel live, OTP verification
CourierStats.jsx Performance, average delivery time, map
GeoMap.jsx Leaflet map with routes, geo-fencing alerts
DropaBot.jsx Mini AI assistant with chat window
Login/Register.jsx Auth pages for Sender, Receiver, Courier, Admin
🌍 Map & Routing (Leaflet Integration)

Display courier routes on Leaflet.js map

Highlight routes with delay warnings

Trigger geo-fencing alert if the courier goes 1+ km off path

Optional: simulate live courier tracking using mock GPS

🧠 DropaBot (RAG Assistant)

A chatbot trained on your internal delivery data (FAQs, logs, performance reports)

Built using:

HuggingFace Embeddings (e.g., sentence-transformers)

FAISS for vector search

Open-source LLM (e.g., Mistral or fine-tuned GPT)

Sample queries:

"Which city has the highest delays?"

"How many deliveries failed last week?"

"Show me fastest couriers in Nairobi"

🖤 UI/UX Highlights

Dark Mode toggle across all pages

Real-time updates with socket refresh (optional)

Interactive charts with Recharts or Chart.js

Mobile-responsive layout

QR-style simulated OTP scanner

🧪 Testing

Unit tests for ML model outputs

API tests with Django's built-in APITestCase

UI testing using Cypress or Jest

📦 Future Extensions

IoT integration for courier GPS hardware

Real-time traffic data ingestion

Full mobile app for couriers (React Native)

Admin analytics powered by LangChain or Agents

📝 How to Run Locally

# 1. Clone the repo

git clone https://github.com/yourusername/dropa.git
cd dropa

# 2. Set up backend

cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py runserver

# 3. Set up frontend

cd ../frontend
npm install
npm start

# 4. Launch Jupyter Notebooks for ML

cd ../ml
jupyter notebook

👥 Team & Credits
Name Role
Jules Frontend Developer
[Your Name] ML Engineer & Backend Developer
[Teammate] UI/UX Designer
[Teammate] Data Engineer
📎 Submission Checklist

✅ Working prediction model
✅ Anomaly detection implemented
✅ Full-stack integration (React + Django + ML)
✅ Multiple user roles (Sender, Receiver, Courier, Admin)
✅ Dashboard with visualizations
✅ Geo-fencing and Map tracking
✅ DropaBot chatbot assistant
✅ Clean UI with dark mode
✅ Complete documentation
   the data are like order_id,from_dipan_id,from_city_name,delivery_user_id,poi_lng,poi_lat,aoi_id,typecode,receipt_time,receipt_lng,receipt_lat,sign_time,sign_lng,sign_lat,ds
687227b4d0c733049b16ccd566db6e01,08331170e24742ba7a3938f5b34ff24d,Mbeya,18ff78d2069125937a847fb701a9db6c,33.50171174801936,-8.867390009174292,e0581ca18e7ca371a9869e041cb09075,4602b38053ece07a9ca5153f1df2e404,03-18 13:35:00,35.73888612922105,-6.175200320311059,03-18 14:51:00,35.77238742286925,-6.191757310933552,318
55be8cdf1270526231c9ba3387f51b54,c5ac5ba99801aa6b85ba473d9260512b,Dar es Salaam,df0b594618d1ba6f619e4e7dd034447c,39.20281094774417,-6.758017911168823,9c0f96ff01a71477334ef563001abc72,203ac3454d75e02ebb0a3c6f51d735e4,03-18 08:32:00,36.68331680439762,-3.4030857796517116,03-18 14:33:00,36.69397728684206,-3.3772852637507915,318
ee46cae9ba2c002451af3c6fbcb49410,2129bfb99a2f6c11000c0ecbf1a5f3f6,Mwanza,05cceaaa5db96756294dd6d573fd865d,32.95972529245992,-2.5578758884410764,4de9bf7f155046e7d0fd400672ab9cf3,203ac3454d75e02ebb0a3c6f51d735e4,03-18 13:02:00,36.649081378931825,-3.3635792374525684,03-18 15:34:00,36.66093210406623,-3.3714501814517206,318
38912be86c83138901b5e26398832be7,08331170e24742ba7a3938f5b34ff24d,Dar es Salaam,f29e97ef8398477abb72b852b16c91c0,39.19864951892082,-6.825872579509451,fe48cde9b33e2308641d985f8a701c7e,203ac3454d75e02ebb0a3c6f51d735e4,03-18 12:11:00,35.7784535852393,-6.21058906933976,03-18 14:08:00,35.77723474679636,-6.20461879828519,318
2b83e2ba16714fee357694964d0e7e41,4fe96250270c2e17a28016a5fba4bc4a,Arusha,1d00e6f2308aad233f0179aac63aa23d,36.71471797299817,-3.3709716263076484,a7d4de5484ca867fe453976ba9fee424,4602b38053ece07a9ca5153f1df2e404,03-18 07:28:00,35.759835604842635,-6.159012741853571,03-20 12:40:00,35.748038255893704,-6.176870895680695,318
4b392c6cf454d4b076f9c9b0127744cc,328fc34276e32793232a2ccd49129496,Mwanza,8bb58c7fd229efb3b2c592bee0908cb3,32.92981928477991,-2.5530574861739486,27926d6d8a1d20f13151a909ff4954fc,203ac3454d75e02ebb0a3c6f51d735e4,03-18 09:53:00,35.74129935669305,-6.143901975088829,03-18 10:29:00,35.7944878176808,-6.2053105260806,318
ca37fa1616facc0cee3456ddd241d578,e1bc01d56842db4f5af554b4ed402437,Mbeya,2e31f27ab201df55789ceb24bd192d87,33.44402774689843,-8.888676155466465,293172e668940aa9f0ef685ad12b116b,203ac3454d75e02ebb0a3c6f51d735e4,03-18 08:26:00,39.175781891184585,-6.770877109895908,03-18 09:58:00,39.166079086869864,-6.8391330614670345,318