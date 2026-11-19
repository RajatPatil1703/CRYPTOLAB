from fastapi import APIRouter

from app.api.v1.endpoints import (
    health,
    catalog,
    caesar,
    monoalphabetic,
    playfair,
    hill,
    transposition,
    rc4,
)


router = APIRouter()
router.include_router(rc4.router, tags=["RC4"])

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

router.include_router(
    playfair.router,
    tags=["Playfair Cipher"]
)

router.include_router(
    hill.router,
    tags=["Hill Cipher"]
)

router.include_router(
    transposition.router,
    tags=["Transposition Cipher"]
)
