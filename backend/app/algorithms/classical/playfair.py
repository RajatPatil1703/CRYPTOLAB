from typing import Any
import string


ALPHABET = "ABCDEFGHIKLMNOPQRSTUVWXYZ"
DEFAULT_FILLER = "X"


def normalize_text(text: str) -> str:
    """
    Convert text to uppercase English letters.
    J is converted to I.
    Non-English alphabetic characters and punctuation are removed.
    """

    if not isinstance(text, str):
        raise ValueError("Text must be a string.")

    normalized = []

    for character in text.upper():

        if character.isascii() and character.isalpha():

            if character == "J":
                character = "I"

            normalized.append(character)

    return "".join(normalized)


def generate_key_matrix(key: str) -> list[list[str]]:
    """
    Generate the 5x5 Playfair key matrix.
    """

    if not isinstance(key, str):
        raise ValueError("Key must be a string.")

    normalized_key = normalize_text(key)

    if not normalized_key:
        raise ValueError("Key must contain at least one English letter.")

    matrix_letters = []
    seen = set()

    # Add unique keyword characters.
    for character in normalized_key:

        if character not in seen:
            matrix_letters.append(character)
            seen.add(character)

    # Add remaining alphabet characters.
    for character in ALPHABET:

        if character not in seen:
            matrix_letters.append(character)
            seen.add(character)

    return [
        matrix_letters[index:index + 5]
        for index in range(0, 25, 5)
    ]


def create_position_map(
    matrix: list[list[str]]
) -> dict[str, tuple[int, int]]:

    positions = {}

    for row in range(5):

        for column in range(5):

            positions[matrix[row][column]] = (row, column)

    return positions


def choose_filler(character: str) -> str:
    """
    Use X normally.
    Use Q when the repeated character is X.
    """

    return "Q" if character == "X" else DEFAULT_FILLER


def prepare_digraphs(text: str) -> tuple[list[str], list[dict[str, Any]]]:
    """
    Prepare plaintext into pairs of letters.

    Repeated letters within a pair are separated using a filler.
    Odd-length plaintext receives a filler at the end.
    """

    normalized = normalize_text(text)

    if not normalized:
        raise ValueError("Plaintext must contain at least one English letter.")

    digraphs = []
    steps = []

    index = 0

    while index < len(normalized):

        first = normalized[index]

        if index + 1 >= len(normalized):

            filler = choose_filler(first)

            pair = first + filler

            digraphs.append(pair)

            steps.append({
                "type": "padding",
                "position": index + 1,
                "original_character": first,
                "filler": filler,
                "digraph": pair,
                "explanation": "Odd number of letters. A filler was appended."
            })

            index += 1

        else:

            second = normalized[index + 1]

            if first == second:

                filler = choose_filler(first)

                pair = first + filler

                digraphs.append(pair)

                steps.append({
                    "type": "duplicate_letter",
                    "position": index + 1,
                    "first_character": first,
                    "repeated_character": second,
                    "filler": filler,
                    "digraph": pair,
                    "explanation": "Repeated letters separated using a filler."
                })

                # Advance only one character.
                index += 1

            else:

                pair = first + second

                digraphs.append(pair)

                steps.append({
                    "type": "pair_formation",
                    "position": index + 1,
                    "digraph": pair,
                    "explanation": "Two different letters grouped together."
                })

                index += 2

    return digraphs, steps


def transform_pair(
    pair: str,
    positions: dict[str, tuple[int, int]],
    matrix: list[list[str]],
    operation: str
) -> dict[str, Any]:

    first, second = pair

    row1, col1 = positions[first]
    row2, col2 = positions[second]

    direction = 1 if operation == "encrypt" else -1

    if row1 == row2:

        rule = "same_row"

        new_first = matrix[row1][(col1 + direction) % 5]
        new_second = matrix[row2][(col2 + direction) % 5]

        explanation = (
            "Both letters are in the same row. "
            "Move each letter horizontally."
        )

    elif col1 == col2:

        rule = "same_column"

        new_first = matrix[(row1 + direction) % 5][col1]
        new_second = matrix[(row2 + direction) % 5][col2]

        explanation = (
            "Both letters are in the same column. "
            "Move each letter vertically."
        )

    else:

        rule = "rectangle"

        new_first = matrix[row1][col2]
        new_second = matrix[row2][col1]

        explanation = (
            "The letters form a rectangle. "
            "Exchange their column positions."
        )

    return {
        "input_pair": pair,
        "output_pair": new_first + new_second,
        "rule": rule,
        "first_position": {
            "row": row1 + 1,
            "column": col1 + 1
        },
        "second_position": {
            "row": row2 + 1,
            "column": col2 + 1
        },
        "explanation": explanation
    }


def playfair_cipher(
    text: str,
    key: str,
    operation: str,
    show_steps: bool = True
) -> dict[str, Any]:

    if operation not in ("encrypt", "decrypt"):
        raise ValueError("Operation must be 'encrypt' or 'decrypt'.")

    matrix = generate_key_matrix(key)

    positions = create_position_map(matrix)

    if operation == "encrypt":

        digraphs, preparation_steps = prepare_digraphs(text)

    else:

        normalized = normalize_text(text)

        if not normalized:
            raise ValueError("Ciphertext must contain English letters.")

        if len(normalized) % 2 != 0:
            raise ValueError(
                "Ciphertext must contain an even number of letters."
            )

        digraphs = [
            normalized[index:index + 2]
            for index in range(0, len(normalized), 2)
        ]

        preparation_steps = []

    transformed_pairs = []
    execution_steps = []

    for index, pair in enumerate(digraphs):

        result = transform_pair(
            pair,
            positions,
            matrix,
            operation
        )

        transformed_pairs.append(result["output_pair"])

        if show_steps:

            execution_steps.append({
                "step": index + 1,
                **result
            })

    output_text = "".join(transformed_pairs)

    return {
        "input_text": text,
        "normalized_text": normalize_text(text),
        "operation": operation,
        "key": normalize_text(key),
        "matrix": matrix,
        "digraphs": digraphs,
        "preparation_steps": preparation_steps if show_steps else [],
        "execution_steps": execution_steps,
        "output_text": output_text,
        "total_digraphs": len(digraphs),
        "educational_note": (
            "Playfair is a classical educational cipher and is not "
            "suitable for protecting real-world information."
        )
    }