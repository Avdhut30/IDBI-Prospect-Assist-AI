import re

import pandas as pd

from ..services.analytics import get_dashboard_summary
from ..services.customer_data import get_customer_by_id, load_customers
from ..services.explanation import generate_customer_explanation
from ..services.intelligence import calculate_prospect_intelligence
from ..services.recommendation import recommend_loan_product
from ..services.scoring import predict_customer_score

CUSTOMER_ID_PATTERN = re.compile(r"\bCUST\d+\b", re.IGNORECASE)

PRODUCT_ALIASES = {
    "Home Loan": ["home loan", "housing loan", "house loan"],
    "Auto Loan": ["auto loan", "car loan", "vehicle loan"],
    "Personal Loan": ["personal loan"],
    "Mortgage Loan": ["mortgage loan", "secured loan"],
}

METRIC_ALIASES = [
    ("prospect_score", "Prospect Score", ["prospect score", "lead score"]),
    ("cibil_score", "CIBIL Score", ["cibil", "credit score"]),
    ("monthly_income", "Monthly Income", ["income", "salary", "monthly income"]),
    ("existing_emi", "Existing EMI", ["emi", "existing emi"]),
    ("foir", "FOIR", ["foir", "emi burden"]),
    ("savings_ratio", "Savings Ratio", ["savings ratio", "saving ratio", "savings"]),
    ("avg_monthly_balance", "Average Monthly Balance", ["balance", "avg balance"]),
    ("monthly_expense", "Monthly Expense", ["expense", "monthly expense"]),
    ("credit_card_spend", "Credit Card Spend", ["credit card spend", "card spend"]),
    (
        "digital_activity_score",
        "Digital Activity Score",
        ["digital score", "digital activity"],
    ),
    ("account_tenure_months", "Account Tenure", ["tenure", "account tenure"]),
    ("age", "Age", ["age"]),
]

DIMENSION_ALIASES = [
    ("city", "City", ["city", "location"]),
    ("recommended_loan", "Recommended Loan", ["product", "loan", "recommended loan"]),
    ("risk_level", "Risk Level", ["risk", "risk level"]),
    ("employment_type", "Employment Type", ["employment", "job type"]),
    ("account_type", "Account Type", ["account", "account type"]),
]


def answer_data_question(question: str):
    q = question.strip()

    if not q:
        return {
            "intent": "help",
            "answer": _capability_response(),
        }

    df = _prepare_dataframe(load_customers())
    lowered = _normalize_question(q)
    customer_ids = _extract_customer_ids(q)

    if _asks_for_columns(lowered):
        return {
            "intent": "data_dictionary",
            "answer": _data_dictionary_response(df),
        }

    if customer_ids:
        return _answer_customer_question(q, lowered, customer_ids, df)

    if _asks_for_dashboard_summary(lowered):
        return {
            "intent": "dashboard_summary",
            "answer": _dashboard_summary_response(),
        }

    if _asks_for_distribution(lowered) or (
        _asks_for_count(lowered) and _detect_dimension(lowered)
    ):
        return _answer_distribution_question(lowered, df)

    if _asks_for_average_or_total(lowered):
        return _answer_aggregate_question(lowered, df)

    if _asks_for_count(lowered):
        return _answer_count_question(lowered, df)

    if (
        _asks_for_top_or_bottom(lowered)
        or _asks_for_list(lowered)
        or "prospect" in lowered
        or _has_data_filter(lowered, df)
    ):
        return _answer_ranked_list_question(lowered, df)

    if (
        "contact" in lowered
        or "follow" in lowered
        or "priority" in lowered
        or "call" in lowered
    ):
        return _answer_priority_question(df)

    return {
        "intent": "data_assistant",
        "answer": _general_data_response(df),
    }


def _prepare_dataframe(df: pd.DataFrame):
    prepared = df.copy()

    if "customer_id" in prepared:
        prepared["customer_id"] = prepared["customer_id"].astype(str).str.upper()

    prepared["risk_level"] = "High"

    low_risk = (prepared["foir"] < 0.35) & (prepared["cibil_score"] >= 700)
    medium_risk = (
        (prepared["foir"] >= 0.35)
        & (prepared["foir"] < 0.5)
        & (prepared["cibil_score"] >= 650)
    )

    prepared.loc[medium_risk, "risk_level"] = "Medium"
    prepared.loc[low_risk, "risk_level"] = "Low"

    return prepared


