from fastapi import FastAPI

from app.api.routes.system import router as system_router
from app.api.routes.chat import router as chat_router

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


app.include_router(
    system_router,
    prefix="/api/v1",
)

app.include_router(
    chat_router,
    prefix="/api/v1",
)