---
name: "code_review_pipeline"
description: "Executes a structured, multi-tier code review optimized for AI-generated code. Invoke when user requests code review, pull request review, or before merging changes."
---

# SKILL: AI-Generated Code Review Pipeline

## 🎯 Objective
Execute a structured, multi-tier code review specifically optimized for AI-generated code. Prioritize macro-architecture, hallucination detection, and system integration before micro-syntax optimization.

## 🧠 Core Principle: Macro to Micro
Always evaluate from High-Level (Business Logic/Flow) to Low-Level (Syntax/Formatting). If Stage 1 or 2 fails completely, STOP the review process and flag for architectural rewrite. Do not waste compute/tokens optimizing fundamentally broken logic.

## 🛠️ Execution Pipeline (Strict Order)

### 1. FLOW_REVIEW (Business Logic & Architecture)
- [ ] Verify the code exactly solves the user's core problem statement.
- [ ] Ensure data inputs and API/Function payloads match expected architectural contracts.
- [ ] Check that control flow follows the documented or implied business process.
- [ ] Validate state transitions are complete and correct.
- [ ] **Action:** If the logic deviates fundamentally from the requirement, ABORT the pipeline and state: "Flow validation failed."

### 2. HALLUCINATION_&_DEPENDENCY_REVIEW (Critical AI Check)
- [ ] Verify all `import`s, libraries, and packages actually exist in the real world and match the project's dependency file (e.g., `package.json`, `requirements.txt`).
- [ ] Check for fabricated ("hallucinated") internal helper functions, variables, or methods.
- [ ] Validate that external API calls use accurate, up-to-date endpoints.
- [ ] Confirm method signatures and parameter names match actual library documentation.
- [ ] Check that async/await usage matches the actual API (not assumed patterns).
- [ ] Verify error types and exception classes are real, not invented.

### 3. BUG_&_EDGE_CASE_REVIEW
- [ ] Look beyond the "Happy Path". Evaluate handling of null values, empty arrays, timeouts, and unexpected data types.
- [ ] Verify robust error handling (e.g., `try/catch` blocks must properly log or bubble up errors, no silent failures).
- [ ] Check for off-by-one errors in loops and array indexing.
- [ ] Validate boundary conditions (first element, last element, single element, empty).
- [ ] Test type coercion edge cases (string "0", empty string, NaN, Infinity).
- [ ] Verify race condition handling in concurrent code.

### 4. DATABASE_REVIEW (Data Integrity & Performance)
- [ ] Scan for N+1 query problems in loops.
- [ ] Verify database schema alignment (do not invent non-existent tables or columns).
- [ ] Ensure proper use of indexes, transactions, and optimized `JOIN` operations.
- [ ] Check for SQL injection vulnerabilities in query construction.
- [ ] Validate that transactions have proper commit/rollback logic.
- [ ] Verify foreign key relationships are respected in code logic.
- [ ] Check for missing `LIMIT` clauses on potentially large result sets.

### 5. SECURITY_&_PERMISSION_REVIEW
- [ ] **FATAL CHECK:** Scan for any hardcoded secrets (API keys, passwords, JWT tokens).
- [ ] Verify Authorization/Authentication layers (Role-Based Access Control) are actively applied to sensitive endpoints/functions.
- [ ] Check for common vulnerabilities (SQL Injection, XSS, CSRF).
- [ ] Validate that user input is sanitized before use in queries or rendering.
- [ ] Check session management follows security best practices.
- [ ] Verify sensitive data is not logged or exposed in error messages.

### 6. CODE_CLEAN_REVIEW (Maintainability)
- [ ] Enforce DRY (Don't Repeat Yourself) and SOLID principles.
- [ ] Ensure strict adherence to the project's existing Coding Convention (naming styles, file structures).
- [ ] Remove unused variables, redundant comments, and dead code.
- [ ] Check that functions have single responsibility and reasonable size (<50 lines ideal).
- [ ] Verify variable names are descriptive and follow naming conventions.
- [ ] Ensure consistent error handling patterns throughout the codebase.
- [ ] Check for magic numbers that should be named constants.

### 7. TEST_QUALITY_REVIEW
- [ ] Verify that Unit/Integration Tests evaluate actual business logic, not just trivial syntax.
- [ ] Ensure assertions are meaningful (reject tests that over-mock dependencies to the point of testing nothing, e.g., `expect(true).toBe(true)`).
- [ ] Check test coverage includes edge cases and error scenarios.
- [ ] Verify tests are isolated and do not depend on execution order.
- [ ] Ensure test data is realistic and not oversimplified.

### 8. PROMPT_CONSTRAINT_VALIDATION
- [ ] Cross-check the final code against EVERY strict constraint provided in the initial user prompt (e.g., "Do not use ORM", "Must use TypeScript").
- [ ] Verify technology choices align with stated preferences.
- [ ] Check that architectural decisions respect given constraints.
- [ ] Validate that performance requirements are addressed if specified.

## 📤 Output Directives
When reporting the review, use extreme brevity. Output an action-oriented checklist.
Format: `[PASS/FAIL/WARN] - Stage Name: Issue description & Suggested fix.`