from app.ai.intent_router import detect_intent
from app.ai.prompt_builder import (
    build_customer_explanation_response,
    build_daily_priority_response,
    build_dashboard_summary_response,
    build_prospect_list_response,
)
from app.ai.tools import (
    customer_explanation_tool,
    daily_priority_tool,
    dashboard_summary_tool,
    prospect_list_tool,
)


def run_copilot(question: str):
    intent = detect_intent(question)

    if intent == "customer_explanation":
        data = customer_explanation_tool(question)
        answer = build_customer_explanation_response(data)

    elif intent == "home_loan_prospects":
        data = prospect_list_tool("Home Loan")
        answer = build_prospect_list_response("Home Loan", data)

    elif intent == "auto_loan_prospects":
        data = prospect_list_tool("Auto Loan")
        answer = build_prospect_list_response("Auto Loan", data)

    elif intent == "personal_loan_prospects":
        data = prospect_list_tool("Personal Loan")
        answer = build_prospect_list_response("Personal Loan", data)

    elif intent == "daily_priority":
        data = daily_priority_tool()
        answer = build_daily_priority_response(data)

    elif intent == "dashboard_summary":
        data = dashboard_summary_tool()
        answer = build_dashboard_summary_response(data)

    else:
        answer = (
            "I can help you find top loan prospects, explain a customer, "
            "summarize dashboard insights, or suggest whom to contact today. "
            "Try asking: 'Explain customer CUST00001' or "
            "'Show top Home Loan prospects'."
        )

    return {
        "intent": intent,
        "answer": answer,
    }
