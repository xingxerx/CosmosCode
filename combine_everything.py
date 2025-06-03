import subprocess
import time
import logging
import requests
import json

logging.basicConfig(filename="F:/CosmosCode/CGX_OmniWiFi.log", level=logging.INFO)

# 📡 AI-Driven Latency Monitoring
def monitor_latency():
    result = subprocess.run(["ping", "-n", "10", "8.8.8.8"], capture_output=True, text=True)
    latency_info = result.stdout
    if "time=200ms" in latency_info:  # Example threshold
        logging.warning("🚨 High Latency Detected!")
        send_alert("High latency detected!")
    return latency_info

# 🔒 AI-Based Security Alerts
def check_firewall():
    result = subprocess.run(["netsh", "advfirewall", "show", "allprofiles"], capture_output=True, text=True)
    firewall_status = result.stdout
    if "Blocked" in firewall_status:  
        send_alert("Firewall detected unusual activity!")
    return firewall_status

# 📊 SNMP Monitoring
def monitor_snmp():
    try:
        response = requests.get("http://your-snmp-server/api/stats")
        snmp_data = response.json()
        if snmp_data["high_traffic"]:  # Example condition
            send_alert("🚨 Heavy Network Load Detected!")
        return snmp_data
    except Exception as e:
        logging.error(f"SNMP Error: {e}")
        return None

# 🚀 AI-Based Traffic Optimization
def optimize_bandwidth():
    subprocess.run(["netsh", "interface", "ipv4", "set", "global", "congestionprovider=ctcp"])
    logging.info("Bandwidth Optimization Applied")

# 🔔 Alert System
def send_alert(message):
    """Send network alerts (can be linked to email, webhook, or dashboard)"""
    alert_payload = {"alert": message}
    requests.post("http://your-dashboard-server/api/alerts", json=alert_payload)
    logging.info(f"ALERT SENT: {message}")

# 🌍 Automation Loop
while True:
    monitor_latency()
    check_firewall()
    monitor_snmp()
    optimize_bandwidth()
    time.sleep(3600)  # Runs every hour