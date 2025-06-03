import requests

def send_alert(message):
    requests.post("http://127.0.0.1:8090/api/alerts", json={"alert": message})
    print("🔔 ALERT SENT:", message)

send_alert("🚨 Traffic anomaly detected!")