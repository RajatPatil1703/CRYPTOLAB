from typing import Any


def normalize_text(text: str) -> str:
    """Normalize input to uppercase English letters."""

    if not isinstance(text, str):
        raise ValueError("Text must be a string.")

    return "".join(
        char
        for char in text.upper()
        if char.isascii() and char.isalpha()
    )


def validate_permutation_key(key: list[int]) -> int:
    """Validate a permutation key containing positions 1 through n."""

    if not isinstance(key, list):
        raise ValueError("Permutation key must be a list.")

    size = len(key)

    if size < 2:
        raise ValueError("Permutation key must contain at least two positions.")

    if any(
        isinstance(value, bool) or not isinstance(value, int)
        for value in key
    ):
        raise ValueError("All permutation key values must be integers.")

    if sorted(key) != list(range(1, size + 1)):
        raise ValueError(
            "Invalid permutation key. It must contain every integer "
            "from 1 to the key length exactly once."
        )

    return size


def inverse_permutation(key: list[int]) -> list[int]:
    """Calculate the inverse permutation."""

    size = validate_permutation_key(key)

    inverse = [0] * size

    for output_position, input_position in enumerate(key):
        inverse[input_position - 1] = output_position + 1

    return inverse


def prepare_blocks(
    text: str,
    block_size: int
) -> tuple[str, list[str], dict[str, Any]]:
    """Normalize text and divide it into equally sized blocks."""

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

    preparation = {
        "normalized_text": normalized,
        "padding_character": "X",
        "padding_count": padding_count,
        "padded_text": padded_text
    }

    return padded_text, blocks, preparation


def rearrange_block(
    block: str,
    key: list[int]
) -> tuple[str, list[dict[str, Any]]]:
    """Rearrange characters according to a 1-based permutation key."""

    output = []
    calculations = []

    for output_position, input_position in enumerate(key, start=1):

        character = block[input_position - 1]

        output.append(character)

        calculations.append({
            "output_position": output_position,
            "input_position": input_position,
            "character": character
        })

    return "".join(output), calculations


def transposition_cipher(
    text: str,
    key: list[int],
    operation: str,
    show_steps: bool = True
) -> dict[str, Any]:
    """Execute block-based permutation transposition encryption/decryption."""

    if operation not in ("encrypt", "decrypt"):
        raise ValueError("Operation must be encrypt or decrypt.")

    block_size = validate_permutation_key(key)

    normalized_key = list(key)

    if operation == "encrypt":

        effective_key = normalized_key

        _, blocks, preparation = prepare_blocks(
            text,
            block_size
        )

        inverse_key = None

    else:

        normalized = normalize_text(text)

        if not normalized:
            raise ValueError("Ciphertext must contain English letters.")

        if len(normalized) % block_size != 0:
            raise ValueError(
                f"Ciphertext length must be divisible by {block_size}."
            )

        effective_key = inverse_permutation(normalized_key)

        inverse_key = effective_key

        blocks = [
            normalized[index:index + block_size]
            for index in range(0, len(normalized), block_size)
        ]

        preparation = {
            "normalized_text": normalized,
            "padding_character": None,
            "padding_count": 0,
            "padded_text": normalized
        }

    output_blocks = []
    execution_steps = []

    for index, block in enumerate(blocks):

        output_block, calculations = rearrange_block(
            block,
            effective_key
        )

        output_blocks.append(output_block)

        if show_steps:
            execution_steps.append({
                "step": index + 1,
                "input_block": block,
                "key": effective_key,
                "calculations": calculations,
                "output_block": output_block
            })

    output_text = "".join(output_blocks)

    return {
        "input_text": text,
        "operation": operation,
        "block_size": block_size,
        "normalized_key": normalized_key,
        "inverse_key": inverse_key,
        "effective_key": effective_key,
        "preparation": preparation,
        "blocks": blocks,
        "execution_steps": execution_steps,
        "output_text": output_text,
        "key_convention": (
            "Each key entry specifies the 1-based input position "
            "selected for the corresponding output position."
        ),
        "educational_note": (
            "Transposition Cipher rearranges character positions "
            "without changing the characters themselves. "
            "This educational implementation is not suitable "
            "for protecting real-world information."
        )
    }