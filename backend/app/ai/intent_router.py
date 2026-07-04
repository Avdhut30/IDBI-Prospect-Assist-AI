def detect_intent(question: str) -> str:
    q = question.lower()

    if "explain customer" in q or "why" in q or "customer" in q:
        return "customer_explanation"

    if "home loan" in q:
        return "home_loan_prospects"

    if "auto loan" in q:
        return "auto_loan_prospects"

    if "personal loan" in q:
        return "personal_loan_prospects"

    if "who should i contact" in q or "call today" in q or "contact today" in q:
        return "daily_priority"

    if "dashboard" in q or "summary" in q or "insight" in q:
        return "dashboard_summary"

    return "general"
