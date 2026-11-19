import pytest
from fastapi.testclient import TestClient

from app.algorithms.classical.rc4 import rc4_cipher
from app.main import app

client = TestClient(app)


def execute(text, key="Key", operation="encrypt", show_steps=True):
    return client.post("/api/v1/algorithms/rc4/execute", json={
        "operation": operation, "inputs": {"text": text, "key": key},
        "options": {"show_steps": show_steps},
    })


def test_rfc6229_keystream_vector():
    # RFC 6229 section 2, 40-bit key, stream offsets 0 and 16.
    result = rc4_cipher("\0" * 32, "\x01\x02\x03\x04\x05", "encrypt")
    assert result["output_hex"] == (
        "B2396305F03DC027CCC3524A0A1118A8"
        "6982944F18FC82D589C403A47A0D0919"
    )


def test_known_plaintext_vector():
    response = execute("Plaintext")
    assert response.status_code == 200
    assert response.json()["data"]["output_text"] == "BBF316E8D940AF0AD3"


@pytest.mark.parametrize("text", ["Hello, world!", "नमस्ते 🔐", "  spaces\nremain  "])
def test_utf8_round_trip(text):
    encrypted = execute(text).json()["data"]["output_text"]
    response = execute(encrypted, operation="decrypt")
    assert response.status_code == 200
    assert response.json()["data"]["output_text"] == text


def test_decryption_accepts_spaced_hex():
    assert execute("bb f3 16 e8 d9 40 af 0a d3", operation="decrypt").json()["data"]["output_text"] == "Plaintext"


@pytest.mark.parametrize("text,key,operation", [
    ("abc", "Key", "decrypt"), ("GG", "Key", "decrypt"),
    (" ", "Key", "decrypt"), ("text", "", "encrypt"),
    ("text", "é" * 129, "encrypt"), ("00", "Key", "decrypt"),
    ("x" * 32769, "Key", "encrypt"),
])
def test_invalid_inputs(text, key, operation):
    response = execute(text, key, operation)
    assert response.status_code == 422
    assert response.json()["success"] is False
    assert isinstance(response.json()["error"]["message"], str)


def test_steps_are_optional_and_bounded():
    assert execute("Plaintext", show_steps=False).json()["data"]["execution_steps"] == []
    result = execute("x" * 300).json()["data"]
    assert result["byte_count"] == 300
    assert len(result["execution_steps"]) == 256
    assert result["steps_truncated"] is True


def test_catalog_marks_rc4_available():
    assert client.get("/api/v1/algorithms/rc4").json()["data"]["available"] is True
