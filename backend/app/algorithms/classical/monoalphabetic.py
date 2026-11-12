from typing import Any
import string

ALPHABET = string.ascii_uppercase


def validate_key(key: str) -> str:

    if not isinstance(key, str):
        raise ValueError("Substitution key must be a string.")

    key = key.upper()

    if len(key) != 26:
        raise ValueError("Substitution key must contain exactly 26 characters.")

    if not key.isalpha() or not key.isascii():
        raise ValueError("Key must contain only English alphabetic characters.")

    if len(set(key)) != 26:
        raise ValueError("Every letter must appear exactly once in the key.")

    return key


def monoalphabetic_cipher(
    text: str,
    key: str,
    operation: str,
    show_steps: bool = True,
) -> dict[str, Any]:

    if not isinstance(text, str):
        raise ValueError("Text must be a string.")

    if operation not in ("encrypt", "decrypt"):
        raise ValueError("Operation must be 'encrypt' or 'decrypt'.")

    key = validate_key(key)

    if operation == "encrypt":
        mapping = dict(zip(ALPHABET, key))
    else:
        mapping = dict(zip(key, ALPHABET))

    result = []
    steps = []

    for index, character in enumerate(text):

        if character.isascii() and character.isalpha():

            is_upper = character.isupper()
            original = character.upper()

            transformed = mapping[original]

            if not is_upper:
                transformed = transformed.lower()

            result.append(transformed)

            if show_steps:
                steps.append({
                    "position": index + 1,
                    "input_character": character,
                    "output_character": transformed,
                    "transformed": True,
                    "operation": operation,
                    "mapping": f"{original} → {mapping[original]}"
                })

        else:
            result.append(character)

            if show_steps:
                steps.append({
                    "position": index + 1,
                    "input_character": character,
                    "output_character": character,
                    "transformed": False,
                    "reason": "Non-English alphabetic character preserved."
                })

    return {
        "input_text": text,
        "output_text": "".join(result),
        "operation": operation,
        "key": key,
        "mapping": mapping,
        "steps": steps,
        "total_characters": len(text),
        "transformed_characters": sum(
            1 for character in text
            if character.isascii() and character.isalpha()
        )
    }