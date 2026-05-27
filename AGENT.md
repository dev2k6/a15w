# AGENT.md — A15W Skill Usage Guide

**A15W = AI Agent Code Review**

This document teaches AI agents how to use the A15W skill arsenal effectively.

---

## 🎯 Core Principle

**A15W enforces quality gates on AI-generated code.** Never bypass these skills when the user requests code review, security audit, testing, refactoring, or deployment preparation.

---

## 📋 Skill Activation Rules

### Automatic Triggers

When user mentions these phrases, **immediately activate** the corresponding skill:

| User Phrase | Skill to Activate | File |
|-------------|-------------------|------|
| "review this code", "code review", "PR review", "pull request review", "before merging" | `code_review_pipeline` | `skills/code_review_pipeline.md` |
| "security audit", "vulnerability scan", "security check", "before deploy", "penetration test" | `security_audit` | `skills/security_audit.md` |
| "write tests", "generate tests", "add tests", "test coverage", "TDD" | `test_generation` | `skills/test_generation.md` |
| "refactor", "is this safe", "refactoring check", "code cleanup", "restructure" | `refactor_safety` | `skills/refactor_safety.md` |
| "check dependencies", "npm audit", "package vulnerabilities", "license compliance" | `dependency_audit` | `skills/dependency_audit.md` |
| "validate API", "OpenAPI check", "Swagger validation", "contract test", "API spec" | `api_contract_validation` | `skills/api_contract_validation.md` |
| "performance", "why is this slow", "optimize", "bottleneck", "profiling" | `performance_profiling` | `skills/performance_profiling.md` |

---

## 🔄 Execution Protocol

### 1. Load Skill File

Before executing any skill, **read the full skill file** from `skills/<skill-name>.md`.

Example:
```
User: "review this code for me"
Agent: Reads `skills/code_review_pipeline.md` completely
```

### 2. Follow Pipeline Order Strictly

Every skill defines a **strict ordered pipeline**. Execute stages in sequence:

```
Stage 1 → Stage 2 → Stage 3 → ...
   ↓
  FAIL → STOP IMMEDIATELY
```

**Never skip stages.** **Never reorder stages.** **Never continue after a FATAL failure.**

### 3. Apply Critical Checks

Each stage contains **checkbox items** `[ ]`. Treat these as mandatory validation points:

- Check each item systematically
- Mark as complete only when verified
- If a **FATAL CHECK** fails, abort and report immediately

### 4. Output Format

All skills mandate this output format:

```
[PASS/FAIL/WARN] - Stage Name: Issue description & Suggested fix.
```

**Brevity is required.** No paragraphs. No explanations beyond the issue and fix.

Example valid output:
```
[FAIL] - SECRETS_REVIEW: Hardcoded API key found in line 42. Move to environment variable.
[PASS] - INJECTION_REVIEW: All inputs properly sanitized.
[WARN] - CONFIGURATION_REVIEW: CORS allows wildcard origin. Restrict in production.
```

---

## ⚠️ Critical Behaviors

### Abort on Fatal Issues

If any stage reports a **FATAL** condition:

1. **STOP** the pipeline immediately
2. Report the fatal issue clearly
3. Do not proceed to subsequent stages
4. Do not attempt to "fix and continue"

Example fatal triggers:
- Hardcoded production secrets (security_audit stage 1)
- Logic deviates from user requirement (code_review_pipeline stage 1)
- Authentication bypass possible (security_audit stage 3)

### Never Fabricate Verification

**Do not claim a check passed without actually verifying it.**

Bad: "I assume the imports are correct" → Check actual package existence
Bad: "Probably no SQL injection" → Trace every query construction
Bad: "Tests look fine" → Actually run the test suite

### Verify External Reality

AI-generated code often hallucinates:
- Non-existent npm/PyPI packages
- Fabricated API endpoints
- Invented database tables/columns
- Made-up library methods

**Every external reference must be validated against reality.**

---

## 📊 Skill-Specific Guidance

### code_review_pipeline

**Purpose:** Validate AI-generated code against requirements and best practices.

