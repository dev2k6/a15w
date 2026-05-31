---
name: "test_generation"
description: "Generates comprehensive unit and integration tests with edge case coverage. Invoke when user requests test creation, test coverage improvement, or before committing new features."
---

# SKILL: Automated Test Generation

## 🎯 Objective
Generate thorough, meaningful test suites for code changes. Focus on business logic validation, edge cases, and error scenarios rather than trivial syntax checks.

## 🧠 Core Principle: Test Real Behavior
Write tests that verify actual business outcomes and failure modes. Avoid over-mocking that renders tests meaningless. Each test must assert something non-obvious about the code's behavior.

## 📊 Quality Legend
- `STRONG` — Test can fail for a real reason and pins business behavior.
- `WEAK` — Test passes trivially or asserts implementation detail; rewrite.
- `MISSING` — A branch/edge/error path has no coverage; add it.

## ✅ Verification Discipline
The litmus test: **if you mutate the logic, does a test fail?** If a test still passes after you break the function, it is `WEAK`. Prefer asserting on outputs and observable side effects over asserting that a mock was called.

## 🚫 Reject These Anti-Patterns
```js
// ❌ Tautology — asserts nothing about the code
expect(true).toBe(true);

// ❌ Over-mocked — the unit under test is mocked away, so nothing real runs
jest.mock('./calculateTax');
expect(calculateTax(100)).toBe(mockedValue);

// ❌ Asserting the mock instead of the outcome
expect(db.save).toHaveBeenCalled(); // ...but never checks what was saved
```

## 🛠️ Execution Pipeline

### 1. ANALYZE_FUNCTION_SIGNATURE
**Goal:** Know the contract before writing a single assertion.
- [ ] Identify all parameters, return types, and side effects.
- [ ] Map external dependencies (databases, APIs, file system).
- [ ] Determine which dependencies require mocking vs real integration.
- [ ] Identify synchronous vs asynchronous behavior.
- [ ] Document expected exceptions and error conditions.

### 2. HAPPY_PATH_TESTS
**Goal:** Lock in correct behavior for valid inputs.
- [ ] Create tests for expected valid inputs producing expected outputs.
- [ ] Cover all primary execution branches in the code.
- [ ] Ensure assertions validate actual business logic, not just "function runs."
- [ ] Test with realistic, production-like data (not trivial "foo"/"bar" values).
- [ ] Verify that return values match expected types and structures.

**Example:**
```js
// ✅ Asserts the actual computed outcome with realistic data
it('applies 8.25% tax to a subtotal', () => {
  expect(calculateTotal({ subtotal: 100, taxRate: 0.0825 })).toBe(108.25);
});
```

### 3. EDGE_CASE_TESTS
**Goal:** Cover the boundaries where bugs hide.
- [ ] Test null/undefined inputs where applicable.
- [ ] Test empty collections, zero values, boundary numbers.
- [ ] Test maximum length strings, special characters, unicode input.
- [ ] Verify timeout handling and slow response scenarios.
- [ ] Test with minimum valid values and maximum valid values.
- [ ] Check behavior at type boundaries (INT_MAX, INT_MIN, Number.MAX_SAFE_INTEGER).
- [ ] Test with duplicate values in collections.
- [ ] Verify handling of circular references if applicable.

### 4. ERROR_HANDLING_TESTS
**Goal:** Prove failures are handled, not hidden.
- [ ] Simulate network failures, database connection errors.
- [ ] Verify graceful degradation and proper error messages.
- [ ] Ensure errors are logged or bubbled up appropriately.
- [ ] Test with malformed input (wrong types, missing required fields).
- [ ] Verify that partial failures do not leave the system in inconsistent state.
- [ ] Test retry logic and exponential backoff if implemented.
- [ ] Check that sensitive information is not leaked in error messages.

**Example:**
```js
// ✅ Asserts the specific failure contract, not just "it threw"
await expect(fetchUser(-1)).rejects.toThrow('user id must be positive');
```

### 5. INTEGRATION_TESTS (When Applicable)
**Goal:** Verify components work together against real boundaries.
- [ ] Test actual database queries against test database.
- [ ] Verify API contract compliance with real or sandbox endpoints.
- [ ] Test file I/O operations with temporary files.
- [ ] Test cross-component interactions and data flow.
- [ ] Verify that transactions are properly committed or rolled back.
- [ ] Test with realistic data volumes to catch performance issues.

### 6. MOCK_STRATEGY
**Goal:** Mock the edges of the system, never its core.
- [ ] Mock only external I/O (network, filesystem, time).
- [ ] Do not mock the function under test or its core logic.
- [ ] Use spies for verifying side effects (email sent, log written).
- [ ] Ensure mocks return realistic data, not just empty objects.
- [ ] Verify that mocks are reset between tests.
- [ ] Test both success and failure paths of mocked dependencies.

### 7. PROPERTY_BASED_TESTS (When Applicable)
**Goal:** Assert invariants that must hold for all valid inputs.
- [ ] Generate random valid inputs to test invariants.
- [ ] Verify that operations are idempotent where expected.
- [ ] Check that round-trip conversions preserve data.
- [ ] Test that sorting and filtering produce correct orderings.

**Example:**
```js
// ✅ Round-trip invariant: decode(encode(x)) === x for all valid x
fc.assert(fc.property(fc.string(), s => decode(encode(s)) === s));
```

### 8. TEST_ORGANIZATION
**Goal:** Tests read as living specification.
- [ ] Group related tests using describe/context blocks.
- [ ] Use descriptive test names that read as specifications.
- [ ] Follow AAA pattern (Arrange, Act, Assert) for clarity.
- [ ] Ensure tests are independent and can run in any order.
- [ ] Add setup/teardown hooks only when necessary.

## 📤 Output Directives
Generate test code in the project's existing testing framework — detect it from the dependency manifest (Jest, Vitest, Mocha, pytest, JUnit, Go testing, etc.) rather than introducing a new one. Use descriptive test names that explain the scenario. Group related tests with describe blocks.

Coverage target: 80%+ lines, but coverage is a floor, not the goal — every branch and error path matters more than the percentage. Prefer one strong behavioral test over five trivial ones.

After generating, run the suite and confirm it passes before reporting done.
