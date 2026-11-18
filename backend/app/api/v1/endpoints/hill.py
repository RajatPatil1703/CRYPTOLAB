from fastapi import APIRouter, HTTPException

from app.algorithms.classical.hill import hill_cipher
from app.schemas.hill import HillRequest
from app.schemas.response import SuccessResponse


router = APIRouter()


@router.post(
    "/algorithms/hill/execute",
    response_model=SuccessResponse,
    summary="Execute Hill Cipher"
)
def execute_hill(request: HillRequest):

    try:

        result = hill_cipher(
            text=request.inputs.text,
            key_matrix=request.inputs.key_matrix,
            operation=request.operation,
            show_steps=request.options.get("show_steps", True)
        )

        return SuccessResponse(
            data=result,
            metadata={
                "algorithm": "Hill Cipher",
                "version": "1.0",
                "educational": True
            }
        )

    except ValueError as error:

        raise HTTPException(
            status_code=422,
            detail={
                "code": "INVALID_INPUT",
                "message": str(error)
            }
        )