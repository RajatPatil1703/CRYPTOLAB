from math import gcd
from typing import Any


MODULUS = 26
ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def normalize_text(text: str) -> str:
    """Normalize input to uppercase English letters."""

    if not isinstance(text, str):
        raise ValueError("Text must be a string.")

    return "".join(
        char
        for char in text.upper()
        if char.isascii() and char.isalpha()
    )


def validate_key_matrix(matrix: list[list[int]]) -> int:
    """Validate a 2x2 or 3x3 Hill Cipher key matrix."""

    if not isinstance(matrix, list):
        raise ValueError("Key matrix must be a list.")

    size = len(matrix)

    if size not in (2, 3):
        raise ValueError("Only 2x2 and 3x3 key matrices are supported.")

    for row in matrix:
        if not isinstance(row, list) or len(row) != size:
            raise ValueError("Key matrix must be square.")

        for value in row:
            if isinstance(value, bool) or not isinstance(value, int):
                raise ValueError("Matrix values must be integers.")

    return size


def determinant(matrix: list[list[int]]) -> int:
    """Calculate the determinant recursively."""

    size = len(matrix)

    if size == 1:
        return matrix[0][0]

    if size == 2:
        return (
            matrix[0][0] * matrix[1][1]
            - matrix[0][1] * matrix[1][0]
        )

    result = 0

    for column in range(size):
        minor = [
            [
                matrix[row][col]
                for col in range(size)
                if col != column
            ]
            for row in range(1, size)
        ]

        result += (
            (-1) ** column
            * matrix[0][column]
            * determinant(minor)
        )

    return result


def modular_inverse(value: int, modulus: int = MODULUS) -> int:
    """Calculate modular multiplicative inverse."""

    value %= modulus

    for candidate in range(1, modulus):

        if (value * candidate) % modulus == 1:
            return candidate

    raise ValueError(
        f"No modular inverse exists for {value} modulo {modulus}."
    )


def matrix_minor(
    matrix: list[list[int]],
    row_to_remove: int,
    col_to_remove: int
) -> list[list[int]]:

    return [
        [
            matrix[row][col]
            for col in range(len(matrix))
            if col != col_to_remove
        ]
        for row in range(len(matrix))
        if row != row_to_remove
    ]


def inverse_matrix_mod26(
    matrix: list[list[int]]
) -> tuple[list[list[int]], dict[str, Any]]:
    """Calculate the inverse of a matrix modulo 26."""

    size = validate_key_matrix(matrix)

    det = determinant(matrix)
    det_mod = det % MODULUS

    if gcd(det_mod, MODULUS) != 1:
        raise ValueError(
            "Invalid Hill Cipher key: determinant must be "
            "coprime with 26."
        )

    det_inverse = modular_inverse(det_mod)

    cofactor_matrix = []

    for row in range(size):

        cofactor_row = []

        for col in range(size):

            minor = matrix_minor(matrix, row, col)

            cofactor = (
                (-1) ** (row + col)
                * determinant(minor)
            )

            cofactor_row.append(cofactor)

        cofactor_matrix.append(cofactor_row)

    # Transpose cofactor matrix to obtain adjugate.
    adjugate = [
        [
            cofactor_matrix[col][row]
            for col in range(size)
        ]
        for row in range(size)
    ]

    inverse = [
        [
            (det_inverse * adjugate[row][col]) % MODULUS
            for col in range(size)
        ]
        for row in range(size)
    ]

    details = {
        "determinant": det,
        "determinant_mod_26": det_mod,
        "determinant_inverse_mod_26": det_inverse,
        "cofactor_matrix": cofactor_matrix,
        "adjugate_matrix": adjugate,
        "inverse_matrix": inverse
    }

    return inverse, details


