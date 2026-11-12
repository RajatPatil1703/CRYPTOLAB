from typing import Any


ALPHABET_SIZE = 26


def caesar_cipher(
    text: str,
    key: int,
    operation: str,
    show_steps: bool = True,
) -> dict[str, Any]:

    if not isinstance(text, str):
        raise ValueError("Text must be a string.")

    if not isinstance(key, int) or isinstance(key, bool):
        raise ValueError("Key must be an integer.")

    if operation not in ("encrypt", "decrypt"):
        raise ValueError("Operation must be 'encrypt' or 'decrypt'.")

    normalized_key = key % ALPHABET_SIZE

    if operation == "decrypt":
        normalized_key = -normalized_key

    result = []
    steps = []

    for index, character in enumerate(text):

        if character.isascii() and character.isalpha():

            base = ord("A") if character.isupper() else ord("a")

            original_position = ord(character) - base
            new_position = (original_position + normalized_key) % ALPHABET_SIZE

            transformed_character = chr(base + new_position)

            result.append(transformed_character)

            if show_steps:
                steps.append({
                    "position": index + 1,
                    "original_character": character,
                    "original_position": original_position,
                    "key": key,
                    "normalized_key": normalized_key,
                    "new_position": new_position,
                    "result_character": transformed_character,
                    "formula": (
                        f"({original_position} + {normalized_key}) "
                        f"mod 26 = {new_position}"
                    )
                })

        else:
            result.append(character)

            if show_steps:
                steps.append({
                    "position": index + 1,
                    "original_character": character,
                    "result_character": character,
                    "transformed": False,
                    "reason": "Non-English alphabetic character preserved."
                })

    return {
        "input_text": text,
        "output_text": "".join(result),
        "operation": operation,
        "original_key": key,
        "normalized_key": key % ALPHABET_SIZE,
        "steps": steps,
        "total_characters": len(text),
        "transformed_characters": sum(
            1 for character in text
            if character.isascii() and character.isalpha()
        )
    }