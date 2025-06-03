import numpy as np

latency_samples = np.array([30, 35, 40, 150, 38, 220])  
threshold = np.mean(latency_samples) + 2 * np.std(latency_samples)
anomalies = [x for x in latency_samples if x > threshold]

if anomalies:
    print(f"🚨 High traffic detected, adjusting priority: {anomalies}")
    # Implement dynamic bandwidth reallocation here