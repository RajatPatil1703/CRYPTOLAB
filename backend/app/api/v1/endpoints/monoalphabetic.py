from fastapi import APIRouter, HTTPException

from app.algorithms.classical.monoalphabetic import (
    monoalphabetic_cipher
)

from app.schemas.monoalphabetic import MonoalphabeticRequest
from app.schemas.response import SuccessResponse


router = APIRouter()


@router.post(
    "/algorithms/monoalphabetic/execute",
    response_model=SuccessResponse,
    summary="Execute Monoalphabetic Substitution Cipher"
)
def execute_monoalphabetic(request: MonoalphabeticRequest):

    try:

        text = request.inputs.get("text")
        key = request.inputs.get("key")

        if text is None:
            raise ValueError("Text input is required.")

        if key is None:
            raise ValueError("Substitution key is required.")

        result = monoalphabetic_cipher(
            text=text,
            key=key,
            operation=request.operation,
            show_steps=request.options.get("show_steps", True)
        )

        return SuccessResponse(
            data=result,
            metadata={
                "algorithm": "Monoalphabetic Substitution Cipher",
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