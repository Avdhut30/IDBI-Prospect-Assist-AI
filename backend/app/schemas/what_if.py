from pydantic import BaseModel


class WhatIfRequest(BaseModel):
    customer_id: str
    income_change: float = 0
    emi_change: float = 0
