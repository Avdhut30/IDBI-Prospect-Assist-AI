import pandas as pd
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[3] / "dataset" / "uploaded_customers.csv"


def save_uploaded_customers(file):
    df = pd.read_csv(file.file)

    required_columns = [
        "customer_id",
        "age",
        "city",
        "employment_type",
        "account_type",
        "monthly_income",
        "monthly_credit",
        "monthly_debit",
        "monthly_expense",
        "avg_monthly_balance",
        "existing_emi",
        "foir",
        "savings_ratio",
        "cibil_score",
        "salary_consistency",
        "account_tenure_months",
        "digital_activity_score",
        "credit_card_spend",
        "rent_payment",
        "property_related_transactions",
        "vehicle_related_spend",
        "loan_history",
    ]

    missing = [col for col in required_columns if col not in df.columns]

    if missing:
        return {
            "success": False,
            "message": "CSV validation failed",
            "missing_columns": missing,
        }

    df.to_csv(DATA_PATH, index=False)

    return {
        "success": True,
        "message": "CSV uploaded and validated successfully",
        "rows_uploaded": len(df),
        "columns_detected": list(df.columns),
    }
