import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[3] / "dataset"
DEFAULT_DATA_PATH = DATA_DIR / "synthetic_customers.csv"
UPLOADED_DATA_PATH = DATA_DIR / "uploaded_customers.csv"
PROCESSED_UPLOAD_COLUMNS = {
    "prospect_score",
    "recommended_loan",
    "loan_accepted",
}


def _sanitize_record(record):
    return {key: None if pd.isna(value) else value for key, value in record.items()}


def get_active_data_path():
    if UPLOADED_DATA_PATH.exists():
        uploaded_columns = set(pd.read_csv(UPLOADED_DATA_PATH, nrows=0).columns)
        if PROCESSED_UPLOAD_COLUMNS.issubset(uploaded_columns):
            return UPLOADED_DATA_PATH

    return DEFAULT_DATA_PATH


def load_customers():
    return pd.read_csv(get_active_data_path())


def get_all_customers(limit: int = 100):
    df = load_customers()
    return [
        _sanitize_record(record) for record in df.head(limit).to_dict(orient="records")
    ]


def get_top_prospects(limit: int = 50):
    df = load_customers()
    df = df[df["loan_accepted"] == 1]
    df = df.sort_values(
        by=["cibil_score", "monthly_income", "savings_ratio"], ascending=False
    )
    return [
        _sanitize_record(record) for record in df.head(limit).to_dict(orient="records")
    ]


def get_customer_by_id(customer_id: str):
    df = load_customers()
    customer = df[df["customer_id"] == customer_id]

    if customer.empty:
        return None

    return _sanitize_record(customer.iloc[0].to_dict())
