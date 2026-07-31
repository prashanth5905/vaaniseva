from fastapi import FastAPI

from app.api.routes.chat import router as chat_router
from app.api.routes.system import router as system_router
from app.api.routes.citizen import router as citizen_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for the VaaniSeva government service assistant.",
    version=settings.APP_VERSION,
)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "VaaniSeva API is running"
    }


app.include_router(
    system_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    chat_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    citizen_router,
    prefix=settings.API_V1_PREFIX,
)