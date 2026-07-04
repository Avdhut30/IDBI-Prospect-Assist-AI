from fastapi import FastAPI

app = FastAPI(
    title="Prospect Assist AI",
    version="1.0.0",
    description="AI-powered Loan Prospect Identification System",
)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Welcome to Prospect Assist AI "}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "Healthy"}
