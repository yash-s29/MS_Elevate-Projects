# =========================================================
# train_model.py
# Phase 2 + Phase 3
# Data Cleaning → Preprocessing → Model Training → Saving
# =========================================================

import os
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# -----------------------------
# CONFIGURATION
# -----------------------------
DATA_PATH = "../data/food_spoilage.csv"   # adjust if needed
RANDOM_STATE = 42
TEST_SIZE = 0.2

ARTIFACT_DIR = "artifacts"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

# -----------------------------
# 1. LOAD DATASET
# -----------------------------
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

df = pd.read_csv(DATA_PATH)

print("Initial dataset shape:", df.shape)
print("Original columns:", df.columns.tolist())

# -----------------------------
# 2. CLEAN COLUMN NAMES
# -----------------------------
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(" ", "_")
    .str.replace("(", "")
    .str.replace(")", "")
)

expected_columns = {
    "fruit",
    "temp",
    "humid_%",
    "light_fux",
    "co2_pmm",
    "class"
}

missing_cols = expected_columns - set(df.columns)
if missing_cols:
    raise ValueError(f"Missing expected columns: {missing_cols}")

# -----------------------------
# 3. CLEAN TARGET LABEL
# -----------------------------
df["class"] = df["class"].astype(str).str.strip().str.lower()
df["class"] = df["class"].replace({"bad": "bad", "good": "good"})

# Drop missing rows
df = df.dropna()

print("\nAfter cleaning shape:", df.shape)
print("\nClass distribution:")
print(df["class"].value_counts())

# -----------------------------
# 4. FEATURE / TARGET SPLIT
# -----------------------------
X = df.drop("class", axis=1)
y = df["class"]

# -----------------------------
# 5. TARGET ENCODING
# -----------------------------
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print("\nTarget encoding:")
for cls, val in zip(label_encoder.classes_,
                    label_encoder.transform(label_encoder.classes_)):
    print(f"{cls} -> {val}")

joblib.dump(label_encoder, f"{ARTIFACT_DIR}/label_encoder.pkl")

# -----------------------------
# 6. PREPROCESSING PIPELINE
# -----------------------------
categorical_features = ["fruit"]
numeric_features = ["temp", "humid_%", "light_fux", "co2_pmm"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features)
    ]
)

joblib.dump(preprocessor, f"{ARTIFACT_DIR}/preprocessor.pkl")

# -----------------------------
# 7. TRAIN / TEST SPLIT
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=TEST_SIZE,
    random_state=RANDOM_STATE,
    stratify=y_encoded
)

print("\nTrain size:", X_train.shape)
print("Test size:", X_test.shape)

# -----------------------------
# 8. BASELINE MODEL — LOGISTIC REGRESSION
# -----------------------------
log_reg_pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(
            max_iter=1000,
            random_state=RANDOM_STATE
        ))
    ]
)

print("\nTraining Logistic Regression...")
log_reg_pipeline.fit(X_train, y_train)

y_pred_lr = log_reg_pipeline.predict(X_test)
lr_accuracy = accuracy_score(y_test, y_pred_lr)

print("\nLogistic Regression Accuracy:", round(lr_accuracy, 4))
print(classification_report(
    y_test,
    y_pred_lr,
    target_names=label_encoder.classes_
))

# -----------------------------
# 9. FINAL MODEL — RANDOM FOREST
# -----------------------------
rf_pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(
            n_estimators=150,
            random_state=RANDOM_STATE,
            n_jobs=-1
        ))
    ]
)

print("\nTraining Random Forest...")
rf_pipeline.fit(X_train, y_train)

y_pred_rf = rf_pipeline.predict(X_test)
rf_accuracy = accuracy_score(y_test, y_pred_rf)

print("\nRandom Forest Accuracy:", round(rf_accuracy, 4))
print(classification_report(
    y_test,
    y_pred_rf,
    target_names=label_encoder.classes_
))

# -----------------------------
# 10. MODEL SELECTION
# -----------------------------
print("\nMODEL COMPARISON")
print("-" * 30)
print(f"Logistic Regression Accuracy: {round(lr_accuracy, 4)}")
print(f"Random Forest Accuracy:      {round(rf_accuracy, 4)}")

if rf_accuracy >= lr_accuracy:
    final_model = rf_pipeline
    selected = "Random Forest"
else:
    final_model = log_reg_pipeline
    selected = "Logistic Regression"

print(f"\nSelected Model: {selected}")

# -----------------------------
# 11. SAVE FINAL MODEL
# -----------------------------
joblib.dump(final_model, f"{ARTIFACT_DIR}/spoilage_model.pkl")

print("\nFinal model saved at:")
print(f"{ARTIFACT_DIR}/spoilage_model.pkl")
print("\nPHASE 2 + PHASE 3 COMPLETED SUCCESSFULLY.")
