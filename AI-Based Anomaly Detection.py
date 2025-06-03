from fastapi import FastAPI
import numpy as np

app = FastAPI()

@app.get("/detect_anomaly/")
def detect_anomaly():
    data = np.random.normal(50, 15, 100)  # Simulated network data
    threshold = np.percentile(data, 95)  # Detect top 5% anomalies
    anomalies = [x for x in data if x > threshold]
    return {"detected_anomalies": anomalies}

# Run using: uvicorn filename:app --reload