def _normalize_question(question: str):
    return re.sub(r"[-_]+", " ", question.lower())


def _extract_customer_ids(question: str):
    return [match.upper() for match in CUSTOMER_ID_PATTERN.findall(question)]


def _answer_customer_question(question: str, lowered: str, customer_ids: list[str], df):
    if len(customer_ids) > 1 or "compare" in lowered:
        return {
            "intent": "customer_comparison",
            "answer": _compare_customers(customer_ids, df),
        }

    customer_id = customer_ids[0]
    customer = get_customer_by_id(customer_id)

    if customer is None:
        sample_ids = ", ".join(df["customer_id"].head(5).astype(str).tolist())
        return {
            "intent": "customer_not_found",
            "answer": (
                f"Customer {customer_id} was not found in the active dataset.\n\n"
                f"Available sample customer IDs: {sample_ids}"
            ),
        }

    requested_metrics = _detect_requested_metrics(lowered)

    if requested_metrics:
        return {
            "intent": "customer_field_lookup",
            "answer": _customer_field_response(customer, requested_metrics),
        }

    intelligence = calculate_prospect_intelligence(customer)
    recommendation = recommend_loan_product(customer, intelligence)
    explanation = generate_customer_explanation(
        customer,
        intelligence,
        recommendation,
    )
    prediction = predict_customer_score(customer)

    reasons = "\n".join(f"- {reason}" for reason in explanation["key_reasons"])

    return {
        "intent": "customer_explanation",
        "answer": f"""
Customer {customer['customer_id']} profile:

- City: {customer['city']}
- Employment: {customer['employment_type']}
- Monthly Income: {_format_money(customer['monthly_income'])}
- CIBIL Score: {customer['cibil_score']}
- FOIR: {customer['foir']}
- Savings Ratio: {customer['savings_ratio']}
- Dashboard Prospect Score: {customer.get('prospect_score', prediction['lead_score'])}/100
- ML Lead Score: {prediction['lead_score']}/100
- Risk Level: {prediction['risk_level']}
- Recommended Product: {prediction['recommended_loan']}
- Relationship Priority: {recommendation['priority']}

Why this customer?
{reasons}

Relationship Manager Note:
{explanation['relationship_manager_note']}

Suggested Action:
{explanation['recommended_action']}
""".strip(),
    }


def _customer_field_response(customer: dict, metrics: list[tuple[str, str]]):
    lines = [f"Customer {customer['customer_id']} data:"]

    for column, label in metrics:
        value = customer.get(column, "N/A")
        lines.append(f"- {label}: {_format_value(column, value)}")

    return "\n".join(lines)


def _compare_customers(customer_ids: list[str], df):
    records = df[df["customer_id"].isin(customer_ids)]
    missing = [
        customer_id
        for customer_id in customer_ids
        if customer_id not in set(records["customer_id"])
    ]

    if records.empty:
        return "None of those customer IDs were found in the active dataset."

    lines = ["Customer comparison:"]

    for _, row in records.iterrows():
        lines.append(
            "\n".join(
                [
                    f"- {row['customer_id']}",
                    f"  City: {row['city']}",
                    f"  Prospect Score: {row.get('prospect_score', 'N/A')}",
                    f"  CIBIL Score: {row['cibil_score']}",
                    f"  Monthly Income: {_format_money(row['monthly_income'])}",
                    f"  FOIR: {row['foir']}",
                    f"  Risk Level: {row['risk_level']}",
                    f"  Recommended Loan: {row.get('recommended_loan', 'N/A')}",
                ]
            )
        )

    if missing:
        lines.append(f"\nNot found: {', '.join(missing)}")

    return "\n\n".join(lines)


def _answer_count_question(lowered: str, df):
    filtered, filters = _apply_filters(lowered, df)
    description = _filter_description(filters)

    return {
        "intent": "count_query",
        "answer": (
            f"{len(filtered)} customer(s) match {description}.\n\n"
            f"Total active dataset size: {len(df)} customer(s)."
        ),
    }


