import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.mark.parametrize("origin", ["http://localhost:5173", "http://127.0.0.1:5173"])
def test_local_frontend_preflight(origin):
    with TestClient(app) as client:
        response = client.options(
            "/api/v1/algorithms/caesar/execute",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


def test_untrusted_origin_is_rejected():
    with TestClient(app) as client:
        response = client.options(
            "/api/v1/algorithms/caesar/execute",
            headers={
                "Origin": "https://untrusted.example",
                "Access-Control-Request-Method": "POST",
            },
        )
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers
