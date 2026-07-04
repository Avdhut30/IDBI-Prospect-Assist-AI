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


def test_ai_chat_explains_customer() -> None:
    response = client.post(
        "/ai/chat",
        json={"question": "Explain customer CUST00001"},
    )

    assert response.status_code == 200
    assert response.json()["intent"] == "customer_explanation"
    assert "Customer CUST00001" in response.json()["answer"]


def test_ai_chat_returns_home_loan_prospects() -> None:
    response = client.post(
        "/ai/chat",
        json={"question": "Show top Home Loan prospects"},
    )

    assert response.status_code == 200
    assert response.json()["intent"] == "home_loan_prospects"
    assert "Home Loan prospects" in response.json()["answer"]


def test_ai_chat_requires_question() -> None:
    response = client.post("/ai/chat", json={})

    assert response.status_code == 422
