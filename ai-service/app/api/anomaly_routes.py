from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def detect_anomalies():

    return {
        "message": "Anomaly detection service ready",
        "anomalies": []
    }