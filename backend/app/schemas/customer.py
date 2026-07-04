from pydantic import BaseModel


class CustomerInput(BaseModel):
    age: int
    city: str
    monthly_income: float
    avg_monthly_balance: float
    monthly_expense: float
    existing_emi: float
    cibil_score: int
    salary_consistency: float
    digital_activity_score: int
    credit_card_spend: float
    investment_amount: float
    rent_payment: int
    loan_history: int
    foir: float
    savings_ratio: float
