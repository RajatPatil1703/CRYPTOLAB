from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_algorithms():
    response = client.get("/api/v1/algorithms")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert isinstance(body["data"], list)
    assert any(item["slug"] == "caesar" for item in body["data"])


def test_filter_algorithms_by_category():
    response = client.get("/api/v1/algorithms?category=classical")
    assert response.status_code == 200
    assert all(item["category"] == "classical" for item in response.json()["data"])


def test_get_existing_algorithm():
    response = client.get("/api/v1/algorithms/caesar")
    assert response.status_code == 200
    assert response.json()["data"]["name"] == "Caesar Cipher"


def test_unknown_algorithm_returns_404():
    response = client.get("/api/v1/algorithms/not-real")
    assert response.status_code == 404
