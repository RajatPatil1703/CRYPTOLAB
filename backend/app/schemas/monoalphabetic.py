from typing import Literal
from pydantic import BaseModel, Field


class MonoalphabeticRequest(BaseModel):

    operation: Literal["encrypt", "decrypt"]

    inputs: dict

    options: dict = Field(
        default_factory=lambda: {
            "show_steps": True
        }
    )