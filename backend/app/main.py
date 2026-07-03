from fastapi import FastAPI

app = FastAPI(
    title="ProspectAssistAI API",
    description="API for prospect scoring and sales assistance.",
    version="0.1.0",
)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "ProspectAssistAI API is running"}


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}
