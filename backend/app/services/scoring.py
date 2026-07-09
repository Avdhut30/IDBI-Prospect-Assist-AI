import joblib
import pandas as pd
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parents[2] / "models"

lead_model = joblib.load(MODEL_DIR / "lead_model.pkl")
income_model = joblib.load(MODEL_DIR / "income_model.pkl")
city_encoder = joblib.load(MODEL_DIR / "city_encoder.pkl")


def _encode_city(city):
    return city_encoder.transform([city])[0] if city in city_encoder.classes_ else -1


def _recommend_loan(customer):
    if customer["rent_payment"] == 1 and customer["monthly_income"] > 70000:
        return "Home Loan"
    if customer["credit_card_spend"] > customer["monthly_income"] * 0.35:
        return "Personal Loan"
    if customer["monthly_income"] > 40000 and customer["digital_activity_score"] > 50:
        return "Auto Loan"
    return "Mortgage Loan"


def _build_lead_features(customers):
    features = pd.DataFrame(
        {
            "age": customers["age"],
            "city_encoded": customers["city"].map(_encode_city),
            "monthly_income": customers["monthly_income"],
            "avg_monthly_balance": customers["avg_monthly_balance"],
            "monthly_expense": customers["monthly_expense"],
            "existing_emi": customers["existing_emi"],
            "cibil_score": customers["cibil_score"],
            "salary_consistency": customers["salary_consistency"],
            "digital_activity_score": customers["digital_activity_score"],
            "credit_card_spend": customers["credit_card_spend"],
            "investment_amount": customers["investment_amount"],
            "rent_payment": customers["rent_payment"],
            "loan_history": customers["loan_history"],
            "foir": customers["foir"],
            "savings_ratio": customers["savings_ratio"],
        }
    )
    return features


def predict_customer_scores(customers):
    features = _build_lead_features(customers)
    probabilities = lead_model.predict_proba(features)[:, 1]

    return [
        {
            "lead_score": round(float(probability) * 100, 2),
            "recommended_loan": _recommend_loan(customer),
        }
        for probability, (_, customer) in zip(
            probabilities,
            customers.iterrows(),
        )
    ]


def predict_customer_score(customer: dict):
    features = _build_lead_features(pd.DataFrame([customer]))

    probability = lead_model.predict_proba(features)[0][1]
    lead_score = round(float(probability) * 100, 2)

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

    estimated_income = round(float(income_model.predict(income_features)[0]), 2)

    disposable_income = (
        customer["monthly_income"]
        - customer["monthly_expense"]
        - customer["existing_emi"]
    )

    safe_emi = round(float(disposable_income) * 0.4, 2)

    if customer["foir"] < 0.35 and customer["cibil_score"] >= 700:
        risk_level = "Low"
    elif customer["foir"] < 0.5 and customer["cibil_score"] >= 650:
        risk_level = "Medium"
    else:
        risk_level = "High"

    recommended_loan = _recommend_loan(customer)

    return {
        "lead_score": lead_score,
        "estimated_income": estimated_income,
        "disposable_income": disposable_income,
        "safe_new_emi": safe_emi,
        "risk_level": risk_level,
        "recommended_loan": recommended_loan,
    }