def _answer_aggregate_question(lowered: str, df):
    metric = _detect_metric(lowered) or ("monthly_income", "Monthly Income")
    dimension = _detect_dimension(lowered)
    filtered, filters = _apply_filters(lowered, df)

    if filtered.empty:
        return {
            "intent": "aggregate_query",
            "answer": f"No customers matched {_filter_description(filters)}.",
        }

    if dimension and " by " in lowered:
        grouped = (
            filtered.groupby(dimension[0])[metric[0]]
            .mean()
            .sort_values(ascending=False)
            .head(10)
        )

        lines = [f"Average {metric[1]} by {dimension[1]}:"]

        for name, value in grouped.items():
            lines.append(f"- {name}: {_format_value(metric[0], round(value, 2))}")

        return {
            "intent": "grouped_average_query",
            "answer": "\n".join(lines),
        }

    if "total" in lowered or "sum" in lowered:
        value = filtered[metric[0]].sum()
        label = f"Total {metric[1]}"
    else:
        value = filtered[metric[0]].mean()
        label = f"Average {metric[1]}"

    return {
        "intent": "aggregate_query",
        "answer": (
            f"{label} for {_filter_description(filters)} is "
            f"{_format_value(metric[0], round(value, 2))}."
        ),
    }


def _answer_distribution_question(lowered: str, df):
    dimension = _detect_dimension(lowered) or ("recommended_loan", "Recommended Loan")
    filtered, filters = _apply_filters(lowered, df)

    if filtered.empty:
        return {
            "intent": "distribution_query",
            "answer": f"No customers matched {_filter_description(filters)}.",
        }

    counts = filtered[dimension[0]].value_counts().head(10)
    lines = [
        f"{dimension[1]} distribution for {_filter_description(filters)}:",
    ]

    for name, count in counts.items():
        lines.append(f"- {name}: {int(count)}")

    return {
        "intent": "distribution_query",
        "answer": "\n".join(lines),
    }


def _answer_ranked_list_question(lowered: str, df):
    metric = _detect_metric(lowered) or ("prospect_score", "Prospect Score")
    ascending = _asks_for_bottom(lowered) or metric[0] == "foir" and "low" in lowered
    limit = _extract_limit(lowered)
    filtered, filters = _apply_filters(lowered, df)

    if "prospect" in lowered or "lead" in lowered:
        filtered = filtered[filtered["loan_accepted"] == 1]

    if filtered.empty:
        return {
            "intent": _ranked_intent(lowered),
            "answer": f"No customers matched {_filter_description(filters)}.",
        }

    ranked = filtered.sort_values(metric[0], ascending=ascending).head(limit)

    title_direction = "Lowest" if ascending else "Top"
    lines = [
        f"{title_direction} {len(ranked)} customers by {metric[1]} "
        f"for {_filter_description(filters)}:"
    ]
    lines.extend(_format_customer_rows(ranked, score_column=metric[0]))

    return {
        "intent": _ranked_intent(lowered),
        "answer": "\n\n".join(lines),
    }


def _answer_priority_question(df):
    priority = df[
        (df["loan_accepted"] == 1)
        & (df["prospect_score"] >= 75)
        & (df["cibil_score"] >= 700)
        & (df["foir"] < 0.35)
    ]

    if priority.empty:
        priority = df[df["loan_accepted"] == 1]

    ranked = priority.sort_values(
        ["prospect_score", "cibil_score", "monthly_income"],
        ascending=False,
    ).head(5)

    lines = ["Highest priority customers to contact today:"]
    lines.extend(_format_customer_rows(ranked))

    return {
        "intent": "daily_priority",
        "answer": "\n\n".join(lines),
    }


def _dashboard_summary_response():
    summary = get_dashboard_summary()

    loan_lines = "\n".join(
        f"- {product}: {count}"
        for product, count in summary["loan_distribution"].items()
    )
    city_lines = "\n".join(
        f"- {city}: {count}"
        for city, count in list(summary["city_distribution"].items())[:8]
    )

    return f"""
Executive data summary:

- Total Customers: {summary['total_customers']}
- High Potential Prospects: {summary['total_prospects']}
- Conversion Potential: {summary['conversion_potential_percent']}%
- High Risk Customers: {summary['high_risk_customers']}
- Average Income: {_format_money(summary['average_income'])}
- Average CIBIL Score: {summary['average_cibil']}

Loan Distribution:
{loan_lines}

Top City Opportunities:
{city_lines}
""".strip()


