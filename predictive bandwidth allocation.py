import psutil

def monitor_network():
    stats = psutil.net_io_counters()
    print(f"Sent: {stats.bytes_sent / 1024 / 1024:.2f} MB, Received: {stats.bytes_recv / 1024 / 1024:.2f} MB")

monitor_network()