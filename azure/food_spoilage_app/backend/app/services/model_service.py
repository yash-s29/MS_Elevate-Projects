import joblib
import pandas as pd
import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "artifacts", "spoilage_model.pkl")

model = joblib.load(MODEL_PATH)

def predict_spoilage(data):
    df = pd.DataFrame([{
        "fruit": data["fruit"],
        "temp": data["temp"],
        "humid_%": data["humid"],
        "light_fux": data["light"],
        "co2_pmm": data["co2"]
    }])

    # prediction
    pred = model.predict(df)[0]

    # correct label mapping
    if hasattr(model, "classes_"):
        class_labels = model.classes_

    # convert numeric prediction → correct label
    result = class_labels[pred] if isinstance(pred, (int, np.integer)) else str(pred)

    # confidence FIXED
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(df)[0]

        confidence = float(np.max(proba))
    else:
        confidence = 0.75

    return result, confidence