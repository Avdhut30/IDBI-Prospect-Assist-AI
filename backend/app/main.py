from fastapi import FastAPI, HTTPException

from .schemas.customer import CustomerInput
from .services.analytics import get_dashboard_summary
from app.services.intelligence import calculate_prospect_intelligence

from app.services.recommendation import recommend_loan_product
from app.services.explanation import generate_customer_explanation
from .services.customer_data import (
    get_all_customers,
    get_customer_by_id,
    get_top_prospects,
)
from .services.scoring import predict_customer_score

app = FastAPI(
    title="Prospect Assist AI",
    version="1.0.0",
    description="AI-powered Loan Prospect Identification System",
)


@app.get("/")
def root():
    return {"message": "Welcome to Prospect Assist AI"}


@app.get("/health")
def health():
    return {"status": "Healthy"}


@app.post("/predict")
def predict(customer: CustomerInput):
    return predict_customer_score(customer.model_dump())


@app.get("/customers")
def customers(limit: int = 100):
    return get_all_customers(limit)


@app.get("/top-prospects")
def top_prospects(limit: int = 50):
    return get_top_prospects(limit)


@app.get("/customers/{customer_id}")
def customer_detail(customer_id: str):
    customer = get_customer_by_id(customer_id)

    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    prediction = predict_customer_score(customer)

    return {"customer": customer, "prediction": prediction}


@app.get("/dashboard")
def dashboard():
    return get_dashboard_summary()


@app.get("/customers/{customer_id}/intelligence")
def customer_intelligence(customer_id: str):
    customer = get_customer_by_id(customer_id)

    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    return calculate_prospect_intelligence(customer)


@app.get("/customers/{customer_id}/recommendation")
def customer_recommendation(customer_id: str):
    customer = get_customer_by_id(customer_id)

    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    intelligence = calculate_prospect_intelligence(customer)
    return recommend_loan_product(customer, intelligence)


@app.get("/customers/{customer_id}/explanation")
def customer_explanation(customer_id: str):
    customer = get_customer_by_id(customer_id)

    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    intelligence = calculate_prospect_intelligence(customer)
    recommendation = recommend_loan_product(customer, intelligence)

    return generate_customer_explanation(customer, intelligence, recommendation)
