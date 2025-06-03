@app.get("/network-usage")
def network_usage():
    stats = psutil.net_io_counters()
    return {"Sent_MB": stats.bytes_sent / 1024 / 1024, "Received_MB": stats.bytes_recv / 1024 / 1024}