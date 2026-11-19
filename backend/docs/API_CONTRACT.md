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

## Transposition execution

`POST /algorithms/transposition/execute` accepts:

```json
{"operation":"encrypt","inputs":{"text":"ABCD","key":[3,1,4,2]},"options":{"show_steps":true}}
```

The key contains each position from 1 to its length exactly once. Each entry
selects the 1-based input position for the corresponding output position.
Text is normalized to uppercase English letters; encryption pads incomplete
blocks with X. Decryption requires complete blocks and retains padding.
The success envelope contains `output_text` (`CADB` for this example),
`effective_key`, `blocks`, `preparation`, and `execution_steps`.

## RC4 execution (educational)

`POST /algorithms/rc4/execute` accepts:

```json
{"operation":"encrypt","inputs":{"text":"Plaintext","key":"Key"},"options":{"show_steps":true}}
```

`operation` is `encrypt` or `decrypt`. Encryption takes UTF-8 text and returns
uppercase hexadecimal ciphertext in `data.output_text` (`BBF316E8D940AF0AD3`
for this example). Decryption takes hexadecimal ciphertext (whitespace is
allowed) and returns UTF-8 text using the same key. Invalid UTF-8 output produces
a 422 error. RC4 provides no authentication; a wrong key is not guaranteed to
produce an error. Keys contain 1–256 UTF-8 bytes; input is limited to 32,768 bytes
after encoding or hex decoding. No keystream bytes are dropped.

The success envelope also contains `output_hex`, `output_encoding`, `operation`,
`byte_count`, `execution_steps`, `steps_truncated`, and `educational_note`.
Each execution step contains `step`, `input_hex`, `keystream_hex`, and
`output_hex`. At most 256 steps are returned; the full input is always processed.
`options.show_steps` defaults to true; false returns an empty steps list.
Invalid input uses the standard 422 error envelope. RC4 is obsolete and unsafe
for real-world security.

Keystream correctness is tested against [RFC 6229, section 2](https://www.rfc-editor.org/rfc/rfc6229.html#section-2).
