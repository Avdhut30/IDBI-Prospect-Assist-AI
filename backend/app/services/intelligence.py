def calculate_prospect_intelligence(customer: dict):
    income_stability = round(customer["salary_consistency"] * 20, 2)

    repayment_capacity = round(max(0, 20 - (customer["foir"] * 40)), 2)

    creditworthiness = round(
        max(0, min(20, ((customer["cibil_score"] - 580) / 270) * 20)), 2
    )

    digital_engagement = round((customer["digital_activity_score"] / 100) * 15, 2)

    savings_strength = round(max(0, min(15, customer["savings_ratio"] * 50)), 2)

    loan_intent = 0
    loan_intent += 2 if customer["rent_payment"] == 1 else 0
    loan_intent += 3 if customer["property_related_transactions"] == 1 else 0
    loan_intent += (
        2
        if customer["vehicle_related_spend"] > customer["monthly_income"] * 0.12
        else 0
    )
    loan_intent += (
        2 if customer["credit_card_spend"] > customer["monthly_income"] * 0.35 else 0
    )
    loan_intent += 1 if customer["account_tenure_months"] > 24 else 0

    overall_score = round(
        income_stability
        + repayment_capacity
        + creditworthiness
        + digital_engagement
        + savings_strength
        + loan_intent,
        2,
    )

    if overall_score >= 80:
        category = "Excellent Prospect"
    elif overall_score >= 65:
        category = "Good Prospect"
    elif overall_score >= 50:
        category = "Moderate Prospect"
    else:
        category = "Low Priority"

    if customer["foir"] < 0.35 and customer["cibil_score"] >= 700:
        risk_level = "Low"
    elif customer["foir"] < 0.5 and customer["cibil_score"] >= 650:
        risk_level = "Medium"
    else:
        risk_level = "High"

    reasons = []

    if customer["salary_consistency"] > 0.75:
        reasons.append("Stable salary pattern")
    if customer["cibil_score"] >= 700:
        reasons.append("Good credit score")
    if customer["foir"] < 0.35:
        reasons.append("Low EMI burden")
    if customer["savings_ratio"] > 0.15:
        reasons.append("Healthy savings capacity")
    if customer["digital_activity_score"] > 60:
        reasons.append("Active digital banking usage")
    if customer["rent_payment"] == 1:
        reasons.append("Regular rent payments indicate possible home loan intent")
    if customer["property_related_transactions"] == 1:
        reasons.append("Property-related activity indicates home loan opportunity")
    if customer["vehicle_related_spend"] > customer["monthly_income"] * 0.12:
        reasons.append("Vehicle-related spending indicates auto loan opportunity")

    return {
        "overall_prospect_score": overall_score,
        "prospect_category": category,
        "risk_level": risk_level,
        "score_breakdown": {
            "income_stability": income_stability,
            "repayment_capacity": repayment_capacity,
            "creditworthiness": creditworthiness,
            "digital_engagement": digital_engagement,
            "savings_strength": savings_strength,
            "loan_intent": loan_intent,
        },
        "reasons": reasons,
    }
