from .customer_data import load_customers
from .analytics import get_dashboard_summary


def generate_executive_brief():
    df = load_customers()
    summary = get_dashboard_summary()

    high_priority = df[
        (df["loan_accepted"] == 1) &
        (df["prospect_score"] >= 75)
    ]

    top_city = (
        high_priority["city"].value_counts().idxmax()
        if not high_priority.empty else "N/A"
    )

    top_product = (
        high_priority["recommended_loan"].value_counts().idxmax()
        if not high_priority.empty else "N/A"
    )

    estimated_business_value = int(
        (
            high_priority["monthly_income"].sum() * 12 * 0.6
        ) / 10000000
    )

    immediate_followups = int(
        len(high_priority[
            (high_priority["cibil_score"] >= 720) &
            (high_priority["foir"] < 0.35)
        ])
    )

    brief = {
        "greeting": "Good Morning, Relationship Manager",
        "total_customers": summary["total_customers"],
        "high_priority_prospects": int(len(high_priority)),
        "estimated_business_opportunity_cr": estimated_business_value,
        "top_city": top_city,
        "top_product": top_product,
        "immediate_followups": immediate_followups,
        "conversion_potential_percent": summary["conversion_potential_percent"],
        "brief": (
            f"Today, Prospect Assist AI has identified {len(high_priority)} "
            f"high-priority customers. The strongest opportunity is in {top_city}, "
            f"with {top_product} showing the highest product demand. "
            f"Relationship managers should prioritize {immediate_followups} "
            f"customers with strong CIBIL scores and low FOIR."
        )
    }

    return brief
