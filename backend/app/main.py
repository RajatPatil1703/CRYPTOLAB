from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings
from app.core.error_handlers import register_error_handlers

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend API for CRYPTOLAB, an interactive Cryptography and "
        "Network Security learning and simulation platform."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)
register_error_handlers(app)


@app.get("/", tags=["root"])
def root():
    return {
        "success": True,
        "data": {
            "name": settings.app_name,
            "version": settings.app_version,
            "docs": "/docs",
            "api_base": settings.api_v1_prefix,
        },
        "metadata": {},
    }
