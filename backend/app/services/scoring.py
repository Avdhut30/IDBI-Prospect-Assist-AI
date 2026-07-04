import joblib
import pandas as pd
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parents[3] / "models"

lead_model = joblib.load(MODEL_DIR / "lead_model.pkl")
income_model = joblib.load(MODEL_DIR / "income_model.pkl")
city_encoder = joblib.load(MODEL_DIR / "city_encoder.pkl")


def predict_customer_score(customer: dict):
    city_encoded = city_encoder.transform([customer["city"]])[0]

    features = pd.DataFrame(
        [
            {
                "age": customer["age"],
                "city_encoded": city_encoded,
                "monthly_income": customer["monthly_income"],
                "avg_monthly_balance": customer["avg_monthly_balance"],
                "monthly_expense": customer["monthly_expense"],
                "existing_emi": customer["existing_emi"],
                "cibil_score": customer["cibil_score"],
                "salary_consistency": customer["salary_consistency"],
                "digital_activity_score": customer["digital_activity_score"],
                "credit_card_spend": customer["credit_card_spend"],
                "investment_amount": customer["investment_amount"],
                "rent_payment": customer["rent_payment"],
                "loan_history": customer["loan_history"],
                "foir": customer["foir"],
                "savings_ratio": customer["savings_ratio"],
            }
        ]
    )

    probability = lead_model.predict_proba(features)[0][1]
    lead_score = round(probability * 100, 2)

    income_features = pd.DataFrame(
        [
            {
                "avg_monthly_balance": customer["avg_monthly_balance"],
                "monthly_expense": customer["monthly_expense"],
                "existing_emi": customer["existing_emi"],
                "credit_card_spend": customer["credit_card_spend"],
                "investment_amount": customer["investment_amount"],
                "digital_activity_score": customer["digital_activity_score"],
                "salary_consistency": customer["salary_consistency"],
            }
        ]
    )

    estimated_income = round(income_model.predict(income_features)[0], 2)

    disposable_income = (
        customer["monthly_income"]
        - customer["monthly_expense"]
        - customer["existing_emi"]
    )

    safe_emi = round(disposable_income * 0.4, 2)

    if customer["foir"] < 0.35 and customer["cibil_score"] >= 700:
        risk_level = "Low"
    elif customer["foir"] < 0.5 and customer["cibil_score"] >= 650:
        risk_level = "Medium"
    else:
        risk_level = "High"

    if customer["rent_payment"] == 1 and customer["monthly_income"] > 70000:
        recommended_loan = "Home Loan"
    elif customer["credit_card_spend"] > customer["monthly_income"] * 0.35:
        recommended_loan = "Personal Loan"
    elif customer["monthly_income"] > 40000 and customer["digital_activity_score"] > 50:
        recommended_loan = "Auto Loan"
    else:
        recommended_loan = "Mortgage Loan"

    return {
        "lead_score": lead_score,
        "estimated_income": estimated_income,
        "disposable_income": disposable_income,
        "safe_new_emi": safe_emi,
        "risk_level": risk_level,
        "recommended_loan": recommended_loan,
    }
