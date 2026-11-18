from fastapi.testclient import TestClient

from app.main import app
from app.algorithms.classical.playfair import (
    generate_key_matrix,
    prepare_digraphs
)

client = TestClient(app)

KEY = "MONARCHY"


def test_key_matrix_generation():

    matrix = generate_key_matrix(KEY)

    assert len(matrix) == 5

    assert all(len(row) == 5 for row in matrix)

    assert matrix[0] == ["M", "O", "N", "A", "R"]

    flattened = "".join(
        character
        for row in matrix
        for character in row
    )

    assert len(set(flattened)) == 25

    assert "J" not in flattened


def test_standard_encryption():

    response = client.post(
        "/api/v1/algorithms/playfair/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "INSTRUMENTS",
                "key": KEY
            },
            "options": {
                "show_steps": True
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "GATLMZCLRQXA"


def test_standard_decryption():

    response = client.post(
        "/api/v1/algorithms/playfair/execute",
        json={
            "operation": "decrypt",
            "inputs": {
                "text": "GATLMZCLRQXA",
                "key": KEY
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "INSTRUMENTSX"


def test_i_and_j_combination():

    matrix = generate_key_matrix(KEY)

    flattened = "".join(
        character
        for row in matrix
        for character in row
    )

    assert "I" in flattened

    assert "J" not in flattened


def test_duplicate_letter_handling():

    digraphs, steps = prepare_digraphs("BALLOON")

    assert digraphs == ["BA", "LX", "LO", "ON"]

    assert any(
        step["type"] == "duplicate_letter"
        for step in steps
    )


def test_odd_length_padding():

    digraphs, steps = prepare_digraphs("HELLO")

    assert digraphs == ["HE", "LX", "LO"]

    assert not any(
        step["type"] == "padding"
        for step in steps
    )


def test_repeated_x_handling():

    digraphs, _ = prepare_digraphs("XX")

    assert digraphs == ["XQ", "XQ"]


def test_empty_plaintext():

    response = client.post(
        "/api/v1/algorithms/playfair/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "",
                "key": KEY
            }
        }
    )

    assert response.status_code == 422


def test_invalid_odd_ciphertext():

    response = client.post(
        "/api/v1/algorithms/playfair/execute",
        json={
            "operation": "decrypt",
            "inputs": {
                "text": "ABC",
                "key": KEY
            }
        }
    )

    assert response.status_code == 422


def test_missing_key():

    response = client.post(
        "/api/v1/algorithms/playfair/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "HELLO"
            }
        }
    )

    assert response.status_code == 422