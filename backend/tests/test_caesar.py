from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_caesar_encryption():

    response = client.post(
        "/api/v1/algorithms/caesar/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "HELLO",
                "key": 3
            },
            "options": {
                "show_steps": True
            }
        }
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data["output_text"] == "KHOOR"


def test_caesar_decryption():

    response = client.post(
        "/api/v1/algorithms/caesar/execute",
        json={
            "operation": "decrypt",
            "inputs": {
                "text": "KHOOR",
                "key": 3
            }
        }
    )

    assert response.status_code == 200

    data = response.json()["data"]

    assert data["output_text"] == "HELLO"


def test_caesar_preserves_spaces_and_punctuation():

    response = client.post(
        "/api/v1/algorithms/caesar/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "Hello, World!",
                "key": 3
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "Khoor, Zruog!"


def test_caesar_large_key():

    response = client.post(
        "/api/v1/algorithms/caesar/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "ABC",
                "key": 29
            }
        }
    )

    assert response.status_code == 200

    assert response.json()["data"]["output_text"] == "DEF"


def test_caesar_invalid_key():

    response = client.post(
        "/api/v1/algorithms/caesar/execute",
        json={
            "operation": "encrypt",
            "inputs": {
                "text": "HELLO",
                "key": "invalid"
            }
        }
    )

    assert response.status_code == 422