from fastapi import APIRouter, HTTPException

from app.registry.algorithm_registry import ALGORITHMS, CATEGORIES
from app.schemas.response import SuccessResponse

router = APIRouter()


@router.get("/algorithms", response_model=SuccessResponse, summary="List algorithms")
def list_algorithms(category: str | None = None, unit: int | None = None):
    items = ALGORITHMS
    if category:
        items = [item for item in items if item["category"] == category]
    if unit:
        items = [item for item in items if item["unit"] == unit]

    return SuccessResponse(
        data=items,
        metadata={"count": len(items)},
    )


@router.get("/algorithms/{slug}", response_model=SuccessResponse, summary="Get algorithm")
def get_algorithm(slug: str):
    item = next((entry for entry in ALGORITHMS if entry["slug"] == slug), None)
    if item is None:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "ALGORITHM_NOT_FOUND",
                "message": f"No algorithm with slug '{slug}' exists in the catalog.",
            },
        )
    return SuccessResponse(data=item, metadata={})


@router.get("/categories", response_model=SuccessResponse, summary="List categories")
def list_categories():
    return SuccessResponse(
        data=CATEGORIES,
        metadata={"count": len(CATEGORIES)},
    )