def prepare_blocks(
    text: str,
    block_size: int
) -> tuple[str, list[str], dict[str, Any]]:
    """Prepare plaintext/ciphertext into equal-sized blocks."""

    normalized = normalize_text(text)

    if not normalized:
        raise ValueError("Text must contain at least one English letter.")

    padding_count = (
        block_size - len(normalized) % block_size
    ) % block_size

    padded_text = normalized + ("X" * padding_count)

    blocks = [
        padded_text[index:index + block_size]
        for index in range(0, len(padded_text), block_size)
    ]

    details = {
        "normalized_text": normalized,
        "padding_character": "X",
        "padding_count": padding_count,
        "padded_text": padded_text
    }

    return padded_text, blocks, details


def text_to_vector(text: str) -> list[int]:
    return [ord(char) - ord("A") for char in text]


def vector_to_text(vector: list[int]) -> str:
    return "".join(
        chr((value % MODULUS) + ord("A"))
        for value in vector
    )


def matrix_vector_multiply(
    matrix: list[list[int]],
    vector: list[int]
) -> tuple[list[int], list[dict[str, Any]]]:

    result = []
    calculations = []

    for row_index, row in enumerate(matrix):

        products = [
            row[col] * vector[col]
            for col in range(len(vector))
        ]

        total = sum(products)
        reduced = total % MODULUS

        result.append(reduced)

        calculations.append({
            "row": row_index + 1,
            "multiplications": products,
            "sum": total,
            "modulo_result": reduced
        })

    return result, calculations


def hill_cipher(
    text: str,
    key_matrix: list[list[int]],
    operation: str,
    show_steps: bool = True
) -> dict[str, Any]:

    if operation not in ("encrypt", "decrypt"):
        raise ValueError("Operation must be encrypt or decrypt.")

    size = validate_key_matrix(key_matrix)

    normalized_key = [
        [value % MODULUS for value in row]
        for row in key_matrix
    ]

    key_determinant = determinant(normalized_key)

    if gcd(key_determinant % MODULUS, MODULUS) != 1:
        raise ValueError(
            "Invalid key matrix. Its determinant must be coprime with 26."
        )

    if operation == "encrypt":

        effective_matrix = normalized_key

        padded_text, blocks, preparation = prepare_blocks(
            text,
            size
        )

        inverse_details = None

    else:

        normalized_text = normalize_text(text)

        if not normalized_text:
            raise ValueError("Ciphertext must contain English letters.")

        if len(normalized_text) % size != 0:
            raise ValueError(
                f"Ciphertext length must be divisible by {size}."
            )

        inverse_matrix, inverse_details = inverse_matrix_mod26(
            normalized_key
        )

        effective_matrix = inverse_matrix
        padded_text = normalized_text

        blocks = [
            padded_text[index:index + size]
            for index in range(0, len(padded_text), size)
        ]

        preparation = {
            "normalized_text": normalized_text,
            "padding_character": None,
            "padding_count": 0,
            "padded_text": padded_text
        }

    execution_steps = []
    output_blocks = []

    for index, block in enumerate(blocks):

        input_vector = text_to_vector(block)

        output_vector, calculations = matrix_vector_multiply(
            effective_matrix,
            input_vector
        )

        output_block = vector_to_text(output_vector)

        output_blocks.append(output_block)

        if show_steps:

            execution_steps.append({
                "step": index + 1,
                "input_block": block,
                "input_vector": input_vector,
                "matrix": effective_matrix,
                "calculations": calculations,
                "output_vector": output_vector,
                "output_block": output_block
            })

    output_text = "".join(output_blocks)

    return {
        "input_text": text,
        "operation": operation,
        "block_size": size,
        "normalized_key_matrix": normalized_key,
        "determinant": key_determinant,
        "effective_matrix": effective_matrix,
        "inverse_details": inverse_details,
        "preparation": preparation,
        "blocks": blocks,
        "execution_steps": execution_steps,
        "output_text": output_text,
        "educational_note": (
            "Hill Cipher is a classical educational cipher and "
            "is not suitable for protecting real-world information."
        )
    }