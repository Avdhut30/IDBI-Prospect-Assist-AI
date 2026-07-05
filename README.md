# IDBI Prospect Assist AI

An AI-powered loan prospect identification system for banking teams.

## Problem Statement

Banks often face low conversion rates while offering retail loans because they lack deep insights into customer intent, repayment capacity, and product suitability.

## Solution

Prospect Assist AI analyzes customer financial behavior and predicts high-quality loan prospects for Personal Loan, Home Loan, Mortgage Loan, and Auto Loan.

## Tech Stack

- Python
- FastAPI
- Machine Learning
- React
- Tailwind CSS
- SQLite
- SHAP Explainability

## Project Status

Development started.

## Run the backend

From the repository root in Git Bash:

```bash
./backend/venv/Scripts/python.exe -m uvicorn backend.app.main:app --reload --reload-dir backend/app
```

In PowerShell:

```powershell
.\backend\venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --reload-dir backend/app
```

Using the backend virtual environment ensures installed dependencies such as
ReportLab are available. Restricting reloads to `backend/app` prevents changes
inside `backend/venv` from triggering unnecessary server restarts.

Backend modules use package-relative imports (for example,
`from .services.scoring import predict_customer_score`). This keeps the import
root consistent with `backend.app.main`.
