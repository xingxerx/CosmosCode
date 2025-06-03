import numpy as np

# Simulated network traffic data
traffic_data = np.random.randint(10, 100, size=(24,))

# AI-based prioritization function
def prioritize_bandwidth(data):
    priority_threshold = np.percentile(data, 85)  # Top 15% usage threshold
    adjusted_allocation = [x if x < priority_threshold else priority_threshold for x in data]
    return adjusted_allocation

adjusted_bandwidth = prioritize_bandwidth(traffic_data)
print("Optimized Bandwidth Allocation:", adjusted_bandwidth)