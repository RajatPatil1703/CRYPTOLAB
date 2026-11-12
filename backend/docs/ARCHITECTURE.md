# CRYPTOLAB Architecture

## Responsibilities
- Frontend (React): UI, input collection, rendering API results and execution traces.
- Backend (FastAPI): validation, algorithm execution, execution trace generation and catalog API.
- Tests: verify algorithm correctness and API contracts.

## Principles
1. Backend is the source of truth for algorithm calculations.
2. Each algorithm has isolated implementation logic.
3. API contracts are versioned and documented.
4. Catalog entries are not marked available until implemented and tested.
5. Protocol topics use educational workflow simulations where appropriate; they are not misrepresented as single encryption functions.
6. Obsolete algorithms are labelled educational-only.

## Request flow
React UI -> Axios -> `/api/v1` -> endpoint -> service/algorithm module -> structured response -> React rendering.
