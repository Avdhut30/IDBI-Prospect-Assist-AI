# Synthetic Banking Dataset

The dataset is generated with a fixed random seed and contains no real customer
information. Run the generator from the project root:

```powershell
backend\venv\Scripts\python.exe dataset\generate_synthetic_banking_data.py
```

## Data dictionary

| Group | Fields | Description |
| --- | --- | --- |
| Identifier | `customer_id` | Unique synthetic customer key |
| Demographics | `age`, `gender`, `marital_status`, `dependents`, `education`, `employment_type`, `city_tier` | Customer profile fields |
| Income | `monthly_income`, `salary_consistency_score` | Income capacity and regularity |
| Bank relationship | `years_with_bank`, `avg_monthly_balance` | Relationship tenure and typical balance |
| Transactions | `monthly_credit_amount`, `monthly_debit_amount`, `monthly_transaction_count` | Aggregated monthly account behavior |
| Credit and debt | `emi_obligations`, `debt_to_income_ratio`, `credit_utilization_ratio`, `cibil_score`, `active_loans`, `missed_payments_12m` | Repayment capacity and credit behavior |
| Investments | `monthly_investment_amount`, `investment_value`, `has_fixed_deposit`, `has_mutual_fund` | Saving and investment behavior |
| Digital activity | `digital_logins_30d`, `upi_transactions_30d`, `mobile_banking_user` | Recent digital engagement |
| Loan interest | `loan_product_interest`, `loan_amount_requested`, `loan_tenure_months` | Product and requested terms |
| Target | `loan_accepted` | `1` when the simulated customer accepts the offer, otherwise `0` |

## Modeling notes

- `loan_accepted` is sampled from a probability model instead of a rigid rule,
  which keeps the classification problem realistic.
- The target equation uses financial health, bank relationship, digital
  engagement, and product interest. Protected demographic fields are not used
  directly to generate the label.
- Demographic fields should be excluded from production scoring or reviewed
  with fairness metrics before use.
- The dataset is suitable for experimentation, not for making real lending or
  eligibility decisions.

