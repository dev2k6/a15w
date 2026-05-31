---
name: "api_contract_validation"
description: "Validates API implementations against OpenAPI/Swagger specs and ensures contract compliance. Invoke when implementing APIs, reviewing API changes, or validating integrations."
---

# SKILL: API Contract Validation

## 🎯 Objective
Ensure API implementations match their specifications exactly. Detect deviations in request/response formats, status codes, and error handling before deployment.

## 🧠 Core Principle: Specification Fidelity
The implementation must match the contract. Any undocumented behavior, missing fields, or incorrect status codes constitutes a contract violation.

## 📊 Severity Legend
- `FAIL` — Implementation contradicts the spec (wrong status, missing field, type mismatch). Block.
- `WARN` — Spec gap or ambiguity (undocumented-but-harmless behavior, missing example). Reconcile spec and code.
- `PASS` — Endpoint verified against the spec.
- `N/A` — Feature not used by this API (state why).

## ✅ Verification Discipline
Compare against the spec file as the source of truth, not against intuition about "normal" REST behavior. When implementation and spec disagree, do not silently pick one — report the conflict so the owner decides which to change. Validate the spec itself is well-formed before validating code against it.

## 🛠️ Execution Pipeline

### 1. SPECIFICATION_PARSING
**Goal:** Establish the contract as the source of truth.
- [ ] Load OpenAPI/Swagger specification file (JSON or YAML).
- [ ] Extract all endpoints, methods, and path parameters.
- [ ] Map request schemas, response schemas, and error responses.
- [ ] Parse security schemes and authentication requirements.
- [ ] Extract examples and default values from the spec.
- [ ] Validate the specification itself is valid and complete.

**How to verify:** Lint the spec first (`swagger-cli validate`, `spectral lint`, or `redocly lint`). A malformed spec invalidates the whole comparison.

### 2. REQUEST_VALIDATION
**Goal:** Inputs are accepted/rejected exactly as documented.
- [ ] Verify all required request parameters are accepted.
- [ ] Check that request body schemas match specification.
- [ ] Validate query parameter types and constraints (min, max, pattern, enum).
- [ ] Verify path parameter extraction and type coercion.
- [ ] Check header parameter handling (case-insensitivity, required headers).
- [ ] Validate request body size limits and content restrictions.
- [ ] Verify that unknown properties are rejected or ignored as specified.

### 3. RESPONSE_VALIDATION
**Goal:** Outputs match the schema with no leaks.
- [ ] Confirm all documented response codes are returned.
- [ ] Verify response body structure matches schema exactly.
- [ ] Check that all documented fields are present with correct types.
- [ ] Ensure no extra undocumented fields leak in responses.
- [ ] Validate response field ordering if specified.
- [ ] Check that nullable fields can actually be null.
- [ ] Verify array response limits and pagination metadata.

**Example:**
```
Spec: GET /users/{id} → 200 { id: integer, name: string }
❌ Implementation returns { id, name, passwordHash } → undocumented field leaks a secret.
✅ Implementation returns exactly { id, name }, types matching schema.
```

### 4. ERROR_RESPONSE_CHECK
**Goal:** Failures are documented and consistent.
- [ ] Verify error responses follow documented error schema.
- [ ] Check that appropriate HTTP status codes are used for each error type.
- [ ] Validate error message format and required fields.
- [ ] Ensure error responses include request correlation IDs if specified.
- [ ] Check that validation errors specify which field failed.
- [ ] Verify that 4xx errors are used for client errors, 5xx for server errors.

**Example:**
```
❌ Returns 200 with { "error": "not found" } in the body — status lies about the outcome.
✅ Returns 404 with the documented error schema { code, message }.
```

### 5. AUTHENTICATION_FLOW
**Goal:** Security matches the declared schemes.
- [ ] Confirm authentication requirements match specification.
- [ ] Verify token/cookie formats and validation logic.
- [ ] Test unauthorized access returns documented error (401/403).
- [ ] Check that authentication failures do not leak information.
- [ ] Verify token expiration and refresh mechanisms.
- [ ] Test API key validation if specified.
- [ ] Check OAuth2 scopes and permission enforcement.

### 6. CONTENT_TYPE_VERIFICATION
**Goal:** Media types and negotiation behave as documented.
- [ ] Check Accept and Content-Type headers are properly handled.
- [ ] Verify charset specifications are respected.
- [ ] Validate multipart/form-data handling if documented.
- [ ] Check that response Content-Type matches the documented media type.
- [ ] Verify content negotiation for multiple supported formats.
- [ ] Check compression handling (gzip, deflate) if specified.

### 7. RATE_LIMITING_VERIFICATION
**Goal:** Throttling is enforced and observable.
- [ ] Verify rate limiting headers are present (X-RateLimit-*).
- [ ] Check that rate limit responses return 429 status.
- [ ] Validate rate limit reset timing and retry-after headers.
- [ ] Test that rate limits are enforced per user/API key.

### 8. PAGINATION_CONSISTENCY
**Goal:** Paging is correct at the edges.
- [ ] Verify pagination parameters (page, limit, offset, cursor).
- [ ] Check that pagination metadata is included in responses.
- [ ] Validate that total count or hasMore flags are accurate.
- [ ] Test edge cases (page beyond results, negative page numbers).

### 9. VERSIONING_VERIFICATION
**Goal:** Version transitions stay compatible.
- [ ] Check that API version is properly specified and validated.
- [ ] Verify backward compatibility for minor version changes.
- [ ] Test that deprecated endpoints still function as documented.
- [ ] Check deprecation warning headers are sent.

## 📤 Output Directives
Report format: `[PASS/FAIL/WARN] METHOD /path: Contract violation with expected vs actual.`

**Example output:**
```
[FAIL] GET /users/{id}: Response includes undocumented `passwordHash`. Remove from serializer.
[FAIL] POST /orders: Returns 200 on validation error; spec requires 400 with error schema.
[WARN] GET /products: Implements `?sort=` not present in spec. Add to spec or remove.
[PASS] DELETE /sessions/{id}: 204 on success, 401 unauthenticated — matches spec.
```
