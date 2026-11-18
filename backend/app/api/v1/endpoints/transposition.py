from fastapi import APIRouter, HTTPException

from app.algorithms.classical.transposition import (
    transposition_cipher
)

from app.schemas.transposition import TranspositionRequest
from app.schemas.response import SuccessResponse


router = APIRouter()


@router.post(
    "/algorithms/transposition/execute",
    response_model=SuccessResponse,
    summary="Execute Transposition Cipher"
)
def execute_transposition(request: TranspositionRequest):

    try:

        result = transposition_cipher(
            text=request.inputs.text,
            key=request.inputs.key,
            operation=request.operation,
            show_steps=request.options.get("show_steps", True)
        )

        return SuccessResponse(
            data=result,
            metadata={
                "algorithm": "Transposition Cipher",
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