**Key Focus Areas:**
- Stage 2 (Hallucination check) is critical — verify every import exists
- Stage 1 failure = abort (logic doesn't match requirement)
- Stage 8 validates against original user constraints

**When to Use:** Any code review, PR review, pre-merge validation.

---

### security_audit

**Purpose:** Detect security vulnerabilities with critical-first priority.

**Key Focus Areas:**
- Stage 1 (Secrets) and Stage 2 (Injection) are FATAL if failed
- Never continue security audit after finding hardcoded credentials
- Check for production vs development secret exposure

**When to Use:** Pre-deployment, security reviews, vulnerability assessments.

---

### test_generation

**Purpose:** Generate meaningful tests that validate actual behavior.

**Key Focus Areas:**
- Reject trivial assertions (`expect(true).toBe(true)`)
- Mock only external I/O, never core logic
- Test edge cases and error paths, not just happy path

**When to Use:** After implementing features, improving coverage, TDD workflows.

---

### refactor_safety

**Purpose:** Ensure refactoring preserves observable behavior.

**Key Focus Areas:**
- Baseline capture before refactoring begins
- Compare outputs, side effects, and error conditions
- Performance regression check (>20% degradation = fail)

**When to Use:** Before/after any structural code changes.

---

### dependency_audit

**Purpose:** Audit supply chain security and compliance.

**Key Focus Areas:**
- CVE database queries for known vulnerabilities
- License compatibility (copyleft conflicts)
- Abandoned packages (no commits in 12 months)

**When to Use:** Pre-release, dependency updates, security audits.

---

### api_contract_validation

**Purpose:** Enforce OpenAPI/Swagger specification fidelity.

**Key Focus Areas:**
- Every documented response code must be returned
- No extra undocumented fields in responses
- Authentication requirements must match spec exactly

**When to Use:** API implementation, contract testing, spec validation.

---

### performance_profiling

**Purpose:** Identify and quantify performance bottlenecks.

**Key Focus Areas:**
- Measure before optimizing (never guess)
- N+1 query detection in database access
- Memory leak identification

**When to Use:** Performance issues, scaling preparation, optimization work.

---

## 🚫 Anti-Patterns

### Never Do This

1. **Skip stages** — All stages are mandatory in order
2. **Continue after fatal** — Fatal issues require immediate stop
3. **Claim unverified checks** — Verify, don't assume
4. **Reorder pipeline** — Stage order is intentional (macro → micro, critical → cosmetic)
5. **Ignore trigger phrases** — User explicitly requesting a skill must get that skill
6. **Summarize instead of checklist** — Output format is strict: `[PASS/FAIL/WARN]`

### Always Do This

1. **Read skill file first** — Never execute from memory
2. **Follow checkbox items** — Each `[ ]` is a validation point
3. **Report in specified format** — Brevity over explanation
4. **Abort on fatal** — Early termination is a feature
5. **Verify external dependencies** — Check package existence, API validity
6. **Respect user constraints** — Stage 8 of code_review validates original prompt

---

## 🔧 Integration Notes

### Manifest Configuration

Skills are registered in `manifest.json`. Each skill entry includes:
- `name` — Unique identifier matching filename
- `file` — Path to skill definition
- `description` — One-line purpose
- `triggers` — Activation phrases (for reference)
- `category` — Quality, security, testing, or performance

### File Structure

```
a15w/
├── AGENT.md              # This file (agent usage guide)
├── README.md             # Human-facing documentation
├── manifest.json         # Skill registration
├── skills/               # Skills in SKILL.md format (CLI compatible)
│   ├── manifest.json
│   ├── code_review_pipeline/
│   │   └── SKILL.md
│   └── ... (7 skill directories)
```

**Note:** `skills/` directory uses SKILL.md format, compatible with both Trae/Claude and `npx skills` CLI.

---

## 📝 Summary

**A15W exists to prevent AI-generated bugs from reaching production.**

When in doubt:
1. Check if user request matches a trigger phrase
2. Load the corresponding skill file
3. Execute the pipeline in strict order
4. Report findings in mandated format
5. Abort on fatal issues without hesitation

**Quality is not optional. These pipelines are not suggestions.**

---

**A15W — AI Agent Code Review. Because "it compiled" isn't a quality metric.**