from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def predictions():

    return {
        "message": "Prediction service ready",
        "predictions": []
    }