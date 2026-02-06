from flask import Flask, render_template, request, redirect, url_for
import joblib
import pandas as pd
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)

# =====================================================
# PATHS
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR, "..", "model", "artifacts", "spoilage_model.pkl"
)

DB_PATH = os.path.join(BASE_DIR, "database.db")

# =====================================================
# LOAD MODEL (fail fast if missing)
# =====================================================
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load ML model: {e}")

# =====================================================
# DATABASE INITIALIZATION
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
            fruit TEXT NOT NULL,
            temp REAL NOT NULL,
            humid REAL NOT NULL,
            light REAL NOT NULL,
            co2 REAL NOT NULL,
            prediction TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


init_db()

# =====================================================
# ROUTES
# =====================================================

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/feedback", methods=["GET", "POST"])
def feedback():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO feedback (name, email, message, timestamp)
            VALUES (?, ?, ?, ?)
        """, (
            name,
            email,
            message,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        conn.commit()
        conn.close()

        return redirect(url_for("feedback"))

    return render_template("feedback.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        fruit = request.form["fruit"]
        temp = float(request.form["temp"])
        humid = float(request.form["humid_%"])
        light = float(request.form["light_fux"])
        co2 = float(request.form["co2_pmm"])
    except (KeyError, ValueError):
        return redirect(url_for("index"))

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

    return render_template("result.html", prediction=prediction)


@app.route("/history")
def history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM predictions
        ORDER BY id DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    return render_template("history.html", rows=rows)


@app.route("/delete/<int:prediction_id>", methods=["POST"])
def delete_prediction(prediction_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
    conn.commit()
    conn.close()
    
    return redirect(url_for("history"))


# =====================================================
# RUN
# =====================================================
if __name__ == "__main__":
    app.run(debug=True)
