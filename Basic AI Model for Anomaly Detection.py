import numpy as np

def detect_anomalies(data):
    """Detect spikes and unusual traffic fluctuations"""
    threshold = np.mean(data) + 2 * np.std(data)
    anomalies = [x for x in data if x > threshold]
    
    if anomalies:
        send_alert(f"🚨 AI Alert: Anomalous network behavior detected! {anomalies}")
        
    return anomalies