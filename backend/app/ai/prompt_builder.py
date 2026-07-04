def build_customer_explanation_response(data: dict):
    if "error" in data:
        return data["error"]

    customer = data["customer"]
    intelligence = data["intelligence"]
    recommendation = data["recommendation"]
    explanation = data["explanation"]

    reasons = "\n".join(f"- {reason}" for reason in explanation["key_reasons"])

    return f"""
Customer {customer['customer_id']} is classified as {intelligence['prospect_category']}.

Prospect Score: {intelligence['overall_prospect_score']}/100
Risk Level: {intelligence['risk_level']}
Recommended Product: {recommendation['recommended_product']}
Priority: {recommendation['priority']}

Why this customer?
{reasons}

Relationship Manager Note:
{explanation['relationship_manager_note']}

Suggested Action:
{explanation['recommended_action']}
""".strip()


def build_prospect_list_response(product_name: str, prospects: list):
    if not prospects:
        return f"No high-quality {product_name} prospects found currently."

    lines = [f"Top {product_name} prospects:"]

    for index, prospect in enumerate(prospects, start=1):
        lines.append(f"""
{index}. {prospect['customer_id']}
City: {prospect['city']}
Monthly Income: ₹{prospect['monthly_income']}
CIBIL Score: {prospect['cibil_score']}
Prospect Score: {prospect.get('prospect_score')}
Recommended Loan: {prospect['recommended_loan']}
Suggested Action: Contact this customer for {product_name}.
""".strip())

    return "\n\n".join(lines)


def build_daily_priority_response(prospects: list):
    lines = ["Today's highest priority customers to contact:"]

    for index, prospect in enumerate(prospects, start=1):
        lines.append(f"""
{index}. {prospect['customer_id']}
City: {prospect['city']}
Prospect Score: {prospect.get('prospect_score')}
Recommended Loan: {prospect['recommended_loan']}
CIBIL Score: {prospect['cibil_score']}
Suggested Action: Call today.
""".strip())

    return "\n\n".join(lines)


def build_dashboard_summary_response(summary: dict):
    return f"""
Executive Summary:

Total Customers: {summary['total_customers']}
High Potential Prospects: {summary['total_prospects']}
Estimated Conversion Potential: {summary['conversion_potential_percent']}%
High Risk Customers: {summary['high_risk_customers']}
Average Income: ₹{summary['average_income']}
Average CIBIL Score: {summary['average_cibil']}

Business Recommendation:
Relationship managers should prioritize low-risk customers with stable income, strong CIBIL scores, healthy savings ratio, and clear product intent signals.
""".strip()
