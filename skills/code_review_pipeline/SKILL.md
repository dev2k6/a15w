---
name: "code_review_pipeline"
description: "Executes a structured, multi-tier code review optimized for AI-generated code. Invoke when user requests code review, pull request review, or before merging changes."
---

# SKILL: AI-Generated Code Review Pipeline

## 🎯 Objective
Execute a structured, multi-tier code review specifically optimized for AI-generated code. Prioritize macro-architecture, hallucination detection, and system integration before micro-syntax optimization.

## 🧠 Core Principle: Macro to Micro
Always evaluate from High-Level (Business Logic/Flow) to Low-Level (Syntax/Formatting). If Stage 1 or 2 fails completely, STOP the review process and flag for architectural rewrite. Do not waste compute/tokens optimizing fundamentally broken logic.

## 📊 Severity Legend
Use one verdict per finding. Verdicts are shared across all A15W skills.

- `FATAL` — Stop the pipeline immediately. Report and do not run later stages.
- `FAIL` — A real defect. Must be fixed before merge.
- `WARN` — Risk or code smell. Fix recommended, not blocking.
- `PASS` — Verified correct against a real check (not assumed).
- `N/A` — Stage does not apply to this code (state why in one clause).

## ✅ Verification Discipline
A check is only `PASS` when you actually verified it. Never write `PASS` from assumption.

- Imports/packages → confirm against the dependency manifest and the installed tree, not memory.
- Schemas/columns → confirm against migrations or model definitions, not the query string.
- Behavior → confirm by reading the full call path, not the function in isolation.

## 🛠️ Execution Pipeline (Strict Order)

### 1. FLOW_REVIEW (Business Logic & Architecture)
**Goal:** Confirm the code solves the actual problem before judging anything else.
- [ ] Verify the code exactly solves the user's core problem statement.
- [ ] Ensure data inputs and API/Function payloads match expected architectural contracts.
- [ ] Check that control flow follows the documented or implied business process.
- [ ] Validate state transitions are complete and correct.
- [ ] **Action:** If the logic deviates fundamentally from the requirement, ABORT the pipeline and state: "Flow validation failed."

**How to verify:** Restate the requirement in one sentence, then trace the entry point to the output. If you cannot map the requirement onto the code path, that is a `FATAL` flow failure, not a `WARN`.

### 2. HALLUCINATION_&_DEPENDENCY_REVIEW (Critical AI Check)
**Goal:** Catch invented packages, functions, endpoints, and signatures — the #1 AI failure mode.
- [ ] Verify all `import`s, libraries, and packages actually exist in the real world and match the project's dependency file (e.g., `package.json`, `requirements.txt`).
- [ ] Check for fabricated ("hallucinated") internal helper functions, variables, or methods.
- [ ] Validate that external API calls use accurate, up-to-date endpoints.
- [ ] Confirm method signatures and parameter names match actual library documentation.
- [ ] Check that async/await usage matches the actual API (not assumed patterns).
- [ ] Verify error types and exception classes are real, not invented.

**How to verify:**
- Node: `npm ls <pkg>` / `cat package.json`; resolve internal symbols by grepping the repo.
- Python: `pip show <pkg>` / check `requirements.txt` or `pyproject.toml`.
- For internal symbols, search the codebase — if a called function has zero definition, it is hallucinated.

**Example:**
```js
// ❌ Hallucinated: lodash has no `deepMergeAll`
import { deepMergeAll } from 'lodash';
const merged = deepMergeAll(a, b, c);

// ✅ Real API: use mergeWith / merge that actually exists
import { merge } from 'lodash';
const merged = merge({}, a, b, c);
```

### 3. BUG_&_EDGE_CASE_REVIEW
**Goal:** Break the happy path on purpose.
- [ ] Look beyond the "Happy Path". Evaluate handling of null values, empty arrays, timeouts, and unexpected data types.
- [ ] Verify robust error handling (e.g., `try/catch` blocks must properly log or bubble up errors, no silent failures).
- [ ] Check for off-by-one errors in loops and array indexing.
- [ ] Validate boundary conditions (first element, last element, single element, empty).
- [ ] Test type coercion edge cases (string "0", empty string, NaN, Infinity).
- [ ] Verify race condition handling in concurrent code.

**Example:**
```js
// ❌ Silent failure swallows the error and returns a misleading default
try { return JSON.parse(input); } catch { return {}; }

// ✅ Surface the failure with context so callers can react
try { return JSON.parse(input); }
catch (e) { throw new Error(`Invalid JSON payload: ${e.message}`); }
```

