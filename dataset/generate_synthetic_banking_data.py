"""Generate a reproducible synthetic banking prospect dataset."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd

DEFAULT_OUTPUT = Path(__file__).with_name("synthetic_banking_customers.csv")


def _bounded_normal(
    rng: np.random.Generator,
    mean: np.ndarray | float,
    std: float,
    low: float,
    high: float,
) -> np.ndarray:
    return np.clip(rng.normal(mean, std), low, high)


def generate_customers(rows: int = 10_000, seed: int = 42) -> pd.DataFrame:
    """Return a synthetic customer dataset with a probabilistic loan label."""
    if rows < 1:
        raise ValueError("rows must be at least 1")

    rng = np.random.default_rng(seed)

    age = np.clip(np.rint(rng.normal(40, 11, rows)), 21, 70).astype(int)
    gender = rng.choice(["Female", "Male", "Non-binary"], rows, p=[0.48, 0.51, 0.01])
    marital_status = rng.choice(
        ["Single", "Married", "Divorced", "Widowed"],
        rows,
        p=[0.30, 0.59, 0.08, 0.03],
    )
    dependents = np.clip(rng.poisson(1.1, rows), 0, 5)
    education = rng.choice(
        ["High School", "Graduate", "Postgraduate", "Professional"],
        rows,
        p=[0.19, 0.48, 0.25, 0.08],
    )
    city_tier = rng.choice(["Tier 1", "Tier 2", "Tier 3"], rows, p=[0.42, 0.36, 0.22])

    employment_type = rng.choice(
        ["Salaried", "Self-employed", "Government", "Business"],
        rows,
        p=[0.55, 0.21, 0.14, 0.10],
    )
    retired = age >= 61
    employment_type[retired] = "Retired"

    employment_income_factor = (
        pd.Series(employment_type)
        .map(
            {
                "Salaried": 1.00,
                "Self-employed": 1.12,
                "Government": 0.95,
                "Business": 1.35,
                "Retired": 0.65,
            }
        )
        .to_numpy()
    )
    education_income_factor = (
        pd.Series(education)
        .map(
            {
                "High School": 0.72,
                "Graduate": 1.00,
                "Postgraduate": 1.38,
                "Professional": 1.58,
            }
        )
        .to_numpy()
    )
    city_income_factor = (
        pd.Series(city_tier)
        .map({"Tier 1": 1.22, "Tier 2": 1.00, "Tier 3": 0.82})
        .to_numpy()
    )
    experience_factor = 0.80 + np.minimum(age - 21, 29) * 0.018

    monthly_income = (
        rng.lognormal(mean=np.log(45_000), sigma=0.42, size=rows)
        * employment_income_factor
        * education_income_factor
        * city_income_factor
        * experience_factor
    )
    monthly_income = np.clip(monthly_income, 15_000, 350_000).round(2)

    consistency_base = (
        pd.Series(employment_type)
        .map(
            {
                "Salaried": 0.88,
                "Self-employed": 0.67,
                "Government": 0.95,
                "Business": 0.72,
                "Retired": 0.93,
            }
        )
        .to_numpy()
    )
    salary_consistency_score = _bounded_normal(
        rng, consistency_base, 0.08, 0.35, 1.00
    ).round(3)

    max_relationship = np.maximum(age - 18, 1)
    years_with_bank = np.minimum(
        rng.gamma(shape=2.2, scale=3.1, size=rows), max_relationship
    ).round(1)
    avg_monthly_balance = np.clip(
        monthly_income * rng.lognormal(mean=-0.58, sigma=0.62, size=rows),
        1_000,
        1_500_000,
    ).round(2)
    monthly_credit_amount = (
        monthly_income * _bounded_normal(rng, 1.06, 0.13, 0.65, 1.60)
    ).round(2)
    savings_rate = rng.beta(2.2, 6.0, rows) * 0.48
    monthly_debit_amount = np.clip(
        monthly_credit_amount * (1 - savings_rate) + rng.normal(0, 1_500, rows),
        3_000,
        None,
    ).round(2)
    monthly_transaction_count = np.clip(
        rng.poisson(32 + monthly_income / 6_500), 5, 180
    ).astype(int)

    has_emi = rng.random(rows) < 0.72
    emi_ratio = np.where(has_emi, rng.beta(2.0, 5.5, rows) * 0.72, 0)
    emi_obligations = (monthly_income * emi_ratio).round(2)
    debt_to_income_ratio = (emi_obligations / monthly_income).round(3)
    active_loans = np.where(
        has_emi, np.clip(rng.poisson(0.9 + emi_ratio * 2.2, rows), 1, 5), 0
    ).astype(int)
    credit_utilization_ratio = np.clip(
        rng.beta(2.0, 4.5, rows) + debt_to_income_ratio * 0.35, 0.01, 0.98
    ).round(3)
    missed_payment_risk = (
        0.08 + debt_to_income_ratio * 0.75 + (1 - salary_consistency_score) * 0.50
    )
    missed_payments_12m = np.clip(rng.poisson(missed_payment_risk, rows), 0, 8).astype(
        int
    )
    cibil_score = (
        np.clip(
            790
            - credit_utilization_ratio * 105
            - debt_to_income_ratio * 125
            - missed_payments_12m * 38
            + (salary_consistency_score - 0.75) * 70
            + rng.normal(0, 28, rows),
            300,
            900,
        )
        .round()
        .astype(int)
    )

    monthly_investment_amount = np.clip(
        monthly_income * rng.beta(1.6, 8.0, rows) * (0.55 + salary_consistency_score),
        0,
        100_000,
    ).round(2)
    no_investment = rng.random(rows) < 0.20
    monthly_investment_amount[no_investment] = 0
    investment_value = np.clip(
        monthly_investment_amount
        * rng.uniform(8, 84, rows)
        * (0.6 + years_with_bank / 18),
        0,
        5_000_000,
    ).round(2)
    has_fixed_deposit = (
        rng.random(rows) < np.clip(0.12 + avg_monthly_balance / 450_000, 0.12, 0.72)
    ).astype(int)
    has_mutual_fund = (
        rng.random(rows)
        < np.clip(0.10 + monthly_investment_amount / 35_000, 0.10, 0.78)
    ).astype(int)

    age_digital_factor = np.clip((62 - age) / 28, 0.15, 1.25)
    digital_logins_30d = np.clip(
        rng.poisson(10 + 15 * age_digital_factor, rows), 0, 80
    ).astype(int)
    upi_transactions_30d = np.clip(
        rng.poisson(5 + 24 * age_digital_factor, rows), 0, 120
    ).astype(int)
    mobile_probability = np.clip(
        0.52 + 0.012 * digital_logins_30d - 0.006 * np.maximum(age - 55, 0),
        0.25,
        0.98,
    )
    mobile_banking_user = (rng.random(rows) < mobile_probability).astype(int)

    loan_product_interest = rng.choice(
        ["Personal Loan", "Home Loan", "Auto Loan", "Mortgage Loan"],
        rows,
        p=[0.40, 0.28, 0.22, 0.10],
    )
    product_multiplier = (
        pd.Series(loan_product_interest)
        .map(
            {
                "Personal Loan": 8,
                "Home Loan": 48,
                "Auto Loan": 18,
                "Mortgage Loan": 60,
            }
        )
        .to_numpy()
    )
    loan_amount_requested = (
        np.clip(
            monthly_income * product_multiplier * rng.uniform(0.55, 1.25, rows),
            50_000,
            15_000_000,
        )
        .round(-3)
        .astype(int)
    )
    loan_tenure_months = np.select(
        [
            loan_product_interest == "Personal Loan",
            loan_product_interest == "Auto Loan",
            loan_product_interest == "Home Loan",
        ],
        [
            rng.choice([12, 24, 36, 48, 60], rows),
            rng.choice([24, 36, 48, 60, 72, 84], rows),
            rng.choice([120, 180, 240, 300, 360], rows),
        ],
        default=rng.choice([60, 84, 120, 180], rows),
    ).astype(int)

    # Protected demographic fields are deliberately excluded from this equation.
    product_propensity = (
        pd.Series(loan_product_interest)
        .map(
            {
                "Personal Loan": 0.24,
                "Home Loan": -0.10,
                "Auto Loan": 0.12,
                "Mortgage Loan": -0.22,
            }
        )
        .to_numpy()
    )
    acceptance_logit = (
        -2.12
        + (cibil_score - 650) / 105
        + (salary_consistency_score - 0.70) * 2.0
        - np.maximum(debt_to_income_ratio - 0.28, 0) * 3.3
        - missed_payments_12m * 0.42
        + np.minimum(years_with_bank, 12) / 24
        + mobile_banking_user * 0.18
        + np.minimum(digital_logins_30d, 45) / 130
        + product_propensity
        + rng.normal(0, 0.42, rows)
    )
    acceptance_probability = 1 / (1 + np.exp(-acceptance_logit))
    loan_accepted = (rng.random(rows) < acceptance_probability).astype(int)

    data = pd.DataFrame(
        {
            "customer_id": [f"CUST{i:06d}" for i in range(1, rows + 1)],
            "age": age,
            "gender": gender,
            "marital_status": marital_status,
            "dependents": dependents,
            "education": education,
            "employment_type": employment_type,
            "city_tier": city_tier,
            "monthly_income": monthly_income,
            "salary_consistency_score": salary_consistency_score,
            "years_with_bank": years_with_bank,
            "avg_monthly_balance": avg_monthly_balance,
            "monthly_credit_amount": monthly_credit_amount,
            "monthly_debit_amount": monthly_debit_amount,
            "monthly_transaction_count": monthly_transaction_count,
            "emi_obligations": emi_obligations,
            "debt_to_income_ratio": debt_to_income_ratio,
            "credit_utilization_ratio": credit_utilization_ratio,
            "cibil_score": cibil_score,
            "active_loans": active_loans,
            "missed_payments_12m": missed_payments_12m,
            "monthly_investment_amount": monthly_investment_amount,
            "investment_value": investment_value,
            "has_fixed_deposit": has_fixed_deposit,
            "has_mutual_fund": has_mutual_fund,
            "digital_logins_30d": digital_logins_30d,
            "upi_transactions_30d": upi_transactions_30d,
            "mobile_banking_user": mobile_banking_user,
            "loan_product_interest": loan_product_interest,
            "loan_amount_requested": loan_amount_requested,
            "loan_tenure_months": loan_tenure_months,
            "loan_accepted": loan_accepted,
        }
    )

    if data["customer_id"].duplicated().any() or data.isna().any().any():
        raise RuntimeError("Generated data failed uniqueness or null validation")

    return data


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rows", type=int, default=10_000)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    data = generate_customers(rows=args.rows, seed=args.seed)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    data.to_csv(args.output, index=False)

    acceptance_rate = data["loan_accepted"].mean()
    print(f"Created {len(data):,} customers at {args.output}")
    print(f"Columns: {len(data.columns)}")
    print(f"Loan acceptance rate: {acceptance_rate:.1%}")


if __name__ == "__main__":
    main()
