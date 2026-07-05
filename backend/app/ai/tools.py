import re

from ..services.analytics import get_dashboard_summary
from ..services.customer_data import get_customer_by_id, get_top_prospects
from ..services.explanation import generate_customer_explanation
from ..services.intelligence import calculate_prospect_intelligence
from ..services.recommendation import recommend_loan_product


def extract_customer_id(question: str):
    match = re.search(r"CUST\d{5}", question.upper())
    return match.group(0) if match else None


def customer_explanation_tool(question: str):
    customer_id = extract_customer_id(question)

    if not customer_id:
        return {"error": "Please provide a valid customer ID like CUST00001."}

    customer = get_customer_by_id(customer_id)

    if customer is None:
        return {"error": f"Customer {customer_id} not found."}

    intelligence = calculate_prospect_intelligence(customer)
    recommendation = recommend_loan_product(customer, intelligence)
    explanation = generate_customer_explanation(
        customer,
        intelligence,
        recommendation,
    )

    return {
        "customer": customer,
        "intelligence": intelligence,
        "recommendation": recommendation,
        "explanation": explanation,
    }


def prospect_list_tool(product_name: str, limit: int = 10):
    prospects = get_top_prospects(limit=200)

    filtered = [
        prospect
        for prospect in prospects
        if prospect.get("recommended_loan") == product_name
    ]

    return filtered[:limit]


def daily_priority_tool(limit: int = 5):
    prospects = get_top_prospects(limit=200)

    sorted_prospects = sorted(
        prospects,
        key=lambda prospect: prospect.get("prospect_score", 0),
        reverse=True,
    )

    return sorted_prospects[:limit]


def dashboard_summary_tool():
    return get_dashboard_summary()
