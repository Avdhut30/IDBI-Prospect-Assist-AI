from pathlib import Path

import pandas as pd
from pandas.errors import EmptyDataError, ParserError

from .customer_data import UPLOADED_DATA_PATH
from .scoring import predict_customer_scores

DATA_PATH = UPLOADED_DATA_PATH

REQUIRED_COLUMNS = [
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

NUMERIC_COLUMNS = [
    "age",
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
    "investment_amount",
    "rent_payment",
    "property_related_transactions",
    "vehicle_related_spend",
]

LOAN_HISTORY_VALUES = {
    "limited": 0,
    "average": 1,
    "good": 2,
    "excellent": 3,
}


def _failure(message, **details):
    return {
        "success": False,
        "message": message,
        **details,
    }


def _normalize_loan_history(series):
    numeric_values = pd.to_numeric(series, errors="coerce")
    text_values = series.astype(str).str.strip().str.lower().map(LOAN_HISTORY_VALUES)
    return numeric_values.fillna(text_values)


def _prepare_uploaded_customers(df):
    df = df.copy()
    df.columns = [str(column).strip() for column in df.columns]

    missing = [column for column in REQUIRED_COLUMNS if column not in df.columns]
    if missing:
        return None, _failure(
            "CSV validation failed",
            missing_columns=missing,
        )

    if df.empty:
        return None, _failure("CSV validation failed: no customer rows found")

    if "investment_amount" not in df.columns:
        df["investment_amount"] = 0

    for column in ["customer_id", "city", "employment_type", "account_type"]:
        df[column] = df[column].astype("string").str.strip()

    if df["customer_id"].isna().any() or (df["customer_id"] == "").any():
        return None, _failure("CSV validation failed: customer_id cannot be blank")

    duplicate_ids = (
        df.loc[df["customer_id"].duplicated(), "customer_id"].drop_duplicates().tolist()
    )
    if duplicate_ids:
        return None, _failure(
            "CSV validation failed: duplicate customer IDs",
            duplicate_customer_ids=duplicate_ids[:20],
        )

    for column in NUMERIC_COLUMNS:
        original = df[column]
        df[column] = pd.to_numeric(original, errors="coerce")
        invalid_rows = df.index[df[column].isna()].tolist()
        if invalid_rows:
            return None, _failure(
                f"CSV validation failed: {column} must be numeric",
                invalid_column=column,
                invalid_rows=[row + 2 for row in invalid_rows[:20]],
            )

    df["loan_history"] = _normalize_loan_history(df["loan_history"])
    invalid_loan_history = df.index[df["loan_history"].isna()].tolist()
    if invalid_loan_history:
        return None, _failure(
            "CSV validation failed: loan_history must be numeric or one of "
            "Limited, Average, Good, Excellent",
            invalid_column="loan_history",
            invalid_rows=[row + 2 for row in invalid_loan_history[:20]],
        )

    df["loan_history"] = df["loan_history"].astype(int)
    df["rent_payment"] = (df["rent_payment"] > 0).astype(int)
    df["property_related_transactions"] = (
        df["property_related_transactions"] > 0
    ).astype(int)

    try:
        predictions = predict_customer_scores(df)
    except Exception as exc:
        return None, _failure(
            "CSV scoring failed",
            detail=str(exc),
        )

    df["prospect_score"] = [
        float(prediction["lead_score"]) for prediction in predictions
    ]
    df["recommended_loan"] = [
        prediction["recommended_loan"] for prediction in predictions
    ]
    df["loan_accepted"] = (df["prospect_score"] >= 50).astype(int)

    return df, None


def save_uploaded_customers(file):
    try:
        uploaded_df = pd.read_csv(file.file)
    except (EmptyDataError, ParserError, UnicodeDecodeError) as exc:
        return _failure("Unable to read CSV file", detail=str(exc))

    processed_df, error = _prepare_uploaded_customers(uploaded_df)
    if error:
        return error

    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = Path(f"{DATA_PATH}.tmp")
    processed_df.to_csv(temporary_path, index=False)
    temporary_path.replace(DATA_PATH)

    return {
        "success": True,
        "message": "CSV uploaded, scored, and activated successfully",
        "rows_uploaded": int(len(processed_df)),
        "prospects_identified": int(processed_df["loan_accepted"].sum()),
        "high_priority_prospects": int((processed_df["prospect_score"] >= 75).sum()),
        "columns_detected": list(processed_df.columns),
        "active_data_source": DATA_PATH.name,
    }
