# 🏦 Prospect Assist AI

### AI-Powered Banking Relationship Manager Copilot

<p align="center">
  <img alt="Python 3.11" src="https://img.shields.io/badge/Python-3.11-blue">
  <img alt="FastAPI Backend" src="https://img.shields.io/badge/FastAPI-Backend-009688">
  <img alt="React Frontend" src="https://img.shields.io/badge/React-Frontend-61DAFB">
  <img alt="Google Gemini AI" src="https://img.shields.io/badge/Gemini-AI-orange">
  <img alt="MIT License" src="https://img.shields.io/badge/License-MIT-green">
</p>

---

# 🚀 Overview

**Prospect Assist AI** is an AI-powered decision-support platform developed for the **IDBI Bank Hackathon**.

It helps **Relationship Managers (RMs)** identify high-value prospects, recommend suitable banking products, simulate financial scenarios, generate explainable AI insights, and improve customer engagement through an intelligent banking copilot.

This solution combines **Machine Learning**, **Business Intelligence**, **Explainable AI (XAI)**, and **Generative AI (Google Gemini)** to help relationship managers make faster and more informed decisions.

---

# 👥 Team

**Team Name:** RealPred

---

# 🎯 Problem Statement

Relationship Managers handle thousands of customer accounts every day.

Challenges include:

- Identifying high-potential customers
- Choosing the right banking product
- Understanding why a customer is recommended
- Prioritizing follow-ups
- Generating executive summaries
- Making faster lending decisions

Prospect Assist AI solves these challenges using artificial intelligence.

---

# 💡 Solution

Prospect Assist AI analyzes customer financial behaviour and provides:

- Prospect Intelligence Score
- AI-powered Recommendations
- Customer 360° Profile
- Executive Morning Brief
- What-if Financial Simulation
- AI Banking Copilot
- CSV Batch Analysis
- PDF Customer Reports

---

# ✨ Key Features

## 📊 Executive Dashboard

- Business KPIs
- AI Executive Brief
- Loan Distribution
- Risk Analysis
- City Opportunity
- AI Insights

## 👥 Prospect Explorer

- Customer Ranking
- Search and Filter
- Prospect Score
- Risk Classification

## 👤 Customer 360°

- Complete Customer Profile
- Financial Timeline
- AI Explanation
- Cross-Sell Opportunities
- Export PDF Report

## 🤖 AI Copilot

Powered by Google Gemini.

Supports natural-language queries such as:

- Who should I contact today?
- Explain customer CUST00001
- Show Home Loan prospects
- Give executive summary

## 📈 What-if Analysis

Simulate:

- Income increase
- EMI reduction

Observe:

- Prospect Score
- Risk
- Recommendation

## 📂 CSV Upload

Upload customer datasets for:

- Validation
- Batch Prospect Analysis
- Recommendation Generation

## 📄 PDF Reports

Generate professional customer reports containing:

- Customer Summary
- Prospect Score
- Recommendation
- AI Explanation
- Relationship Manager Notes

---

# 🧠 AI Technologies Used

- Machine Learning
- Explainable AI (XAI)
- Google Gemini
- Rule-based Recommendation Engine
- Financial Intelligence Engine

---

# 🏗️ System Architecture

```text
                 React Frontend

  Dashboard · Prospect Explorer · Customer 360
       AI Copilot · Upload · PDF Reports

                        │
                        ▼

                    REST API

                        │
                        ▼

                  FastAPI Backend

  Customer APIs · Analytics APIs · AI Engine
             Reports · Upload Processing

                        │
                        ▼

           Prospect Intelligence Layer

  Machine Learning · Recommendation Engine
 Explainability · What-if Analysis · Executive Brief

                        │
                        ▼

            Synthetic Banking Dataset
```

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Recharts
- Axios
- Lucide Icons

## Backend

- FastAPI
- Python
- Pandas
- NumPy
- Scikit-Learn
- Joblib
- ReportLab
- Google Gemini API

---

# 📸 Screenshots

Product screenshots:

- Dashboard
- Executive Brief
- Prospect Explorer
- Customer 360°
- AI Copilot
- CSV Upload
- What-if Analysis

---

# 🌐 Live Demo

## Frontend

**https://idbi-prospect-assist-ai.vercel.app/**

## Backend

**https://idbi-prospect-assist-ai.onrender.com/**

API Documentation:

**https://idbi-prospect-assist-ai.onrender.com/docs**

---

# ⚙️ Installation

## Clone

```bash
git clone https://github.com/Avdhut30/IDBI-Prospect-Assist-AI.git
cd IDBI-Prospect-Assist-AI
```

## Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Set the backend Gemini key in your local `backend/.env` file or deployment environment:

```env
GEMINI_API_KEY=your_key
```

Set the frontend API endpoint:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Never commit real API keys or other secrets.

---

# 📌 Future Enhancements

- Real Core Banking Integration
- Authentication and Role-Based Access
- PostgreSQL Database
- RAG over Banking Policies
- Voice-enabled AI Assistant
- Predictive Portfolio Analytics
- Mobile Application

---

# 🏆 Hackathon

Developed for the **IDBI Bank Hackathon 2026**

---

# 👨‍💻 Developed By

**Team RealPred**

AI-powered Banking Intelligence Platform
