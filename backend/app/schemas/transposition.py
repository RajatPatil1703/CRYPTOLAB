from typing import Literal
from pydantic import BaseModel, Field


class TranspositionInputs(BaseModel):

    text: str = Field(
        ...,
        min_length=1,
        description="Plaintext or ciphertext."
    )

    key: list[int] = Field(
        ...,
        min_length=2,
        description="A valid permutation key."
    )


class TranspositionRequest(BaseModel):

    operation: Literal["encrypt", "decrypt"]

    inputs: TranspositionInputs

    options: dict = Field(
        default_factory=lambda: {
            "show_steps": True
        }
    )