def _general_data_response(df):
    top_customers = df.sort_values("prospect_score", ascending=False).head(3)
    lines = [
        "I can answer questions directly from the active customer dataset.",
        "",
        f"Active dataset contains {len(df)} customers.",
        f"Available customer ID examples: {', '.join(df['customer_id'].head(5).tolist())}",
        "",
        "Try asking:",
        "- What is the CIBIL score of CUST10001?",
        "- Show top 5 Home Loan prospects in Pune",
        "- How many high-risk customers are there?",
        "- Average income by city",
        "- Compare CUST10001 and CUST10002",
        "",
        "Current top customers by prospect score:",
    ]
    lines.extend(_format_customer_rows(top_customers))
    return "\n".join(lines)


def _data_dictionary_response(df):
    columns = ", ".join(df.columns.tolist())

    return f"""
The active dataset has {len(df)} customers and these fields:

{columns}

Sample customer IDs: {', '.join(df['customer_id'].head(8).tolist())}
""".strip()


def _capability_response():
    return """
Ask me anything about the active customer data.

Examples:
- Explain customer CUST10001
- What is the monthly income of CUST10001?
- Show top 10 customers by CIBIL score
- How many Personal Loan prospects are in Mumbai?
- Average income by city
- Compare CUST10001 and CUST10002
""".strip()


def _apply_filters(lowered: str, df):
    filtered = df
    filters = []

    product = _detect_product(lowered)
    if product:
        filtered = filtered[filtered["recommended_loan"].str.lower() == product.lower()]
        filters.append(f"recommended loan = {product}")

    city = _detect_city(lowered, df)
    if city:
        filtered = filtered[filtered["city"].str.lower() == city.lower()]
        filters.append(f"city = {city}")

    risk = _detect_risk(lowered)
    if risk:
        filtered = filtered[filtered["risk_level"].str.lower() == risk.lower()]
        filters.append(f"risk = {risk}")

    employment = _detect_value(lowered, df, "employment_type")
    if employment:
        filtered = filtered[
            filtered["employment_type"].str.lower() == employment.lower()
        ]
        filters.append(f"employment = {employment}")

    account_type = _detect_value(lowered, df, "account_type")
    if account_type:
        filtered = filtered[
            filtered["account_type"].str.lower() == account_type.lower()
        ]
        filters.append(f"account type = {account_type}")

    if "high priority" in lowered:
        filtered = filtered[
            (filtered["loan_accepted"] == 1) & (filtered["prospect_score"] >= 75)
        ]
        filters.append("high priority prospects")
    elif "prospect" in lowered or "lead" in lowered or "eligible" in lowered:
        filtered = filtered[filtered["loan_accepted"] == 1]
        filters.append("loan accepted prospects")

    if "immediate follow" in lowered or "contact today" in lowered:
        filtered = filtered[
            (filtered["cibil_score"] >= 720) & (filtered["foir"] < 0.35)
        ]
        filters.append("strong CIBIL and low FOIR")

    return filtered, filters


def _has_data_filter(lowered: str, df):
    return bool(
        _detect_product(lowered)
        or _detect_city(lowered, df)
        or _detect_risk(lowered)
        or _detect_value(lowered, df, "employment_type")
        or _detect_value(lowered, df, "account_type")
        or "high priority" in lowered
    )


def _detect_product(lowered: str):
    for product, aliases in PRODUCT_ALIASES.items():
        if any(alias in lowered for alias in aliases):
            return product
    return None


def _detect_city(lowered: str, df):
    cities = sorted(df["city"].dropna().unique().tolist(), key=len, reverse=True)

    for city in cities:
        if city.lower() in lowered:
            return city

    return None


def _detect_risk(lowered: str):
    if "low risk" in lowered:
        return "Low"
    if "medium risk" in lowered:
        return "Medium"
    if "high risk" in lowered or "risky" in lowered:
        return "High"
    return None


def _detect_value(lowered: str, df, column: str):
    values = sorted(
        df[column].dropna().astype(str).unique().tolist(), key=len, reverse=True
    )

    for value in values:
        if value.lower() in lowered:
            return value

    return None


def _detect_requested_metrics(lowered: str):
    metrics = []

    for column, label, aliases in METRIC_ALIASES:
        if any(alias in lowered for alias in aliases):
            metrics.append((column, label))

    for column, label, aliases in DIMENSION_ALIASES:
        if any(alias in lowered for alias in aliases):
            metrics.append((column, label))

    return metrics


