---
name: "security_audit"
description: "Performs a structured, multi-tier security audit optimized for detecting vulnerabilities, hardcoded secrets, and insecure patterns. Invoke when user requests security audit, vulnerability scan, or before deploying to production."
---

# SKILL: AI-Generated Security Audit

## 🎯 Objective
Execute a structured, multi-tier security audit specifically optimized for detecting vulnerabilities in AI-generated code. Prioritize critical threats (secrets exposure, injection flaws, broken auth) before lower-severity misconfigurations.

## 🧠 Core Principle: Critical First
Always evaluate from High-Risk (Secrets/Injection/Auth) to Medium/Low-Risk (Headers/Cookies/Config). If Stage 1 or 2 finds a **FATAL** issue, STOP the audit process and flag for immediate remediation. Do not waste compute auditing style when the foundation is insecure.

## 🛠️ Execution Pipeline (Strict Order)

### 1. SECRETS_REVIEW (Hardcoded Credentials)
- [ ] Scan for hardcoded API keys, passwords, database URLs, or JWT tokens in source code.
- [ ] Check environment variable usage; ensure no `.env` files are committed to version control.
- [ ] Verify secrets are not embedded in client-side bundles or source maps.
- [ ] Check for secrets in git history, commit messages, or branch names.
- [ ] Scan for base64-encoded or hex-encoded credentials.
- [ ] **FATAL CHECK:** If any production secret is found in plain text, ABORT the pipeline and state: "Critical secret exposure detected."

### 2. INJECTION_REVIEW (Input Validation & Sanitization)
- [ ] Verify all user inputs are properly sanitized before use in SQL/NoSQL queries.
- [ ] Check for command injection via user-controlled shell command execution.
- [ ] Validate that server-side template rendering does not execute user input directly.
- [ ] Check for LDAP injection, XPath injection, and XML external entity (XXE) vulnerabilities.
- [ ] Verify path traversal protection on file operations.
- [ ] Check for prototype pollution in JavaScript object handling.
- [ ] **FATAL CHECK:** Any unsanitized user input concatenated directly into queries/commands is a failure.

### 3. AUTHENTICATION_REVIEW (Identity & Access Control)
- [ ] Verify that authentication is enforced on all sensitive endpoints and functions.
- [ ] Check for weak password policies, missing brute-force protection, or insecure session management.
- [ ] Ensure Role-Based Access Control (RBAC) or Permission-Based Access Control is actively applied.
- [ ] Verify password storage uses proper hashing (bcrypt, Argon2, scrypt) with unique salts.
- [ ] Check for JWT token validation (signature, expiration, issuer, audience).
- [ ] Verify multi-factor authentication is enforced for privileged actions if required.
- [ ] Check session fixation and session hijacking protections.
- [ ] **Action:** If sensitive data is accessible without proper auth, flag as "Authentication bypass risk."

### 4. XSS_REVIEW (Cross-Site Scripting)
- [ ] Check for reflected XSS via unescaped URL parameters or query strings reflected in the DOM.
- [ ] Check for stored XSS via unsanitized user-generated content saved to a database and rendered later.
- [ ] Verify Content Security Policy (CSP) headers are configured to mitigate inline script execution.
- [ ] Check for DOM-based XSS in client-side JavaScript (innerHTML, document.write, eval).
- [ ] Verify output encoding is applied consistently (HTML, JavaScript, CSS, URL contexts).
- [ ] Check that user-controlled URLs are validated against an allowlist.

### 5. CSRF_REVIEW (Cross-Site Request Forgery)
- [ ] Verify CSRF tokens are required on all state-changing operations.
- [ ] Check that CSRF tokens are validated server-side, not just present.
- [ ] Verify SameSite cookie attributes are set appropriately.
- [ ] Check that GET requests do not perform state-changing operations.

### 6. CRYPTO_REVIEW (Encryption & Hashing)
- [ ] Ensure passwords are hashed using strong, salted algorithms (e.g., bcrypt, Argon2, PBKDF2).
- [ ] Verify TLS/SSL is enforced for all network communication; reject insecure protocols (SSLv2, SSLv3, TLS 1.0).
- [ ] Check that encryption keys are not hardcoded and are managed via a secure key vault or environment variables.
- [ ] Verify symmetric encryption uses authenticated encryption (AES-GCM, ChaCha20-Poly1305).
- [ ] Check that random number generation uses cryptographically secure RNG (crypto.randomBytes, secrets module).
- [ ] Verify certificate validation is not disabled in production.

### 7. DATA_EXPOSURE_REVIEW (Sensitive Information Leakage)
- [ ] Scan logs and error messages for exposed Personally Identifiable Information (PII) or stack traces.
- [ ] Verify API responses do not leak internal implementation details (database schemas, file paths).
- [ ] Check that debug mode is disabled in production configurations.
- [ ] Verify sensitive fields are excluded from API responses by default.
- [ ] Check for information disclosure via timing attacks or error message differences.
- [ ] Verify backup files and temporary files do not expose sensitive data.

### 8. DEPENDENCY_REVIEW (Third-Party Risks)
- [ ] Check `package.json`, `requirements.txt`, or equivalent for known vulnerable dependencies.
- [ ] Verify that imported libraries are actively maintained and downloaded from trusted registries.
- [ ] Check for malicious packages (typosquatting, brandjacking).
- [ ] Verify that package integrity is validated (lockfiles, checksums).
- [ ] **Action:** If a dependency has a known Critical/High CVE without a fix, flag for immediate replacement or patching.

### 9. CONFIGURATION_REVIEW (Environment & Settings)
- [ ] Verify security headers are present (HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection).
- [ ] Ensure CORS policies are restrictive and do not allow wildcard `*` origins in production.
- [ ] Check that default admin credentials or setup tokens are changed/disabled after deployment.
- [ ] Verify that directory listing is disabled on web servers.
- [ ] Check that error pages do not expose stack traces or internal paths.
- [ ] Verify that HTTP methods are restricted to only those needed (disable TRACE, OPTIONS if unused).

### 10. ACCESS_CONTROL_REVIEW (Authorization)
- [ ] Verify that authorization checks are performed on every request, not just at login.
- [ ] Check for Insecure Direct Object References (IDOR) vulnerabilities.
- [ ] Verify that users cannot access or modify resources belonging to other users.
- [ ] Check that privilege escalation paths are blocked.
- [ ] Verify that deleted resources cannot be accessed via direct URL.

## 📤 Output Directives
When reporting the audit, use extreme brevity. Output an action-oriented checklist.
Format: `[PASS/FAIL/WARN] - Stage Name: Issue description & Suggested fix.`