import numpy as np 
import pandas as pd
from pathlib import Path


np.random.seed(42)
N = 10000

DATA_DIR = Path("../dataset")
DATA_DIR.mkdir(exist_ok = True)


cities = ["Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Nagpur"]
loan_types = ["Personal Loan", "Home Loan", "Auto Loan", "Mortgage Loan", "None"]

data = []

for i in range(1, N + 1):
    age = np.random.randint(22, 60)
    monthly_income = np.random.randint(18000, 250000)
    avg_monthly_balance = int(monthly_income * np.random.uniform(0.1, 1.8))
    monthly_expense = int(monthly_income * np.random.uniform(0.25, 0.85))
    existing_emi = int(monthly_income * np.random.uniform(0, 0.45))
    cibil_score = np.random.randint(580, 850)
    salary_consistency = np.random.uniform(0.4, 1.0)
    digital_activity_score = np.random.randint(20, 100)
    credit_card_spend = int(monthly_income * np.random.uniform(0.05, 0.6))
    investment_amount = int(monthly_income * np.random.uniform(0, 0.7))
    rent_payment = np.random.choice([0, 1], p=[0.45, 0.55])
    loan_history = np.random.randint(0, 4)

    foir = existing_emi / monthly_income
    savings_ratio = (monthly_income - monthly_expense - existing_emi) / monthly_income

    intent_score = (
        (monthly_income > 50000) * 15
        + (cibil_score > 700) * 20
        + (salary_consistency > 0.75) * 15
        + (foir < 0.35) * 20
        + (digital_activity_score > 60) * 10
        + (savings_ratio > 0.15) * 20
    )

    loan_accepted = 1 if intent_score + np.random.randint(-20, 20) > 60 else 0

    if loan_accepted:
        if rent_payment and monthly_income > 70000:
            recommended_loan = "Home Loan"
        elif credit_card_spend > monthly_income * 0.35:
            recommended_loan = "Personal Loan"
        elif monthly_income > 40000 and digital_activity_score > 50:
            recommended_loan = "Auto Loan"
        else:
            recommended_loan = "Mortgage Loan"
    else:
        recommended_loan = "None"

    data.append({
        "customer_id": f"CUST{i:05d}",
        "age": age,
        "city": np.random.choice(cities),
        "monthly_income": monthly_income,
        "avg_monthly_balance": avg_monthly_balance,
        "monthly_expense": monthly_expense,
        "existing_emi": existing_emi,
        "cibil_score": cibil_score,
        "salary_consistency": round(salary_consistency, 2),
        "digital_activity_score": digital_activity_score,
        "credit_card_spend": credit_card_spend,
        "investment_amount": investment_amount,
        "rent_payment": rent_payment,
        "loan_history": loan_history,
        "foir": round(foir, 2),
        "savings_ratio": round(savings_ratio, 2),
        "recommended_loan": recommended_loan,
        "loan_accepted": loan_accepted
    })

df = pd.DataFrame(data)
df.to_csv(DATA_DIR / "synthetic_customers.csv", index=False)

print("Dataset created successfully.")
print(df.head())
print("Shape:", df.shape)