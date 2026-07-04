def recommend_loan_product(customer: dict, intelligence: dict):
    score = intelligence["overall_prospect_score"]
    risk = intelligence["risk_level"]

    if score < 50 or risk == "High":
        return {
            "recommended_product": "No Immediate Offer",
            "priority": "Low",
            "confidence": "Low",
            "message": "Customer is not suitable for immediate loan targeting.",
            "reasons": intelligence["reasons"],
        }

    if customer["rent_payment"] == 1 and customer["property_related_transactions"] == 1:
        product = "Home Loan"
        reason = "Customer shows rent and property-related activity."
    elif customer["vehicle_related_spend"] > customer["monthly_income"] * 0.12:
        product = "Auto Loan"
        reason = "Customer shows strong vehicle-related spending signals."
    elif customer["credit_card_spend"] > customer["monthly_income"] * 0.35:
        product = "Personal Loan"
        reason = "Customer shows high discretionary spending and possible short-term credit need."
    else:
        product = "Mortgage Loan"
        reason = "Customer has reasonable financial capacity and may be suitable for secured lending."

    if score >= 80 and risk == "Low":
        priority = "High"
        confidence = "High"
    elif score >= 65:
        priority = "Medium"
        confidence = "Medium"
    else:
        priority = "Low"
        confidence = "Medium"

    return {
        "recommended_product": product,
        "priority": priority,
        "confidence": confidence,
        "message": reason,
        "reasons": intelligence["reasons"],
    }