def _detect_metric(lowered: str):
    for column, label, aliases in METRIC_ALIASES:
        if any(alias in lowered for alias in aliases):
            return column, label
    return None


def _detect_dimension(lowered: str):
    for column, label, aliases in DIMENSION_ALIASES:
        if any(
            f"by {alias}" in lowered or f"{alias} wise" in lowered for alias in aliases
        ):
            return column, label

    if "risk distribution" in lowered:
        return "risk_level", "Risk Level"
    if "city distribution" in lowered:
        return "city", "City"
    if "loan distribution" in lowered or "product distribution" in lowered:
        return "recommended_loan", "Recommended Loan"

    return None


def _extract_limit(lowered: str):
    match = re.search(r"\b(?:top|first|show|list|lowest|bottom)\s+(\d+)\b", lowered)

    if match:
        return max(1, min(int(match.group(1)), 20))

    return 5


def _format_customer_rows(rows, score_column="prospect_score"):
    lines = []

    for index, (_, row) in enumerate(rows.iterrows(), start=1):
        customer_lines = [
            f"{index}. {row['customer_id']}",
            f"   City: {row['city']}",
            f"   Prospect Score: {row.get('prospect_score', 'N/A')}",
        ]

        if score_column not in {"prospect_score", "cibil_score", "monthly_income"}:
            customer_lines.append(
                f"   {_display_metric_label(score_column)}: "
                f"{_format_value(score_column, row.get(score_column, 'N/A'))}"
            )

        customer_lines.extend(
            [
                f"   CIBIL Score: {row['cibil_score']}",
                f"   Monthly Income: {_format_money(row['monthly_income'])}",
                f"   Risk Level: {row['risk_level']}",
                f"   Recommended Loan: {row.get('recommended_loan', 'N/A')}",
            ]
        )

        lines.append("\n".join(customer_lines))

    return lines


def _ranked_intent(lowered: str):
    product = _detect_product(lowered)

    if product == "Home Loan":
        return "home_loan_prospects"
    if product == "Auto Loan":
        return "auto_loan_prospects"
    if product == "Personal Loan":
        return "personal_loan_prospects"

    return "ranked_customer_query"


def _display_metric_label(column: str):
    for metric_column, label, _ in METRIC_ALIASES:
        if metric_column == column:
            return label

    for dimension_column, label, _ in DIMENSION_ALIASES:
        if dimension_column == column:
            return label

    return column.replace("_", " ").title()


def _format_money(value):
    return f"Rs. {round(float(value), 2):,.2f}"


def _format_value(column: str, value):
    if value == "N/A":
        return value

    if column in {
        "monthly_income",
        "existing_emi",
        "avg_monthly_balance",
        "monthly_expense",
        "credit_card_spend",
    }:
        return _format_money(value)

    if column in {"foir", "savings_ratio", "salary_consistency"}:
        return round(float(value), 2)

    return value


def _filter_description(filters: list[str]):
    if not filters:
        return "all active customers"

    return ", ".join(filters)


def _asks_for_columns(lowered: str):
    return any(
        phrase in lowered
        for phrase in [
            "what data",
            "which data",
            "columns",
            "fields",
            "dataset schema",
            "available data",
        ]
    )


def _asks_for_dashboard_summary(lowered: str):
    return any(
        phrase in lowered for phrase in ["dashboard", "summary", "overview", "insight"]
    )


def _asks_for_distribution(lowered: str):
    return any(
        phrase in lowered
        for phrase in ["distribution", "breakdown", "split", "segmentation"]
    )


def _asks_for_average_or_total(lowered: str):
    return any(
        phrase in lowered
        for phrase in ["average", "avg", "mean", "total", "sum", "by city", "by risk"]
    )


def _asks_for_count(lowered: str):
    return any(phrase in lowered for phrase in ["how many", "count", "number of"])


def _asks_for_top_or_bottom(lowered: str):
    return any(
        phrase in lowered
        for phrase in ["top", "best", "highest", "lowest", "bottom", "least"]
    )


def _asks_for_bottom(lowered: str):
    return any(phrase in lowered for phrase in ["lowest", "bottom", "least"])


def _asks_for_list(lowered: str):
    return any(phrase in lowered for phrase in ["show", "list", "find", "give me"])
