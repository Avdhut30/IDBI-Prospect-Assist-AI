from fastapi import FastAPI
from .schemas.customer import CustomerInput
from .services.scoring import predict_customer_score

app = FastAPI(
    title="Prospect Assist AI",
    version="1.0.0",
    description="AI-powered Loan Prospect Identification System",
)


@app.get("/")
def root():
    return {"message": "Welcome to Prospect Assist AI 🚀"}


@app.get("/health")
def health():
    return {"status": "Healthy"}


@app.post("/predict")
def predict(customer: CustomerInput):
    result = predict_customer_score(customer.model_dump())
    return result
