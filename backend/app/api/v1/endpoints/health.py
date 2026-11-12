from fastapi import APIRouter
from app.schemas.response import SuccessResponse

router = APIRouter()


@router.get("", response_model=SuccessResponse, summary="Check API health")
def health_check():
    return SuccessResponse(
        data={
            "status": "healthy",
            "service": "cryptolab-backend",
        },
        metadata={"api_version": "v1"},
    )
