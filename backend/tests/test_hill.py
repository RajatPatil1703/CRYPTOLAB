from fastapi.testclient import TestClient

from app.main import app
from app.algorithms.classical.hill import (
    hill_cipher,
    determinant,
    inverse_matrix_mod26
)


client = TestClient(app)

KEY = [
    [3, 3],
    [2, 5]
]


def test_matrix_determinant():

    assert determinant(KEY) == 9


def test_matrix_inverse():

    inverse, details = inverse_matrix_mod26(KEY)

    assert inverse == [
        [15, 17],
        [20, 9]
    ]


def test_encryption():

    result = hill_cipher(
        text="HELP",
        key_matrix=KEY,
        operation="encrypt"
    )

    assert result["output_text"] == "HIAT"


def test_decryption():

    result = hill_cipher(
        text="HIAT",
        key_matrix=KEY,
        operation="decrypt"
    )

    assert result["output_text"] == "HELP"


def test_round_trip():

    encrypted = hill_cipher(
        text="HELLO",
        key_matrix=KEY,
        operation="encrypt"
    )

    decrypted = hill_cipher(
        text=encrypted["output_text"],
        key_matrix=KEY,
        operation="decrypt"
    )

    assert decrypted["output_text"] == "HELLOX"


def test_odd_length_padding():

    result = hill_cipher(
        text="HELLO",
        key_matrix=KEY,
        operation="encrypt"
    )

    assert result["preparation"]["padded_text"] == "HELLOX"

    assert result["preparation"]["padding_count"] == 1


def test_3x3_matrix():

    matrix = [
        [6, 24, 1],
        [13, 16, 10],
        [20, 17, 15]
    ]

    result = hill_cipher(
        text="ACT",
        key_matrix=matrix,
        operation="encrypt"
    )

    assert result["output_text"] == "POH"


def test_invalid_non_invertible_key():

    invalid_key = [
        [2, 4],
        [2, 4]
    ]

    try:

        hill_cipher(
            text="HELP",
            key_matrix=invalid_key,
            operation="encrypt"
        )

        assert False, "Expected ValueError"

    except ValueError:
        pass


def test_invalid_matrix_dimensions():

    try:

        hill_cipher(
            text="HELP",
            key_matrix=[[1, 2, 3]],
            operation="encrypt"
        )

        assert False, "Expected ValueError"

    except ValueError:
        pass


def test_invalid_ciphertext_length():

    try:

        hill_cipher(
            text="ABC",
            key_matrix=KEY,
            operation="decrypt"
        )

        assert False, "Expected ValueError"

    except ValueError:
        pass


def test_api_encryption():

    response = client.post(
        "/api/v1/algorithms/hill/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "HELP",
                "key_matrix": KEY
            },
            "options": {
                "show_steps": True
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "HIAT"


def test_api_decryption():

    response = client.post(
        "/api/v1/algorithms/hill/execute",
        json={
            "operation": "decrypt",
            "inputs": {
                "text": "HIAT",
                "key_matrix": KEY
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "HELP"