import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Prediction, Feedback
import joblib
import pandas as pd

# ─────────────────────────────
# APP SETUP
# ─────────────────────────────
app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Yss2005@localhost:3307/spoilage_ai"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# ─────────────────────────────
# MODEL LOAD
# ─────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "artifacts", "spoilage_model.pkl")

model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
else:
    print("⚠️ Model not found — using fallback logic")

# ─────────────────────────────
# DB INIT
# ─────────────────────────────
with app.app_context():
    db.create_all()
    print("✅ DB Ready")

# ─────────────────────────────
# HOME
# ─────────────────────────────
@app.route("/")
def home():
    return jsonify({
        "status": "Backend running",
        "routes": ["/predict", "/history", "/delete/<id>", "/feedback"]
    })

# ─────────────────────────────
# PREDICT (FIXED)
# ─────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        fruit = data["fruit"]
        temp = float(data["temp"])
        humid = float(data["humid"])
        light = float(data["light"])
        co2 = float(data["co2"])
    except:
        return jsonify({"error": "Invalid input"}), 400

    # ───── MODEL PREDICTION ─────
    try:
        if model:
            input_df = pd.DataFrame([{
                "fruit": fruit,
                "temp": temp,
                "humid_%": humid,
                "light_fux": light,
                "co2_pmm": co2
            }])

            pred = model.predict(input_df)[0]
            prediction = "Good" if int(pred) == 1 else "Bad"
            confidence = 0.9
        else:
            # fallback logic (safe)
            score = 0
            if temp > 30: score += 2
            elif temp > 22: score += 1

            if humid > 85: score += 2
            elif humid > 70: score += 1

            if co2 > 2000: score += 2
            elif co2 > 1000: score += 1

            prediction = "Bad" if score >= 3 else "Good"
            confidence = 0.75

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

    # ───── SAVE TO DB ─────
    try:
        rec = Prediction(
            food_item=fruit,
            temperature=temp,
            humidity=humid,
            light=light,
            co2=co2,
            prediction=prediction,
            confidence=confidence
        )

        db.session.add(rec)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "id": rec.id,
        "prediction": prediction,
        "confidence": confidence
    })

# ─────────────────────────────
# HISTORY
# ─────────────────────────────
@app.route("/history", methods=["GET"])
def history():
    records = Prediction.query.order_by(Prediction.id.desc()).all()

    return jsonify([
        {
            "id": r.id,
            "food_item": r.food_item,
            "temperature": r.temperature,
            "humidity": r.humidity,
            "light": r.light,
            "co2": r.co2,
            "prediction": r.prediction,
            "confidence": r.confidence
        }
        for r in records
    ])

# ─────────────────────────────
# DELETE
# ─────────────────────────────
@app.route("/delete/<int:id>", methods=["DELETE"])
def delete(id):
    rec = Prediction.query.get(id)

    if not rec:
        return jsonify({"error": "Not found"}), 404

    try:
        db.session.delete(rec)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────
# FEEDBACK
# ─────────────────────────────
@app.route("/feedback", methods=["POST"])
def feedback():
    data = request.get_json()

    try:
        fb = Feedback(
            name=data["name"],
            email=data["email"],
            rating=int(data["rating"]),
            message=data["message"]
        )

        db.session.add(fb)
        db.session.commit()

        return jsonify({"success": True})

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────
# RUN
# ─────────────────────────────
if __name__ == "__main__":
    print("🚀 Backend running → http://127.0.0.1:5000")
    app.run(debug=True, port=5000)