from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "dataset" / "synthetic_customers.csv"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_DIR.mkdir(exist_ok=True)

df = pd.read_csv(DATA_PATH)

city_encoder = LabelEncoder()
df["city_encoded"] = city_encoder.fit_transform(df["city"])

lead_features = [
    "age",
    "city_encoded",
    "monthly_income",
    "avg_monthly_balance",
    "monthly_expense",
    "existing_emi",
    "cibil_score",
    "salary_consistency",
    "digital_activity_score",
    "credit_card_spend",
    "investment_amount",
    "rent_payment",
    "loan_history",
    "foir",
    "savings_ratio",
]

X_lead = df[lead_features]
y_lead = df["loan_accepted"]

Xl_train, Xl_test, yl_train, yl_test = train_test_split(
    X_lead,
    y_lead,
    test_size=0.2,
    random_state=42,
    stratify=y_lead,
)

lead_model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1,
)
lead_model.fit(Xl_train, yl_train)

lead_pred = lead_model.predict(Xl_test)
print("Lead Model Accuracy:", accuracy_score(yl_test, lead_pred))
print(classification_report(yl_test, lead_pred))

income_features = [
    "avg_monthly_balance",
    "monthly_expense",
    "existing_emi",
    "credit_card_spend",
    "investment_amount",
    "digital_activity_score",
    "salary_consistency",
]

X_income = df[income_features]
y_income = df["monthly_income"]

Xi_train, Xi_test, yi_train, yi_test = train_test_split(
    X_income,
    y_income,
    test_size=0.2,
    random_state=42,
)

income_model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    n_jobs=-1,
)
income_model.fit(Xi_train, yi_train)

income_pred = income_model.predict(Xi_test)
print("Income Model MAE:", mean_absolute_error(yi_test, income_pred))

joblib.dump(lead_model, MODEL_DIR / "lead_model.pkl")
joblib.dump(income_model, MODEL_DIR / "income_model.pkl")
joblib.dump(city_encoder, MODEL_DIR / "city_encoder.pkl")

print(f"Models saved successfully to {MODEL_DIR}.")
