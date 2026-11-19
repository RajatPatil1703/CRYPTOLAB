from fastapi import APIRouter, HTTPException

from app.algorithms.classical.rc4 import rc4_cipher
from app.schemas.rc4 import RC4Request
from app.schemas.response import SuccessResponse

router = APIRouter()


@router.post("/algorithms/rc4/execute", response_model=SuccessResponse, summary="Execute RC4 (educational)")
def execute_rc4(request: RC4Request):
    try:
        result = rc4_cipher(
            text=request.inputs.text,
            key=request.inputs.key,
            operation=request.operation,
            show_steps=request.options.show_steps,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail={"code": "INVALID_INPUT", "message": str(exc)}) from exc
    return SuccessResponse(data=result, metadata={"algorithm": "RC4", "version": "1.0", "educational": True})
