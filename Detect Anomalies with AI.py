import numpy as np
from sklearn.ensemble import IsolationForest

# Sample network latency data
latency_samples = np.array([20, 22, 19, 18, 21, 50, 23, 22, 19, 17])

# Train anomaly detection model
model = IsolationForest(contamination=0.1)
model.fit(latency_samples.reshape(-1, 1))

# Predict anomalies
anomalies = model.predict(latency_samples.reshape(-1, 1))
print("Anomalies detected:", latency_samples[anomalies == -1])