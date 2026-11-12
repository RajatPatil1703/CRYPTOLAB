from typing import Any
from pydantic import BaseModel, Field


class SuccessResponse(BaseModel):
    success: bool = True
    data: Any
    metadata: dict[str, Any] = Field(default_factory=dict)


class ErrorBody(BaseModel):
    code: str
    message: str
    details: Any | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorBody
