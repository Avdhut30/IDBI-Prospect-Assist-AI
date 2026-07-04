import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, mean_absolute_error
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

DATA_PATH = Path("../dataset/synthetic_customers.csv")
MODEL_DIR = Path("../models")
MODEL_DIR.mkdir(exist_ok=True)

df = pd.read_csv(DATA_PATH)

categorical_cols = ["city", "employment_type", "account_type"]
encoders = {}

for col in categorical_cols:
    encoder = LabelEncoder()
    df[f"{col}_encoded"] = encoder.fit_transform(df[col])
    encoders[col] = encoder

features = [
    "age",
    "city_encoded",
    "employment_type_encoded",
    "account_type_encoded",
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
    "upi_transactions",
    "atm_withdrawals",
    "net_banking_logins",
    "mobile_banking_logins",
    "digital_activity_score",
    "credit_card_spend",
    "credit_card_utilization",
    "delayed_payment_count",
    "investment_amount",
    "fd_rd_holding",
    "insurance_owned",
    "mutual_fund_investment",
    "rent_payment",
    "property_related_transactions",
    "vehicle_related_spend",
    "education_spend",
    "medical_spend",
    "loan_history",
    "previous_personal_loan",
    "previous_home_loan",
    "previous_auto_loan",
    "previous_mortgage_loan",
]

X = df[features]
y = df["loan_accepted"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

lead_model = RandomForestClassifier(
    n_estimators=250, random_state=42, class_weight="balanced", max_depth=12
)

lead_model.fit(X_train, y_train)

y_pred = lead_model.predict(X_test)

print("Lead Model Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

income_features = [
    "monthly_credit",
    "monthly_debit",
    "avg_monthly_balance",
    "monthly_expense",
    "existing_emi",
    "credit_card_spend",
    "investment_amount",
    "mutual_fund_investment",
    "digital_activity_score",
    "salary_consistency",
    "account_tenure_months",
]

X_income = df[income_features]
y_income = df["monthly_income"]

Xi_train, Xi_test, yi_train, yi_test = train_test_split(
    X_income, y_income, test_size=0.2, random_state=42
)

income_model = RandomForestRegressor(n_estimators=250, random_state=42, max_depth=14)

income_model.fit(Xi_train, yi_train)

income_pred = income_model.predict(Xi_test)

print("Income Model MAE:", mean_absolute_error(yi_test, income_pred))

joblib.dump(lead_model, MODEL_DIR / "lead_model.pkl")
joblib.dump(income_model, MODEL_DIR / "income_model.pkl")
joblib.dump(encoders, MODEL_DIR / "encoders.pkl")
joblib.dump(features, MODEL_DIR / "feature_columns.pkl")
joblib.dump(income_features, MODEL_DIR / "income_feature_columns.pkl")

print("Advanced models saved successfully.")
