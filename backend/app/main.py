from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .ai.copilot import run_copilot
from .schemas.chat import ChatRequest
from .schemas.what_if import WhatIfRequest
from .schemas.customer import CustomerInput
from .services.analytics import get_dashboard_summary
from .services.executive_brief import generate_executive_brief
from .services.intelligence import calculate_prospect_intelligence
from .services.upload_service import save_uploaded_customers
from .services.what_if import run_what_if_analysis

from .services.recommendation import recommend_loan_product
from .services.explanation import generate_customer_explanation
from .services.report_service import generate_customer_pdf
from .services.timeline_service import generate_customer_timeline
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.get("/executive-brief")
def executive_brief():
    return generate_executive_brief()


@app.post("/what-if")
def what_if(request: WhatIfRequest):
    return run_what_if_analysis(
        request.customer_id,
        request.income_change,
        request.emi_change
    )


@app.post("/upload-customers")
def upload_customers(file: UploadFile = File(...)):
    return save_uploaded_customers(file)


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


@app.get("/customers/{customer_id}/report")
def customer_report(customer_id: str):
    file_path = generate_customer_pdf(customer_id)

    if file_path is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    return FileResponse(
        path=file_path,
        filename=f"{customer_id}_report.pdf",
        media_type="application/pdf"
    )


@app.get("/customers/{customer_id}/timeline")
def customer_timeline(customer_id: str):
    timeline = generate_customer_timeline(customer_id)

    if timeline is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    return timeline


@app.post("/ai/chat")
def ai_chat(request: ChatRequest):
    return run_copilot(request.question)
