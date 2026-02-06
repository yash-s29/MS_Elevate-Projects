# 🍲 Food Spoilage Prediction App

# 📌 Project Overview

The Food Spoilage Prediction App is a web-based application designed to predict the spoilage of food items using a Machine Learning model. This project demonstrates the integration of a Python Flask backend, a trained ML model, and cloud storage for seamless deployment.

**Note:** Since Azure services are pay-as-you-go, deploying this project on Azure requires an active subscription. For demonstration purposes, we integrated Google Cloud Platform (GCP) for model storage and deployment using the Google Cloud SDK.

# 🚀 Key Features

* Real-Time Spoilage Prediction: Users can input key parameters of food items, and the app predicts spoilage status instantly.

* Flask Backend: Handles ML model inference and API endpoints.

* Cloud-Hosted ML Model: The trained model is stored on Google Cloud Storage, fetched at app startup.

* Database Logging: All inputs and prediction results are stored locally in SQLite.

* User-Friendly Frontend: Intuitive UI with interactive input sliders and visualization of predictions.

* History & Tracking: Users can view past predictions, status badges, and delete or manage records.

# 🛠️ Tools & Technologies

**Backend**: Python Flask

**Machine Learning:** Scikit-learn / TensorFlow (depending on your model)

**Database:** SQLite (lightweight local storage)

**Cloud Storage:** Google Cloud Storage (GCP) to fetch and store the trained model

**Frontend:** HTML, CSS, JavaScript (interactive forms, tables, buttons, and dashboards)

**Deployment:** Google App Engine / Cloud Run using Google Cloud SDK

# 🌐 Architecture

User Input (Frontend)
        │
        ▼
        
Flask API Endpoint (Backend)
        │
        ▼
        
Load Model from GCP Storage
        │
        ▼
        
ML Model Inference
        │
        ▼
        
Return Prediction → Frontend Display
        │
        ▼
        
Store Input & Result → SQLite Database

# 📖 How to Run Locally

* Clone the repository:

git clone https://github.com/yash-s29/MS_Elevate-Projects.git
cd azure/food_spoilage_app


* Create and activate a virtual environment:

python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate


* Install dependencies:

pip install -r requirements.txt


Set up Google Cloud SDK:

Install Google Cloud SDK

Authenticate your account:

gcloud auth login
gcloud config set project YOUR_PROJECT_ID


* Run the Flask app:

python main.py


The app will automatically fetch the ML model from GCP Storage at startup.

Open in Browser:

Navigate to http://127.0.0.1:5000/ to access the web interface.

# 📂 Project Structure
food_spoilage_app/
│
├─ app.py

├─ requirements.txt

├─ templates/

├─ static/ 

├─ model/  

├─ database/ 

└─ README.md               

# 💡 Notes

-**Azure Limitation:** Deployment on Azure App Service requires a subscription due to pay-as-you-go billing.

-**Alternative Deployment:** For this project, Google Cloud Platform is used for storing the ML model and optionally deploying via Cloud Run or App Engine.

-**Extensibility:** You can easily swap the ML model or extend the database to PostgreSQL or MySQL if desired.

# 📌 Future Enhancements

* Add authentication for multi-user tracking

* Enable cloud-based database integration for scalability

* Add visualization dashboards for prediction trends

# 🛠️ References

* Flask Documentation

* Google Cloud SDK

* SQLite Documentation

[Scikit-learn / TensorFlow](https://scikit-learn.org/
 / https://www.tensorflow.org/
)

This README explains everything a visitor or collaborator needs to know: tech stack, cloud integration, Azure constraints, local setup, and architecture.


