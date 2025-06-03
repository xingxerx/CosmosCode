import requests

def send_alert(message):
    alert_payload = {"alert": message}
    requests.post("http://your-dashboard-server/api/alerts", json=alert_payload)
    print("🔔 ALERT SENT:", message)