from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="Telecom Coverage Gaps API")

# SECURITY: Allows your Next.js frontend (port 3000) to safely talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CRASH PREVENTION: Dynamically looks up absolute paths on Windows
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MOCK_DATA_PATH = os.path.join(BASE_DIR, "mock", "mock_data.json")

@app.get("/")
def home():
    return {
        "status": "online",
        "project": "Telecom Coverage Gaps Map"
    }

@app.get("/api/coverage")
def coverage():
    # Defensive fall-safe check if the mock data file hasn't been generated yet
    if not os.path.exists(MOCK_DATA_PATH):
        return {"type": "FeatureCollection", "features": []}
        
    with open(MOCK_DATA_PATH, "r") as file:
        data = json.load(file)
    return data

# METRICS HANDSHAKE ENDPOINT FOR SIDEBAR
@app.get("/api/v1/dashboard/metrics")
def get_dashboard_metrics():

    with open(MOCK_DATA_PATH, "r") as file:
        data = json.load(file)

    regions = data["regions"]

    total_population = sum(
        region["population_served"]
        for region in regions
    )

    average_coverage = sum(
        region["coverage_score"]
        for region in regions
    ) / len(regions)

    return {
        "population_served": total_population,
        "national_coverage_score": round(average_coverage, 2)
    }