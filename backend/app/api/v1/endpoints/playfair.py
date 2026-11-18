from fastapi import APIRouter, HTTPException

from app.algorithms.classical.playfair import playfair_cipher
from app.schemas.playfair import PlayfairRequest
from app.schemas.response import SuccessResponse


router = APIRouter()


@router.post(
    "/algorithms/playfair/execute",
    response_model=SuccessResponse,
    summary="Execute Playfair Cipher"
)
def execute_playfair(request: PlayfairRequest):

    try:

        text = request.inputs.get("text")
        key = request.inputs.get("key")

        if text is None:
            raise ValueError("Text input is required.")

        if key is None:
            raise ValueError("Keyword is required.")

        result = playfair_cipher(
            text=text,
            key=key,
            operation=request.operation,
            show_steps=request.options.get("show_steps", True)
        )

        return SuccessResponse(
            data=result,
            metadata={
                "algorithm": "Playfair Cipher",
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