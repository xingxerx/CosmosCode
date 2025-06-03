from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "CGX Omni WiFi API is running!"}

@app.get("/latency")
def get_latency():
    return {"latency": "50ms"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)