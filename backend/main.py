from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI()

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model (make sure you've run the training script first)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "breast_cancer_model.pkl")
model = joblib.load(MODEL_PATH)

class PredictionRequest(BaseModel):
    # Standard 30 features for Wisconsin Dataset
    features: list[float]

@app.get("/")
def home():
    return {"status": "Breast Cancer Detection API is running"}

@app.post("/predict")
async def predict(request: PredictionRequest):
    data = np.array(request.features).reshape(1, -1)
    prediction = model.predict(data)
    probability = model.predict_proba(data)
    
    # 0 is Malignant, 1 is Benign in this dataset
    label = "Malignant" if prediction[0] == 0 else "Benign"
    confidence = float(np.max(probability)) * 100

    return {
        "result": label,
        "confidence": f"{confidence:.2f}%",
        "is_malignant": bool(prediction[0] == 0)
    }