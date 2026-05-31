---
name: "security_audit"
description: "Performs a structured, multi-tier security audit optimized for detecting vulnerabilities, hardcoded secrets, and insecure patterns. Invoke when user requests security audit, vulnerability scan, or before deploying to production."
---

# SKILL: AI-Generated Security Audit

## 🎯 Objective
Execute a structured, multi-tier security audit specifically optimized for detecting vulnerabilities in AI-generated code. Prioritize critical threats (secrets exposure, injection flaws, broken auth) before lower-severity misconfigurations.

## 🧠 Core Principle: Critical First
Always evaluate from High-Risk (Secrets/Injection/Auth) to Medium/Low-Risk (Headers/Cookies/Config). If Stage 1 or 2 finds a **FATAL** issue, STOP the audit process and flag for immediate remediation. Do not waste compute auditing style when the foundation is insecure.

## 📊 Severity Legend
- `FATAL` — Exploitable now or secret exposed. Stop and report immediately.
- `FAIL` — Confirmed vulnerability. Block deployment until fixed.
- `WARN` — Hardening gap or defense-in-depth weakness. Fix recommended.
- `PASS` — Control verified present and effective.
- `N/A` — Not applicable to this codebase (state why).

Map to CVSS-style bands when useful: FATAL ≈ Critical (9.0+), FAIL ≈ High (7.0+), WARN ≈ Medium/Low.

## ✅ Verification Discipline
Trace, don't guess. A control is only `PASS` when you followed the data from untrusted input to its sink, or confirmed the control is wired into the real request path. Note any area you could not reach (e.g., infra config outside the repo) as `N/A` with a reason rather than a false `PASS`.

## 🛠️ Execution Pipeline (Strict Order)

### 1. SECRETS_REVIEW (Hardcoded Credentials)
**Goal:** Zero live secrets in source, history, or bundles.
- [ ] Scan for hardcoded API keys, passwords, database URLs, or JWT tokens in source code.
- [ ] Check environment variable usage; ensure no `.env` files are committed to version control.
- [ ] Verify secrets are not embedded in client-side bundles or source maps.
- [ ] Check for secrets in git history, commit messages, or branch names.
- [ ] Scan for base64-encoded or hex-encoded credentials.
- [ ] **FATAL CHECK:** If any production secret is found in plain text, ABORT the pipeline and state: "Critical secret exposure detected."

**How to verify:** grep high-signal patterns (`AKIA[0-9A-Z]{16}`, `sk_live_`, `-----BEGIN .* PRIVATE KEY-----`, `eyJ` JWT prefix); check `git log -p` and confirm `.env` is gitignored. A committed secret must be treated as compromised — rotation is part of the fix, not optional.

### 2. INJECTION_REVIEW (Input Validation & Sanitization)
**Goal:** No untrusted input reaches an interpreter unparameterized.
- [ ] Verify all user inputs are properly sanitized before use in SQL/NoSQL queries.
- [ ] Check for command injection via user-controlled shell command execution.
- [ ] Validate that server-side template rendering does not execute user input directly.
- [ ] Check for LDAP injection, XPath injection, and XML external entity (XXE) vulnerabilities.
- [ ] Verify path traversal protection on file operations.
- [ ] Check for prototype pollution in JavaScript object handling.
- [ ] **FATAL CHECK:** Any unsanitized user input concatenated directly into queries/commands is a failure.

**Example:**
```js
// ❌ SQL injection: input concatenated into the query
db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);

// ✅ Parameterized query — driver handles escaping
db.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
```

### 3. AUTHENTICATION_REVIEW (Identity & Access Control)
**Goal:** Every sensitive path proves identity correctly.
- [ ] Verify that authentication is enforced on all sensitive endpoints and functions.
- [ ] Check for weak password policies, missing brute-force protection, or insecure session management.
- [ ] Ensure Role-Based Access Control (RBAC) or Permission-Based Access Control is actively applied.
- [ ] Verify password storage uses proper hashing (bcrypt, Argon2, scrypt) with unique salts.
- [ ] Check for JWT token validation (signature, expiration, issuer, audience).
- [ ] Verify multi-factor authentication is enforced for privileged actions if required.
- [ ] Check session fixation and session hijacking protections.
- [ ] **Action:** If sensitive data is accessible without proper auth, flag as "Authentication bypass risk."

**Example:**
```js
// ❌ Signature not verified — forged tokens accepted
const claims = jwt.decode(token);

// ✅ Verify signature + standard claims
const claims = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'], issuer, audience });
```

### 4. XSS_REVIEW (Cross-Site Scripting)
**Goal:** No untrusted data executes in a browser context.
- [ ] Check for reflected XSS via unescaped URL parameters or query strings reflected in the DOM.
- [ ] Check for stored XSS via unsanitized user-generated content saved to a database and rendered later.
- [ ] Verify Content Security Policy (CSP) headers are configured to mitigate inline script execution.
- [ ] Check for DOM-based XSS in client-side JavaScript (innerHTML, document.write, eval).
- [ ] Verify output encoding is applied consistently (HTML, JavaScript, CSS, URL contexts).
- [ ] Check that user-controlled URLs are validated against an allowlist.

