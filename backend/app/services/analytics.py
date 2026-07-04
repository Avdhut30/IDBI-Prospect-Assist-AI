from .customer_data import load_customers


def get_dashboard_summary():
    df = load_customers()

    total_customers = len(df)
    total_prospects = int(df["loan_accepted"].sum())
    conversion_potential = round((total_prospects / total_customers) * 100, 2)

    high_risk = int(((df["foir"] > 0.5) | (df["cibil_score"] < 650)).sum())

    avg_income = round(df["monthly_income"].mean(), 2)
    avg_cibil = round(df["cibil_score"].mean(), 2)

    loan_distribution = (
        df[df["recommended_loan"] != "None"]["recommended_loan"]
        .value_counts()
        .to_dict()
    )

    city_distribution = df[df["loan_accepted"] == 1]["city"].value_counts().to_dict()

    risk_distribution = {
        "Low": int(((df["foir"] < 0.35) & (df["cibil_score"] >= 700)).sum()),
        "Medium": int(
            (
                (df["foir"] >= 0.35) & (df["foir"] < 0.5) & (df["cibil_score"] >= 650)
            ).sum()
        ),
        "High": int(((df["foir"] >= 0.5) | (df["cibil_score"] < 650)).sum()),
    }

    return {
        "total_customers": total_customers,
        "total_prospects": total_prospects,
        "conversion_potential_percent": conversion_potential,
        "high_risk_customers": high_risk,
        "average_income": avg_income,
        "average_cibil": avg_cibil,
        "loan_distribution": loan_distribution,
        "city_distribution": city_distribution,
        "risk_distribution": risk_distribution,
    }
