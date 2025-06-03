import time

@app.on_event("startup")
async def startup_event():
    while True:
        print("✅ Server is running")
        time.sleep(10)