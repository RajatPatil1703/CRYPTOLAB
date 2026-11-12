# CRYPTOLAB Backend

FastAPI foundation for the CRYPTOLAB educational cryptography platform.

## Requirements
- Python 3.10+
- pip

## Setup

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open:
- API docs: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json
- Health: http://localhost:8000/api/v1/health
- Algorithm catalog: http://localhost:8000/api/v1/algorithms

## Current scope
This is the foundation milestone:
- FastAPI application and configuration
- Versioned API router (`/api/v1`)
- Health endpoint
- Algorithm catalog and category endpoints
- Standard success/error response envelopes
- CORS configuration
- Initial tests

Algorithm execution is intentionally not exposed until each implementation and its tests are ready. The next milestone is the Caesar Cipher execution module.

## Contract rules
- API base path: `/api/v1`
- Success envelope: `{"success": true, "data": ..., "metadata": ...}`
- Error envelope: `{"success": false, "error": {"code": "...", "message": "...", "details": ...}}`
- Do not change endpoint names or response shapes without updating `docs/API_CONTRACT.md` and coordinating with the frontend team.
