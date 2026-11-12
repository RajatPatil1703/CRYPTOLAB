from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

KEY = "QWERTYUIOPASDFGHJKLZXCVBNM"


def test_monoalphabetic_encryption():

    response = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "ABC",
                "key": KEY
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "QWE"


def test_monoalphabetic_decryption():

    response = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "decrypt",
            "inputs": {
                "text": "QWE",
                "key": KEY
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "ABC"


def test_case_preservation():

    response = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "AbC",
                "key": KEY
            }
        }
    )

    assert response.json()["data"]["output_text"] == "QwE"


def test_special_character_preservation():

    response = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "Hello, World! 123",
                "key": KEY
            }
        }
    )

    assert response.json()["data"]["output_text"] == "Itssg, Vgksr! 123"


def test_invalid_key_length():

    response = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "HELLO",
                "key": "ABCDE"
            }
        }
    )

    assert response.status_code == 422


def test_duplicate_key_characters():

    response = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "HELLO",
                "key": "AAAAAAAAAAAAAAAAAAAAAAAAAA"
            }
        }
    )

    assert response.status_code == 422


def test_round_trip():

    plaintext = "CRYPTOLAB IS AWESOME!"

    encrypted = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": plaintext,
                "key": KEY
            }
        }
    )

    ciphertext = encrypted.json()["data"]["output_text"]

    decrypted = client.post(
        "/api/v1/algorithms/monoalphabetic/execute",
        json={
            "operation": "decrypt",
            "inputs": {
                "text": ciphertext,
                "key": KEY
            }
        }
    )

    assert decrypted.json()["data"]["output_text"] == plaintext