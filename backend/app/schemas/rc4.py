from typing import Literal

from pydantic import BaseModel, Field


class RC4Inputs(BaseModel):
    text: str = Field(min_length=1, max_length=131072)
    key: str = Field(min_length=1, max_length=256)


class RC4Options(BaseModel):
    show_steps: bool = True


class RC4Request(BaseModel):
    operation: Literal["encrypt", "decrypt"]
    inputs: RC4Inputs
    options: RC4Options = Field(default_factory=RC4Options)
