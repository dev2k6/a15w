# 🚀 A15W — AI Agent Code Review

**A15W = AI Agent Code Review.** The definitive skill extension pack for AI coding agents.

Born from a simple observation: AI generates code fast, but fast ≠ correct. A15W brings structured, multi-tier analysis pipelines that catch hallucinations, security flaws, and architectural drift before they reach production.

---

## ⚔️ The Problem

AI writes code at unprecedented speed. But every day, developers ship:

- **Fabricated imports** — packages that don't exist on npm/PyPI
- **Hardcoded secrets** — API keys, passwords, JWT tokens in plain text
- **Injection vulnerabilities** — SQL, command, XSS waiting for exploitation
- **N+1 query disasters** — database performance killed by AI-generated loops
- **Missing auth checks** — endpoints exposed because the model "forgot"

Traditional linting catches syntax. A15W catches **semantic failures**.

---

## ✨ Why A15W?

| Generic AI Output | A15W-Gated Output |
|-------------------|-------------------|
| "It compiled" | "All 8 review stages passed" |
| "Tests will catch it" | "Tests generated and passing" |
| "We'll audit security later" | "Security validated. Zero critical issues." |
| "Should be fast enough" | "Performance profiled. Hot paths optimized." |
| "Dependencies look fine" | "Dependency audit complete. No CVEs." |

**A15W doesn't suggest. It enforces.**

---

## 🎯 The Arsenal: 7 Skills

A15W's core is **Code Review Pipeline** — the 8-stage ordered inspection that stops on critical failures. But code review alone isn't enough. The full arsenal includes:

### 🔍 1. Code Review Pipeline *(Core)*
**8 stages. Macro to micro. Abort on failure.**

Validates AI-generated code from business logic down to syntax. Catches hallucinations, verifies dependencies exist, checks edge cases, audits database patterns, enforces security, and validates against original prompt constraints.

### 🛡️ 2. Security Audit
**10 stages. Critical-first. Fatal on secrets.**

Hardcoded credentials? Injection flaws? Auth bypass? XSS vectors? Weak crypto? Stops immediately and flags. Production secrets in code = pipeline abort.

### 🧪 3. Test Generation
**8 stages. Real tests. Zero trivial mocks.**

Generates edge case coverage, error path testing, integration scenarios, and property-based invariants. `expect(true).toBe(true)` gets rejected. Tests must assert actual behavior.

### 🔄 4. Refactor Safety
**8 stages. Behavioral equivalence.**

Refactored code must produce identical outputs, side effects, and error conditions. Same database writes. Same API calls. Same exceptions. Or it fails validation.

### 📦 5. Dependency Audit
**8 stages. Supply chain defense.**

CVEs, license conflicts, abandoned packages, duplicate dependencies, bundle bloat. Know what's in your `node_modules` before attackers do.

### 📋 6. API Contract Validation
**9 stages. OpenAPI/Swagger fidelity.**

Every endpoint. Every status code. Every field. Every error response. Matches the spec or it doesn't ship. No undocumented behavior allowed.

### ⚡ 7. Performance Profiling
**10 stages. Measure before optimizing.**

N+1 queries, memory leaks, blocking I/O, hot paths, GC pressure. Find the 20% causing 80% of latency. Quantify before you optimize.

---

## 🚦 Pipeline Philosophy

Every A15W skill follows the same pattern:

```
Stage 1 → Stage 2 → Stage 3 → ... → Stage N
   ↓         ↓         ↓
  FAIL     FAIL      FAIL
   ↓         ↓         ↓
  STOP     STOP      STOP
```

**Early termination saves tokens and time.** If Stage 1 detects a fatal issue, why waste compute on Stage 8?

**Output format:** `[PASS/FAIL/WARN] - Stage: Issue & suggested fix`

Brevity. Actionability. Zero fluff.

---

## 💡 Core Principles

### Macro → Micro
Architecture before syntax. Business logic before formatting. If the foundation is broken, stop. Don't polish a broken building.

### Critical → Cosmetic
Secrets before semicolons. Injection flaws before missing whitespace. If production credentials are exposed, nothing else matters.

### Verify → Trust
Never trust AI-generated imports, function names, API endpoints, or database schemas. Verify everything exists in reality.

### Measure → Guess
Profile before optimizing. The bottleneck is never where intuition suggests. Data beats assumptions.

---

## 📦 Usage

### For AI Agents

AI agents should read `AGENT.md` for complete usage protocol, including:
- Automatic trigger phrase detection
- Pipeline execution rules
- Critical abort conditions
- Output format requirements

### For Humans

Skills activate via trigger phrases in your AI agent:

| Trigger | Skill Activated |
|---------|-----------------|
| "review this code", "PR review", "before merging" | `code_review_pipeline` |
| "security audit", "vulnerability scan", "before deploy" | `security_audit` |
| "write tests", "generate tests", "TDD" | `test_generation` |
| "refactor", "is this safe to change", "cleanup" | `refactor_safety` |
| "check dependencies", "npm audit", "license compliance" | `dependency_audit` |
| "validate API", "OpenAPI check", "contract test" | `api_contract_validation` |
| "performance", "why is this slow", "optimize" | `performance_profiling` |

Or invoke directly via manifest configuration in `manifest.json`.

---

## 📁 Project Structure

```
a15w/
├── AGENT.md              # AI agent usage protocol (read this first)
├── README.md             # Human-facing documentation (you are here)
├── manifest.json         # Skill registration with triggers & metadata
├── .gitignore            # Version control exclusions
└── skills/
    ├── code_review_pipeline.md      # Core: 8-stage code review
    ├── security_audit.md            # 10-stage security audit
    ├── test_generation.md           # 8-stage test generation
    ├── refactor_safety.md           # 8-stage refactor validation
    ├── dependency_audit.md          # 8-stage supply chain audit
    ├── api_contract_validation.md   # 9-stage API spec validation
    └── performance_profiling.md     # 10-stage performance analysis
```

---

## 📊 By The Numbers

| Metric | Value |
|--------|-------|
| Total Skills | 7 |
| Total Pipeline Stages | 61 |
| Total Validation Checks | 322 |
| Average Stages per Skill | 8.7 |
| Code Review Stages | 8 |
| Security Audit Stages | 10 |
| Performance Profiling Stages | 10 |

**322 automated checks standing between you and production bugs.**

---

## 🏆 Competitive Edge

| Capability | A15W | Basic Linting | Manual Review |
|------------|------|---------------|---------------|
| Ordered pipeline execution | ✅ | ❌ | ✅ |
| Early abort on critical failures | ✅ | ❌ | ✅ |
| AI hallucination detection | ✅ | ❌ | ⚠️ |
| Behavioral equivalence validation | ✅ | ❌ | ⚠️ |
| License compliance checking | ✅ | ❌ | ⚠️ |
| API spec enforcement | ✅ | Partial | ⚠️ |
| Performance quantification | ✅ | ❌ | ⚠️ |
| Zero-config activation | ✅ | ✅ | ❌ |
| Consistent, repeatable results | ✅ | ✅ | ❌ |

---

## 📄 License

MIT License. Use it. Extend it. Ship with it.

---

## 🤝 Contributing

Missing a critical check? Found a gap in a pipeline? Open an issue or submit a PR.

This isn't just a skill pack. It's a standard for AI-assisted development.

---

## 🔗 Links

- **Repository:** https://github.com/dev2k6/a15w
- **Issues:** https://github.com/dev2k6/a15w/issues
- **License:** MIT

---

**A15W — AI Agent Code Review. Because "it compiled" isn't a quality metric.**