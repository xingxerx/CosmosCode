from fastapi import FastAPI
import subprocess
import requests

app = FastAPI()

@app.get("/latency")
def get_latency():
    """Fetch latest latency readings"""
    result = subprocess.run(["ping", "-n", "5", "8.8.8.8"], capture_output=True, text=True)
    return {"latency_data": result.stdout}

@app.get("/firewall")
def get_firewall_status():
    """Retrieve firewall status"""
    result = subprocess.run(["netsh", "advfirewall", "show", "allprofiles"], capture_output=True, text=True)
    return {"firewall_status": result.stdout}

@app.get("/alerts")
def get_alerts():
    """Fetch AI-driven alerts"""
    response = requests.get("http://your-dashboard-server/api/alerts")
    return response.json()