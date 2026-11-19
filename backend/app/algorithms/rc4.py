"""Educational RC4 implementation. RC4 is obsolete and cryptographically unsafe."""

MAX_BYTES = 32768
MAX_STEPS = 256


def rc4_cipher(text: str, key: str, operation: str, show_steps: bool = True) -> dict:
    if operation not in ("encrypt", "decrypt"):
        raise ValueError("Operation must be encrypt or decrypt.")
    key_bytes = key.encode("utf-8")
    if not 1 <= len(key_bytes) <= 256:
        raise ValueError("Key must contain 1 to 256 UTF-8 bytes.")
    if operation == "encrypt":
        data = text.encode("utf-8")
    else:
        compact = "".join(text.split())
        if not compact or len(compact) % 2 or any(c not in "0123456789abcdefABCDEF" for c in compact):
            raise ValueError("Ciphertext must be hexadecimal with two digits per byte.")
        data = bytes.fromhex(compact)
    if not 1 <= len(data) <= MAX_BYTES:
        raise ValueError(f"Input must contain 1 to {MAX_BYTES} bytes.")

    # Key scheduling algorithm (KSA).
    state = list(range(256))
    j = 0
    for i in range(256):
        j = (j + state[i] + key_bytes[i % len(key_bytes)]) % 256
        state[i], state[j] = state[j], state[i]

    # Pseudo-random generation algorithm (PRGA), starting at byte offset zero.
    i = j = 0
    output = bytearray()
    steps = []
    for position, value in enumerate(data):
        i = (i + 1) % 256
        j = (j + state[i]) % 256
        state[i], state[j] = state[j], state[i]
        stream_byte = state[(state[i] + state[j]) % 256]
        transformed = value ^ stream_byte
        output.append(transformed)
        if show_steps and position < MAX_STEPS:
            steps.append({
                "step": position + 1,
                "input_hex": f"{value:02X}",
                "keystream_hex": f"{stream_byte:02X}",
                "output_hex": f"{transformed:02X}",
            })
    output_hex = output.hex().upper()
    if operation == "decrypt":
        try:
            output_text = output.decode("utf-8")
        except UnicodeDecodeError as exc:
            raise ValueError("Decrypted bytes are not valid UTF-8 text. Check the key and ciphertext.") from exc
    else:
        output_text = output_hex
    return {
        "operation": operation,
        "output_text": output_text,
        "output_hex": output_hex,
        "output_encoding": "hex" if operation == "encrypt" else "utf-8",
        "byte_count": len(data),
        "execution_steps": steps,
        "steps_truncated": show_steps and len(data) > MAX_STEPS,
        "educational_note": "RC4 is obsolete and unsafe for real-world security. This demo uses UTF-8 keys and no keystream drop.",
    }
