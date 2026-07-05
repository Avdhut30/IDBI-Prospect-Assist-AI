from app.services.customer_data import get_customer_by_id
from app.services.intelligence import calculate_prospect_intelligence
from app.services.recommendation import recommend_loan_product


def run_what_if_analysis(customer_id: str, income_change: float = 0, emi_change: float = 0):
    customer = get_customer_by_id(customer_id)

    if customer is None:
        return {"error": "Customer not found"}

    current_intel = calculate_prospect_intelligence(customer)
    current_rec = recommend_loan_product(customer, current_intel)

    projected_customer = customer.copy()

    projected_customer["monthly_income"] = max(
        1,
        projected_customer["monthly_income"] + income_change
    )

    projected_customer["existing_emi"] = max(
        0,
        projected_customer["existing_emi"] + emi_change
    )

    projected_customer["foir"] = round(
        projected_customer["existing_emi"] / projected_customer["monthly_income"],
        2
    )

    projected_customer["savings_ratio"] = round(
        (
            projected_customer["monthly_income"]
            - projected_customer["monthly_expense"]
            - projected_customer["existing_emi"]
        )
        / projected_customer["monthly_income"],
        2
    )

    projected_intel = calculate_prospect_intelligence(projected_customer)
    projected_rec = recommend_loan_product(projected_customer, projected_intel)

    score_change = round(
        projected_intel["overall_prospect_score"]
        - current_intel["overall_prospect_score"],
        2
    )

    return {
        "customer_id": customer_id,
        "current": {
            "monthly_income": customer["monthly_income"],
            "existing_emi": customer["existing_emi"],
            "foir": customer["foir"],
            "savings_ratio": customer["savings_ratio"],
            "prospect_score": current_intel["overall_prospect_score"],
            "risk_level": current_intel["risk_level"],
            "recommended_product": current_rec["recommended_product"],
        },
        "projected": {
            "monthly_income": projected_customer["monthly_income"],
            "existing_emi": projected_customer["existing_emi"],
            "foir": projected_customer["foir"],
            "savings_ratio": projected_customer["savings_ratio"],
            "prospect_score": projected_intel["overall_prospect_score"],
            "risk_level": projected_intel["risk_level"],
            "recommended_product": projected_rec["recommended_product"],
        },
        "impact": {
            "score_change": score_change,
            "decision": (
                "Positive impact on loan prospect quality"
                if score_change > 0
                else "Negative or neutral impact on loan prospect quality"
            )
        }
    }
