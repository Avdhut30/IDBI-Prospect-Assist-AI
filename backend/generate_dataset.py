import numpy as np
import pandas as pd
from pathlib import Path

np.random.seed(42)

N = 10000
DATA_DIR = Path("../dataset")
DATA_DIR.mkdir(exist_ok=True)

cities = ["Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Nagpur"]
employment_types = [
    "Salaried",
    "Self Employed",
    "Business Owner",
    "Government Employee",
]
account_types = ["Savings", "Salary", "Current"]

data = []

for i in range(1, N + 1):
    age = np.random.randint(22, 61)
    city = np.random.choice(cities)
    employment_type = np.random.choice(employment_types, p=[0.55, 0.2, 0.15, 0.1])
    account_type = np.random.choice(account_types, p=[0.45, 0.4, 0.15])

    monthly_income = np.random.randint(18000, 250000)
    monthly_expense = int(monthly_income * np.random.uniform(0.25, 0.85))
    avg_monthly_balance = int(monthly_income * np.random.uniform(0.1, 1.8))
    existing_emi = int(monthly_income * np.random.uniform(0, 0.45))

    cibil_score = np.random.randint(580, 850)
    salary_consistency = np.random.uniform(0.4, 1.0)
    account_tenure_months = np.random.randint(6, 180)

    upi_transactions = np.random.randint(5, 250)
    atm_withdrawals = np.random.randint(0, 25)
    net_banking_logins = np.random.randint(1, 90)
    mobile_banking_logins = np.random.randint(5, 150)
    digital_activity_score = np.random.randint(20, 100)

    credit_card_spend = int(monthly_income * np.random.uniform(0.05, 0.6))
    credit_card_utilization = round(np.random.uniform(0.05, 0.95), 2)
    delayed_payment_count = np.random.randint(0, 6)

    investment_amount = int(monthly_income * np.random.uniform(0, 0.7))
    fd_rd_holding = np.random.choice([0, 1], p=[0.55, 0.45])
    insurance_owned = np.random.choice([0, 1], p=[0.5, 0.5])
    mutual_fund_investment = int(monthly_income * np.random.uniform(0, 0.5))

    rent_payment = np.random.choice([0, 1], p=[0.45, 0.55])
    property_related_transactions = np.random.choice([0, 1], p=[0.75, 0.25])
    vehicle_related_spend = int(monthly_income * np.random.uniform(0, 0.25))
    education_spend = int(monthly_income * np.random.uniform(0, 0.18))
    medical_spend = int(monthly_income * np.random.uniform(0, 0.15))

    loan_history = np.random.randint(0, 4)
    previous_personal_loan = np.random.choice([0, 1], p=[0.7, 0.3])
    previous_home_loan = np.random.choice([0, 1], p=[0.82, 0.18])
    previous_auto_loan = np.random.choice([0, 1], p=[0.78, 0.22])
    previous_mortgage_loan = np.random.choice([0, 1], p=[0.9, 0.1])

    monthly_credit = int(monthly_income * np.random.uniform(0.9, 1.4))
    monthly_debit = monthly_expense + existing_emi

    foir = existing_emi / monthly_income
    savings_ratio = (monthly_income - monthly_expense - existing_emi) / monthly_income

    income_stability_score = salary_consistency * 20
    repayment_score = max(0, 20 - (foir * 40))
    credit_score = max(0, (cibil_score - 580) / 270 * 20)
    digital_score = digital_activity_score / 100 * 15
    savings_score = max(0, min(15, savings_ratio * 50))
    intent_score = (
        rent_payment * 2
        + property_related_transactions * 3
        + (vehicle_related_spend > monthly_income * 0.12) * 2
        + (credit_card_spend > monthly_income * 0.35) * 2
        + (account_tenure_months > 24) * 1
    )

    prospect_score = (
        income_stability_score
        + repayment_score
        + credit_score
        + digital_score
        + savings_score
        + intent_score
    )

    noise = np.random.uniform(-10, 10)
    loan_accepted = 1 if prospect_score + noise > 62 else 0

    if loan_accepted:
        if rent_payment and property_related_transactions:
            recommended_loan = "Home Loan"
        elif vehicle_related_spend > monthly_income * 0.12:
            recommended_loan = "Auto Loan"
        elif credit_card_spend > monthly_income * 0.35:
            recommended_loan = "Personal Loan"
        else:
            recommended_loan = "Mortgage Loan"
    else:
        recommended_loan = "None"

    data.append(
        {
            "customer_id": f"CUST{i:05d}",
            "age": age,
            "city": city,
            "employment_type": employment_type,
            "account_type": account_type,
            "monthly_income": monthly_income,
            "monthly_credit": monthly_credit,
            "monthly_debit": monthly_debit,
            "monthly_expense": monthly_expense,
            "avg_monthly_balance": avg_monthly_balance,
            "existing_emi": existing_emi,
            "foir": round(foir, 2),
            "savings_ratio": round(savings_ratio, 2),
            "cibil_score": cibil_score,
            "salary_consistency": round(salary_consistency, 2),
            "account_tenure_months": account_tenure_months,
            "upi_transactions": upi_transactions,
            "atm_withdrawals": atm_withdrawals,
            "net_banking_logins": net_banking_logins,
            "mobile_banking_logins": mobile_banking_logins,
            "digital_activity_score": digital_activity_score,
            "credit_card_spend": credit_card_spend,
            "credit_card_utilization": credit_card_utilization,
            "delayed_payment_count": delayed_payment_count,
            "investment_amount": investment_amount,
            "fd_rd_holding": fd_rd_holding,
            "insurance_owned": insurance_owned,
            "mutual_fund_investment": mutual_fund_investment,
            "rent_payment": rent_payment,
            "property_related_transactions": property_related_transactions,
            "vehicle_related_spend": vehicle_related_spend,
            "education_spend": education_spend,
            "medical_spend": medical_spend,
            "loan_history": loan_history,
            "previous_personal_loan": previous_personal_loan,
            "previous_home_loan": previous_home_loan,
            "previous_auto_loan": previous_auto_loan,
            "previous_mortgage_loan": previous_mortgage_loan,
            "prospect_score": round(prospect_score, 2),
            "recommended_loan": recommended_loan,
            "loan_accepted": loan_accepted,
        }
    )

df = pd.DataFrame(data)
df.to_csv(DATA_DIR / "synthetic_customers.csv", index=False)

print("Banking-grade synthetic dataset created successfully.")
print("Shape:", df.shape)
print(df.head())
