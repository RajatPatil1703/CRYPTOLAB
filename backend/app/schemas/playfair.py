from typing import Literal
from pydantic import BaseModel, Field


class PlayfairRequest(BaseModel):

    operation: Literal["encrypt", "decrypt"]

    inputs: dict

    options: dict = Field(
        default_factory=lambda: {
            "show_steps": True
        }
    )