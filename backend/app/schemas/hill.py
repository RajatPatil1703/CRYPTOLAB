from typing import Literal
from pydantic import BaseModel, Field


class HillInputs(BaseModel):

    text: str = Field(
        ...,
        min_length=1,
        description="Plaintext or ciphertext."
    )

    key_matrix: list[list[int]] = Field(
        ...,
        description="A 2x2 or 3x3 Hill Cipher key matrix."
    )


class HillRequest(BaseModel):

    operation: Literal["encrypt", "decrypt"]

    inputs: HillInputs

    options: dict = Field(
        default_factory=lambda: {
            "show_steps": True
        }
    )