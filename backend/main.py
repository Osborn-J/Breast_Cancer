from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI()

# Get allowed origins from environment variable (Render Dashboard)
# If not set, it defaults to "*" which is okay for testing but update later!
raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
origins = raw_origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Robust Model Loading
# This ensures Render finds the .pkl file regardless of the working directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "breast_cancer_model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class PredictionRequest(BaseModel):
    features: list[float]

@app.get("/")
def home():
    return {
        "status": "Online",
        "system": "Breast Cancer Diagnostic API",
        "model_loaded": model is not None
    }

@app.post("/predict")
async def predict(request: PredictionRequest):
    if model is None:
        return {"error": "Model not initialized on server"}
        
    data = np.array(request.features).reshape(1, -1)
    prediction = model.predict(data)
    probability = model.predict_proba(data)
    
    label = "Malignant" if prediction[0] == 0 else "Benign"
    confidence = float(np.max(probability)) * 100

    return {
        "result": label,
        "confidence": f"{confidence:.2f}%",
        "is_malignant": bool(prediction[0] == 0)
    }