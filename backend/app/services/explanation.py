def generate_customer_explanation(
    customer: dict, intelligence: dict, recommendation: dict
):
    score = intelligence["overall_prospect_score"]
    category = intelligence["prospect_category"]
    risk = intelligence["risk_level"]
    product = recommendation["recommended_product"]

    explanation = {
        "summary": f"This customer is classified as a {category} with an overall prospect score of {score}/100.",
        "recommended_action": f"Recommended action: offer {product}.",
        "risk_summary": f"Risk level is {risk} based on FOIR, CIBIL score, and repayment capacity.",
        "key_reasons": intelligence["reasons"],
        "score_breakdown": intelligence["score_breakdown"],
        "relationship_manager_note": (
            f"Customer has monthly income of ₹{customer['monthly_income']}, "
            f"CIBIL score of {customer['cibil_score']}, "
            f"FOIR of {customer['foir']}, and savings ratio of {customer['savings_ratio']}. "
            f"This profile can be prioritized as {recommendation['priority']} priority."
        ),
    }

    return explanation