**Example:**
```js
// ❌ Renders raw user content into the DOM
el.innerHTML = comment.body;

// ✅ Treat as text, or sanitize with a vetted library before rendering HTML
el.textContent = comment.body;
```

### 5. CSRF_REVIEW (Cross-Site Request Forgery)
**Goal:** State-changing requests prove user intent.
- [ ] Verify CSRF tokens are required on all state-changing operations.
- [ ] Check that CSRF tokens are validated server-side, not just present.
- [ ] Verify SameSite cookie attributes are set appropriately.
- [ ] Check that GET requests do not perform state-changing operations.

### 6. CRYPTO_REVIEW (Encryption & Hashing)
**Goal:** Strong, current, correctly-applied primitives only.
- [ ] Ensure passwords are hashed using strong, salted algorithms (e.g., bcrypt, Argon2, PBKDF2).
- [ ] Verify TLS/SSL is enforced for all network communication; reject insecure protocols (SSLv2, SSLv3, TLS 1.0).
- [ ] Check that encryption keys are not hardcoded and are managed via a secure key vault or environment variables.
- [ ] Verify symmetric encryption uses authenticated encryption (AES-GCM, ChaCha20-Poly1305).
- [ ] Check that random number generation uses cryptographically secure RNG (crypto.randomBytes, secrets module).
- [ ] Verify certificate validation is not disabled in production.

**Example:**
```js
// ❌ MD5 is broken for security; Math.random() is not cryptographic
const token = md5(Math.random().toString());

// ✅ CSPRNG for tokens; bcrypt/argon2 for passwords
const token = crypto.randomBytes(32).toString('hex');
```

### 7. DATA_EXPOSURE_REVIEW (Sensitive Information Leakage)
**Goal:** Responses and logs reveal nothing sensitive.
- [ ] Scan logs and error messages for exposed Personally Identifiable Information (PII) or stack traces.
- [ ] Verify API responses do not leak internal implementation details (database schemas, file paths).
- [ ] Check that debug mode is disabled in production configurations.
- [ ] Verify sensitive fields are excluded from API responses by default.
- [ ] Check for information disclosure via timing attacks or error message differences.
- [ ] Verify backup files and temporary files do not expose sensitive data.

### 8. DEPENDENCY_REVIEW (Third-Party Risks)
**Goal:** No known-vulnerable or malicious packages.
- [ ] Check `package.json`, `requirements.txt`, or equivalent for known vulnerable dependencies.
- [ ] Verify that imported libraries are actively maintained and downloaded from trusted registries.
- [ ] Check for malicious packages (typosquatting, brandjacking).
- [ ] Verify that package integrity is validated (lockfiles, checksums).
- [ ] **Action:** If a dependency has a known Critical/High CVE without a fix, flag for immediate replacement or patching.

**How to verify:** Run the ecosystem scanner (`npm audit`, `pip-audit`, `osv-scanner`). For depth, hand off to the `dependency_audit` skill.

### 9. CONFIGURATION_REVIEW (Environment & Settings)
**Goal:** Safe defaults at the edge.
- [ ] Verify security headers are present (HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection).
- [ ] Ensure CORS policies are restrictive and do not allow wildcard `*` origins in production.
- [ ] Check that default admin credentials or setup tokens are changed/disabled after deployment.
- [ ] Verify that directory listing is disabled on web servers.
- [ ] Check that error pages do not expose stack traces or internal paths.
- [ ] Verify that HTTP methods are restricted to only those needed (disable TRACE, OPTIONS if unused).

### 10. ACCESS_CONTROL_REVIEW (Authorization)
**Goal:** Authenticated ≠ authorized. Check object-level ownership.
- [ ] Verify that authorization checks are performed on every request, not just at login.
- [ ] Check for Insecure Direct Object References (IDOR) vulnerabilities.
- [ ] Verify that users cannot access or modify resources belonging to other users.
- [ ] Check that privilege escalation paths are blocked.
- [ ] Verify that deleted resources cannot be accessed via direct URL.

**Example:**
```js
// ❌ IDOR: any logged-in user can read any invoice by id
app.get('/invoices/:id', auth, (req, res) => res.json(getInvoice(req.params.id)));

// ✅ Scope the lookup to the authenticated owner
app.get('/invoices/:id', auth, (req, res) => res.json(getInvoice(req.params.id, req.user.id)));
```

## 📤 Output Directives
Use extreme brevity. Output an action-oriented checklist, one line per finding.
Format: `[PASS/FAIL/WARN] - STAGE_NAME: Issue description & suggested fix.`

**Example output:**
```
[FATAL] - SECRETS_REVIEW: AWS key AKIA... committed in config.js:7. Rotate key now; move to secrets manager.
[FAIL]  - INJECTION_REVIEW: req.body.email concatenated into SQL in findUser(). Use parameterized query.
[FAIL]  - ACCESS_CONTROL_REVIEW: GET /invoices/:id missing ownership check (IDOR). Scope query to req.user.id.
[WARN]  - CONFIGURATION_REVIEW: CORS allows '*'. Restrict to known origins in production.
[PASS]  - CRYPTO_REVIEW: Passwords hashed with bcrypt (cost 12), per-user salt.
```
