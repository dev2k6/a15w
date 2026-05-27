---
name: "test_generation"
description: "Generates comprehensive unit and integration tests with edge case coverage. Invoke when user requests test creation, test coverage improvement, or before committing new features."
---

# SKILL: Automated Test Generation

## 🎯 Objective
Generate thorough, meaningful test suites for code changes. Focus on business logic validation, edge cases, and error scenarios rather than trivial syntax checks.

## 🧠 Core Principle: Test Real Behavior
Write tests that verify actual business outcomes and failure modes. Avoid over-mocking that renders tests meaningless. Each test must assert something non-obvious about the code's behavior.

## 🛠️ Execution Pipeline

### 1. ANALYZE_FUNCTION_SIGNATURE
- [ ] Identify all parameters, return types, and side effects.
- [ ] Map external dependencies (databases, APIs, file system).
- [ ] Determine which dependencies require mocking vs real integration.
- [ ] Identify synchronous vs asynchronous behavior.
- [ ] Document expected exceptions and error conditions.

### 2. HAPPY_PATH_TESTS
- [ ] Create tests for expected valid inputs producing expected outputs.
- [ ] Cover all primary execution branches in the code.
- [ ] Ensure assertions validate actual business logic, not just "function runs."
- [ ] Test with realistic, production-like data (not trivial "foo"/"bar" values).
- [ ] Verify that return values match expected types and structures.

### 3. EDGE_CASE_TESTS
- [ ] Test null/undefined inputs where applicable.
- [ ] Test empty collections, zero values, boundary numbers.
- [ ] Test maximum length strings, special characters, unicode input.
- [ ] Verify timeout handling and slow response scenarios.
- [ ] Test with minimum valid values and maximum valid values.
- [ ] Check behavior at type boundaries (INT_MAX, INT_MIN, Number.MAX_SAFE_INTEGER).
- [ ] Test with duplicate values in collections.
- [ ] Verify handling of circular references if applicable.

### 4. ERROR_HANDLING_TESTS
- [ ] Simulate network failures, database connection errors.
- [ ] Verify graceful degradation and proper error messages.
- [ ] Ensure errors are logged or bubbled up appropriately.
- [ ] Test with malformed input (wrong types, missing required fields).
- [ ] Verify that partial failures do not leave the system in inconsistent state.
- [ ] Test retry logic and exponential backoff if implemented.
- [ ] Check that sensitive information is not leaked in error messages.

### 5. INTEGRATION_TESTS (When Applicable)
- [ ] Test actual database queries against test database.
- [ ] Verify API contract compliance with real or sandbox endpoints.
- [ ] Test file I/O operations with temporary files.
- [ ] Test cross-component interactions and data flow.
- [ ] Verify that transactions are properly committed or rolled back.
- [ ] Test with realistic data volumes to catch performance issues.

### 6. MOCK_STRATEGY
- [ ] Mock only external I/O (network, filesystem, time).
- [ ] Do not mock the function under test or its core logic.
- [ ] Use spies for verifying side effects (email sent, log written).
- [ ] Ensure mocks return realistic data, not just empty objects.
- [ ] Verify that mocks are reset between tests.
- [ ] Test both success and failure paths of mocked dependencies.

### 7. PROPERTY_BASED_TESTS (When Applicable)
- [ ] Generate random valid inputs to test invariants.
- [ ] Verify that operations are idempotent where expected.
- [ ] Check that round-trip conversions preserve data.
- [ ] Test that sorting and filtering produce correct orderings.

### 8. TEST_ORGANIZATION
- [ ] Group related tests using describe/context blocks.
- [ ] Use descriptive test names that read as specifications.
- [ ] Follow AAA pattern (Arrange, Act, Assert) for clarity.
- [ ] Ensure tests are independent and can run in any order.
- [ ] Add setup/teardown hooks only when necessary.

## 📤 Output Directives
Generate test code in the project's testing framework. Include descriptive test names that explain the scenario being tested. Group related tests with describe blocks. Aim for 80%+ code coverage with meaningful assertions.