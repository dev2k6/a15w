---
name: "refactor_safety"
description: "Validates refactoring operations for behavioral equivalence and safety. Invoke when user requests refactoring, code cleanup, or structural changes to existing code."
---

# SKILL: Safe Refactoring Validation

## 🎯 Objective
Ensure refactored code maintains identical external behavior to the original. Detect breaking changes before they reach production.

## 🧠 Core Principle: Behavioral Equivalence
Refactoring must not change observable behavior. Any deviation in outputs, side effects, or error conditions constitutes a failed refactor.

## 📊 Severity Legend
- `UNSAFE` — Observable behavior changed. Block until reconciled or explicitly approved as intentional.
- `RISK` — Plausible behavior change that current tests do not cover. Add coverage before merging.
- `SAFE` — Behavior verified equivalent against a real check.

## ✅ Verification Discipline
"Looks equivalent" is not equivalence. Capture a baseline *before* touching code, then diff against it. If no characterization tests exist for the code being refactored, write them first — you cannot prove equivalence against nothing.

## 🛠️ Execution Pipeline

### 1. BASELINE_CAPTURE
**Goal:** Freeze the current behavior as the source of truth.
- [ ] Identify all public entry points (functions, APIs, CLI commands).
- [ ] Record expected inputs and outputs for each entry point.
- [ ] Document side effects (database writes, file changes, external calls).
- [ ] Capture performance characteristics (response time, memory usage).
- [ ] Record error conditions and exception types thrown.

**How to verify:** Run the existing suite on the *original* code and save results. If coverage is thin, add characterization tests that pin current outputs before refactoring.

### 2. INVARIANT_IDENTIFICATION
**Goal:** Name the rules that must never break.
- [ ] Extract business rules that must remain constant.
- [ ] Identify data transformation invariants (e.g., "total must equal sum of parts").
- [ ] Document ordering constraints and dependencies.
- [ ] Capture temporal invariants (operations must happen in specific sequence).
- [ ] Identify resource invariants (files must be closed, connections released).

### 3. STATIC_ANALYSIS
**Goal:** Confirm the surface area is intact.
- [ ] Verify all referenced symbols still exist after refactor.
- [ ] Check that type signatures remain compatible (or intentionally changed with migration).
- [ ] Ensure no dead code paths were accidentally removed.
- [ ] Verify that all exception handling paths are preserved.
- [ ] Check that logging and monitoring hooks remain in place.
- [ ] Validate that configuration dependencies are unchanged.

### 4. BEHAVIORAL_DIFF_TESTING
**Goal:** Same inputs → same outputs, old vs new.
- [ ] Run existing test suite against refactored code.
- [ ] Compare outputs for all test cases between old and new versions.
- [ ] Flag any test failures or output differences.
- [ ] Run tests multiple times to catch non-deterministic behavior.
- [ ] Compare test execution times for performance regression.
- [ ] Verify that test coverage remains equivalent.

**Example:**
```
# Capture before and after on identical inputs, then diff
git stash && app run --input fixtures/ > /tmp/before.txt
git stash pop && app run --input fixtures/ > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt   # must be empty for SAFE
```

### 5. CONTRACT_VERIFICATION
**Goal:** External contracts are byte-for-byte stable.
- [ ] Verify API contracts remain unchanged (request/response formats).
- [ ] Check database schema compatibility if queries changed.
- [ ] Validate configuration file compatibility.
- [ ] Ensure serialization formats are preserved (JSON, XML, protobuf).
- [ ] Verify that HTTP status codes and headers remain consistent.
- [ ] Check that authentication/authorization requirements are unchanged.

### 6. PERFORMANCE_REGRESSION_CHECK
**Goal:** No silent slowdowns.
- [ ] Measure execution time before and after refactor.
- [ ] Flag any >20% performance degradation.
- [ ] Verify memory usage patterns remain stable.
- [ ] Check that I/O patterns (number of queries, file operations) are equivalent.
- [ ] Verify that caching behavior is preserved.
- [ ] Test under load to ensure scalability characteristics remain.

### 7. SIDE_EFFECT_VERIFICATION
**Goal:** Same writes, calls, and emissions as before.
- [ ] Verify that database writes produce identical results.
- [ ] Check that file system changes are equivalent.
- [ ] Confirm that external API calls are made with the same parameters.
- [ ] Verify that logging output format and content remain consistent.
- [ ] Check that metrics and telemetry data are unchanged.

### 8. ERROR_BEHAVIOR_PRESERVATION
**Goal:** Failures fail the same way.
- [ ] Verify that error conditions produce the same exceptions.
- [ ] Check that error messages remain meaningful and consistent.
- [ ] Ensure that partial failure handling is preserved.
- [ ] Verify that retry and recovery logic behaves identically.
- [ ] Check that resource cleanup happens in error scenarios.

## 📤 Output Directives
Report: `[SAFE/RISK/UNSAFE] - STAGE_NAME: Specific behavioral change with before/after comparison.`
List invariants preserved vs violated.

**Example output:**
```
[UNSAFE] - SIDE_EFFECT_VERIFICATION: New code emits 2 audit events; original emitted 1. Restore single-event behavior.
[RISK]   - BEHAVIORAL_DIFF_TESTING: parseDate() path has no tests; cannot prove equivalence. Add characterization tests.
[SAFE]   - CONTRACT_VERIFICATION: Response JSON identical across all 14 fixtures.
[SAFE]   - ERROR_BEHAVIOR_PRESERVATION: Same exception types and messages on invalid input.
```
