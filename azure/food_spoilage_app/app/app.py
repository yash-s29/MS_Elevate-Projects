from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import pandas as pd
import sqlite3
import os
from datetime import datetime

# =====================================================
# BASE CONFIG
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_FOLDER = os.path.join(BASE_DIR, "static")

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path="")
CORS(app)

# =====================================================
# PATHS
# =====================================================
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "artifacts", "spoilage_model.pkl")
DB_PATH = os.path.join(BASE_DIR, "database.db")

# =====================================================
# LOAD MODEL
# =====================================================
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

# =====================================================
# DATABASE
# =====================================================
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fruit TEXT,
            temp REAL,
            humid REAL,
            light REAL,
            co2 REAL,
            prediction TEXT,
            timestamp TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            rating INTEGER,
            message TEXT,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()

init_db()

# =====================================================
# REACT SERVING (IMPORTANT)
# =====================================================

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    file_path = os.path.join(app.static_folder, path)

    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, "index.html")

# =====================================================
# API ROUTES
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        fruit = data["fruit"]
        temp = float(data["temp"])
        humid = float(data["humid"])
        light = float(data["light"])
        co2 = float(data["co2"])

    except (KeyError, ValueError, TypeError):
        return jsonify({"error": "Invalid input"}), 400

    input_df = pd.DataFrame([{
        "fruit": fruit,
        "temp": temp,
        "humid_%": humid,
        "light_fux": light,
        "co2_pmm": co2
    }])

    prediction_num = model.predict(input_df)[0]
    prediction = "Good" if prediction_num == 1 else "Bad"

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO predictions
        (fruit, temp, humid, light, co2, prediction, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        fruit,
        temp,
        humid,
        light,
        co2,
        prediction,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()
    conn.close()

    return jsonify({"prediction": prediction})


@app.route("/history", methods=["GET"])
def history():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM predictions ORDER BY id DESC")
    rows = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in rows])


@app.route("/delete/<int:prediction_id>", methods=["DELETE"])
def delete_prediction(prediction_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted successfully"})


@app.route("/feedback", methods=["POST"])
def feedback():
    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        rating = data.get("rating")
        message = data["message"]

    except Exception:
        return jsonify({"error": "Invalid input"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO feedback (name, email, rating, message, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (
        name,
        email,
        rating,
        message,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Feedback saved"})


# =====================================================
# RUN
# =====================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)