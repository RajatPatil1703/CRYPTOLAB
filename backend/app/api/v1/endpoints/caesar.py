from fastapi import APIRouter, HTTPException

from app.algorithms.classical.caesar import caesar_cipher
from app.schemas.caesar import CaesarRequest
from app.schemas.response import SuccessResponse


router = APIRouter()


@router.post(
    "/algorithms/caesar/execute",
    response_model=SuccessResponse,
    summary="Execute Caesar Cipher"
)
def execute_caesar(request: CaesarRequest):

    try:

        text = request.inputs.get("text")
        key = request.inputs.get("key")

        if text is None:
            raise ValueError("Text input is required.")

        if key is None:
            raise ValueError("Encryption/decryption key is required.")

        show_steps = request.options.get("show_steps", True)

        result = caesar_cipher(
            text=text,
            key=key,
            operation=request.operation,
            show_steps=show_steps
        )

        return SuccessResponse(
            data=result,
            metadata={
                "algorithm": "Caesar Cipher",
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