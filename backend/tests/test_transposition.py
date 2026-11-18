import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.algorithms.classical.transposition import (
    transposition_cipher,
    validate_permutation_key,
    inverse_permutation,
)

client = TestClient(app)


# -------------------------------
# UNIT TESTS
# -------------------------------

def test_valid_permutation_key():
    assert validate_permutation_key([2, 4, 1, 3]) == 4


def test_inverse_permutation():
    assert inverse_permutation([2, 4, 1, 3]) == [3, 1, 4, 2]


def test_encryption():
    result = transposition_cipher(
        text="ABCD",
        key=[2, 4, 1, 3],
        operation="encrypt"
    )
    assert result["output_text"] == "BDAC"


def test_multiple_block_encryption():
    result = transposition_cipher(
        text="ABCDEFGH",
        key=[2, 4, 1, 3],
        operation="encrypt"
    )
    assert result["output_text"] == "BDACFHEG"


def test_decryption():
    result = transposition_cipher(
        text="BDAC",
        key=[2, 4, 1, 3],
        operation="decrypt"
    )
    assert result["output_text"] == "ABCD"


def test_round_trip():
    encrypted = transposition_cipher(
        text="ABCDEFGH",
        key=[2, 4, 1, 3],
        operation="encrypt"
    )

    decrypted = transposition_cipher(
        text=encrypted["output_text"],
        key=[2, 4, 1, 3],
        operation="decrypt"
    )

    assert decrypted["output_text"] == "ABCDEFGH"


def test_padding():
    result = transposition_cipher(
        text="ABCDE",
        key=[2, 4, 1, 3],
        operation="encrypt"
    )

    assert result["preparation"]["padded_text"] == "ABCDEXXX"
    assert result["output_text"] == "BDACXXEX"
    assert result["preparation"]["padding_count"] == 3


# -------------------------------
# INVALID INPUT TESTS
# -------------------------------

@pytest.mark.parametrize("key", [
    [1],
    [1, 1],
    [1, 3],
    [0, 1],
    [2, 3, 4],
])
def test_invalid_permutation_key(key):
    with pytest.raises(ValueError):
        validate_permutation_key(key)


def test_empty_text():
    with pytest.raises(ValueError):
        transposition_cipher(
            text="",
            key=[2, 1],
            operation="encrypt"
        )


def test_invalid_operation():
    with pytest.raises(ValueError):
        transposition_cipher(
            text="ABCD",
            key=[2, 1],
            operation="invalid"
        )


def test_invalid_ciphertext_length():
    with pytest.raises(ValueError):
        transposition_cipher(
            text="ABCDE",
            key=[2, 4, 1, 3],
            operation="decrypt"
        )


# -------------------------------
# API TESTS
# -------------------------------

def test_api_encryption():
    response = client.post(
        "/api/v1/algorithms/transposition/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "ABCD",
                "key": [2, 4, 1, 3]
            },
            "options": {
                "show_steps": True
            }
        }
    )

    assert response.status_code == 200
    assert response.json()["data"]["output_text"] == "BDAC"


def test_api_decryption():
    response = client.post(
        "/api/v1/algorithms/transposition/execute",
        json={
            "operation": "decrypt",
            "inputs": {
                "text": "BDAC",
                "key": [2, 4, 1, 3]
            }
        }
    )

    assert response.status_code == 200
    assert response.json()["data"]["output_text"] == "ABCD"


def test_api_invalid_key():
    response = client.post(
        "/api/v1/algorithms/transposition/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "ABCD",
                "key": [1, 1, 2, 3]
            }
        }
    )

    assert response.status_code == 422