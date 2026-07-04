from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "Healthy"}


def test_customer_detail_includes_prediction() -> None:
    response = client.get("/customers/CUST00001")

    assert response.status_code == 200
    assert response.json()["customer"]["customer_id"] == "CUST00001"
    assert "lead_score" in response.json()["prediction"]


def test_dashboard_summary() -> None:
    response = client.get("/dashboard")

    assert response.status_code == 200
    assert response.json()["total_customers"] > 0
