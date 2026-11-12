# CRYPTOLAB API Contract — v1

## Base URL
`http://localhost:8000/api/v1`

## Endpoints in the foundation release

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/algorithms` | List catalog entries |
| GET | `/algorithms?category=classical` | Filter by category |
| GET | `/algorithms?unit=1` | Filter by syllabus unit |
| GET | `/algorithms/{slug}` | Retrieve one catalog entry |
| GET | `/categories` | List categories |

## Success envelope

```json
{
  "success": true,
  "data": {},
  "metadata": {}
}
```

`data` may be an object or an array depending on the endpoint.

## Error envelope

All handled HTTP and request-validation errors use:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more request fields are invalid.",
    "details": []
  }
}
```

The frontend must handle non-2xx responses and must not assume `details` is always present.

## Catalog item

```json
{
  "id": "caesar",
  "name": "Caesar Cipher",
  "slug": "caesar",
  "category": "classical",
  "unit": 1,
  "description": "A substitution cipher...",
  "operations": ["encrypt", "decrypt"],
  "available": false
}
```

`available` remains `false` until the corresponding execution API and tests are implemented. The frontend should display unavailable entries as catalogue/theory items but must not offer a working execution action for them.

## Next contract addition
The next milestone adds:
`POST /algorithms/caesar/execute`

The request and response schema will be documented here before frontend integration.
