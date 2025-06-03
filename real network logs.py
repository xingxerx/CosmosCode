from sklearn.ensemble import IsolationForest
import numpy as np

# Simulated latency data
latency_samples = np.array([30, 35, 32, 200, 40, 38, 250, 45, 37, 36])

# Train AI anomaly detector
model = IsolationForest(contamination=0.1)
model.fit(latency_samples.reshape(-1, 1))

# Detect anomalies
anomalies = model.predict(latency_samples.reshape(-1, 1))
print("🚨 Anomalies Detected:", latency_samples[anomalies == -1])