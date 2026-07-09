from .customer_data import get_customer_by_id
from .intelligence import calculate_prospect_intelligence
from .recommendation import recommend_loan_product
from .scoring import predict_customer_score


def _clamp_score(score):
    return round(max(0, min(100, float(score))), 2)


def run_what_if_analysis(
    customer_id: str, income_change: float = 0, emi_change: float = 0
):
    customer = get_customer_by_id(customer_id)

    if customer is None:
        return {"error": "Customer not found"}

    current_intel = calculate_prospect_intelligence(customer)
    current_rec = recommend_loan_product(customer, current_intel)
    current_prediction = predict_customer_score(customer)

    projected_customer = customer.copy()

    projected_customer["monthly_income"] = max(
        1, projected_customer["monthly_income"] + income_change
    )

    projected_customer["existing_emi"] = max(
        0, projected_customer["existing_emi"] + emi_change
    )

    projected_customer["foir"] = round(
        projected_customer["existing_emi"] / projected_customer["monthly_income"], 2
    )

    projected_customer["savings_ratio"] = round(
        (
            projected_customer["monthly_income"]
            - projected_customer["monthly_expense"]
            - projected_customer["existing_emi"]
        )
        / projected_customer["monthly_income"],
        2,
    )

    projected_intel = calculate_prospect_intelligence(projected_customer)
    projected_rec = recommend_loan_product(projected_customer, projected_intel)
    projected_prediction = predict_customer_score(projected_customer)

    current_score = _clamp_score(
        customer.get("prospect_score", current_prediction["lead_score"])
    )
    financial_impact = round(
        projected_intel["overall_prospect_score"]
        - current_intel["overall_prospect_score"],
        2,
    )
    projected_score = _clamp_score(current_score + financial_impact)
    score_change = round(projected_score - current_score, 2)

    if score_change > 0:
        decision = "Positive impact on loan prospect quality"
    elif score_change < 0:
        decision = "Negative impact on loan prospect quality"
    else:
        decision = "Neutral impact on loan prospect quality"

    return {
        "customer_id": customer_id,
        "current": {
            "monthly_income": customer["monthly_income"],
            "existing_emi": customer["existing_emi"],
            "foir": customer["foir"],
            "savings_ratio": customer["savings_ratio"],
            "prospect_score": current_score,
            "model_lead_score": current_prediction["lead_score"],
            "intelligence_score": current_intel["overall_prospect_score"],
            "risk_level": current_prediction["risk_level"],
            "recommended_product": current_prediction["recommended_loan"],
            "rule_based_recommendation": current_rec["recommended_product"],
        },
        "projected": {
            "monthly_income": projected_customer["monthly_income"],
            "existing_emi": projected_customer["existing_emi"],
            "foir": projected_customer["foir"],
            "savings_ratio": projected_customer["savings_ratio"],
            "prospect_score": projected_score,
            "model_lead_score": projected_prediction["lead_score"],
            "intelligence_score": projected_intel["overall_prospect_score"],
            "risk_level": projected_prediction["risk_level"],
            "recommended_product": projected_prediction["recommended_loan"],
            "rule_based_recommendation": projected_rec["recommended_product"],
        },
        "impact": {
            "score_change": score_change,
            "financial_impact": financial_impact,
            "decision": decision,
        },
    }