### 4. DATABASE_REVIEW (Data Integrity & Performance)
**Goal:** Protect data integrity and avoid silent performance cliffs.
- [ ] Scan for N+1 query problems in loops.
- [ ] Verify database schema alignment (do not invent non-existent tables or columns).
- [ ] Ensure proper use of indexes, transactions, and optimized `JOIN` operations.
- [ ] Check for SQL injection vulnerabilities in query construction.
- [ ] Validate that transactions have proper commit/rollback logic.
- [ ] Verify foreign key relationships are respected in code logic.
- [ ] Check for missing `LIMIT` clauses on potentially large result sets.

**Example:**
```js
// ❌ N+1: one query per user inside the loop
for (const u of users) u.orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [u.id]);

// ✅ Single batched query, grouped in memory
const rows = await db.query('SELECT * FROM orders WHERE user_id IN (?)', [users.map(u => u.id)]);
```

### 5. SECURITY_&_PERMISSION_REVIEW
**Goal:** No secrets, no missing auth, no injection.
- [ ] **FATAL CHECK:** Scan for any hardcoded secrets (API keys, passwords, JWT tokens).
- [ ] Verify Authorization/Authentication layers (Role-Based Access Control) are actively applied to sensitive endpoints/functions.
- [ ] Check for common vulnerabilities (SQL Injection, XSS, CSRF).
- [ ] Validate that user input is sanitized before use in queries or rendering.
- [ ] Check session management follows security best practices.
- [ ] Verify sensitive data is not logged or exposed in error messages.

**Note:** For deployment-grade security, hand off to the `security_audit` skill — this stage is a fast gate, not a full audit.

### 6. CODE_CLEAN_REVIEW (Maintainability)
**Goal:** Match the project, not a generic style guide.
- [ ] Enforce DRY (Don't Repeat Yourself) and SOLID principles.
- [ ] Ensure strict adherence to the project's existing Coding Convention (naming styles, file structures).
- [ ] Remove unused variables, redundant comments, and dead code.
- [ ] Check that functions have single responsibility and reasonable size (<50 lines ideal).
- [ ] Verify variable names are descriptive and follow naming conventions.
- [ ] Ensure consistent error handling patterns throughout the codebase.
- [ ] Check for magic numbers that should be named constants.

**How to verify:** Compare against neighboring files in the same module. "Different from the rest of the codebase" outranks "different from my preference."

### 7. TEST_QUALITY_REVIEW
**Goal:** Tests must be able to fail for a real reason.
- [ ] Verify that Unit/Integration Tests evaluate actual business logic, not just trivial syntax.
- [ ] Ensure assertions are meaningful (reject tests that over-mock dependencies to the point of testing nothing, e.g., `expect(true).toBe(true)`).
- [ ] Check test coverage includes edge cases and error scenarios.
- [ ] Verify tests are isolated and do not depend on execution order.
- [ ] Ensure test data is realistic and not oversimplified.

**Note:** To author missing tests rather than just judge them, hand off to `test_generation`.

### 8. PROMPT_CONSTRAINT_VALIDATION
**Goal:** Honor every explicit constraint the user set.
- [ ] Cross-check the final code against EVERY strict constraint provided in the initial user prompt (e.g., "Do not use ORM", "Must use TypeScript").
- [ ] Verify technology choices align with stated preferences.
- [ ] Check that architectural decisions respect given constraints.
- [ ] Validate that performance requirements are addressed if specified.

**How to verify:** List the user's hard constraints explicitly, then mark each one met/violated. A single violated hard constraint is a `FAIL` even if everything else passes.

## 📤 Output Directives
Use extreme brevity. Output an action-oriented checklist, one line per finding.
Format: `[PASS/FAIL/WARN] - STAGE_NAME: Issue description & suggested fix.`

**Example output:**
```
[FATAL] - SECURITY_&_PERMISSION_REVIEW: Hardcoded Stripe key on line 42. Move to env var; rotate the leaked key.
[FAIL]  - HALLUCINATION_&_DEPENDENCY_REVIEW: `lodash.deepMergeAll` does not exist. Use `merge`.
[FAIL]  - DATABASE_REVIEW: N+1 query in getUsersWithOrders loop. Batch with WHERE user_id IN (...).
[WARN]  - CODE_CLEAN_REVIEW: Magic number 86400 on line 91. Extract const SECONDS_PER_DAY.
[PASS]  - FLOW_REVIEW: Endpoint matches the stated pagination requirement.
```
