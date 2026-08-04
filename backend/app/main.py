from fastapi import FastAPI
from app.api.routes.chat import router as chat_router
from app.api.routes.system import router as system_router
from app.api.routes.citizen import router as citizen_router
from app.core.config import settings
from app.api.routes import otp
from app.api.routes.auth import router as auth_router
from app.api.routes.profile import router as profile_router
from app.api.routes.application import router as application_router
from app.api.routes.admin import router as admin_router
from app.api.routes import (
    admin,
    application,
    auth,
    chat,
    citizen,
    document,
    otp,
    profile,
    system,
)
from fastapi.middleware.cors import CORSMiddleware

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

app.include_router(otp.router)

app.include_router(
    auth_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    profile_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    application_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(
    admin_router,
    prefix=settings.API_V1_PREFIX,
)

app.include_router(document.router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)