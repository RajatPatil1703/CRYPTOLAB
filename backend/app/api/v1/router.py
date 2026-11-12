from fastapi import APIRouter

from app.api.v1.endpoints import health, catalog, caesar, monoalphabetic


router = APIRouter()

router.include_router(
    health.router,
    prefix="/health",
    tags=["health"]
)

router.include_router(
    catalog.router,
    tags=["catalog"]
)

router.include_router(
    caesar.router,
    tags=["Caesar Cipher"]
)

router.include_router(
    monoalphabetic.router,
    tags=["Monoalphabetic Cipher"]
)