import random
from .customer_data import get_customer_by_id


def generate_customer_timeline(customer_id: str):
    customer = get_customer_by_id(customer_id)

    if customer is None:
        return None

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    income_base = customer["monthly_income"]
    balance_base = customer["avg_monthly_balance"]
    emi_base = customer["existing_emi"]

    timeline = []

    for month in months:
        timeline.append({
            "month": month,
            "income": int(income_base * random.uniform(0.92, 1.08)),
            "balance": int(balance_base * random.uniform(0.85, 1.15)),
            "emi": int(emi_base * random.uniform(0.95, 1.05)),
            "savings": int((income_base - customer["monthly_expense"] - emi_base) * random.uniform(0.85, 1.2)),
        })

    return {
        "customer_id": customer_id,
        "timeline": timeline
    }
