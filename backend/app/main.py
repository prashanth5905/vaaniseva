from fastapi import FastAPI

app = FastAPI(
    title="VaaniSeva API",
    description="Backend API for the VaaniSeva government service assistant.",
    version="0.1.0",
)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "VaaniSeva API is running"
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "healthy"
    }