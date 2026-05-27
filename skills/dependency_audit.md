---
name: "dependency_audit"
description: "Audits project dependencies for security vulnerabilities, license conflicts, and maintenance status. Invoke when checking dependency health, before major releases, or during security reviews."
---

# SKILL: Dependency Health Audit

## 🎯 Objective
Maintain a secure, maintainable, and legally compliant dependency tree. Identify risks from outdated packages, vulnerable libraries, and license incompatibilities.

## 🧠 Core Principle: Proactive Risk Management
Dependencies are attack vectors and maintenance burdens. Regular audits prevent supply chain attacks and reduce technical debt accumulation.

## 🛠️ Execution Pipeline

### 1. INVENTORY_COLLECTION
- [ ] Parse package managers (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, Gemfile).
- [ ] List all direct and transitive dependencies with exact versions.
- [ ] Identify unused dependencies (imported but never called).
- [ ] Categorize dependencies by purpose (runtime, dev, peer, optional).
- [ ] Map dependency relationships to identify critical paths.
- [ ] Check for pinned vs unpinned version specifications.

### 2. VULNERABILITY_SCAN
- [ ] Query CVE databases for known vulnerabilities in each package.
- [ ] Prioritize Critical and High severity issues.
- [ ] Check if fixes are available in newer versions.
- [ ] Verify vulnerability disclosures from package maintainers.
- [ ] Check for supply chain attack indicators (sudden ownership changes, unusual updates).
- [ ] Review security advisories from package registries.

### 3. MAINTENANCE_STATUS
- [ ] Verify each package has recent commits (within 12 months).
- [ ] Check for deprecation warnings or maintenance mode notices.
- [ ] Identify packages with single maintainers or abandoned repos.
- [ ] Verify that packages have active issue tracking and PR reviews.
- [ ] Check for breaking change announcements in changelogs.
- [ ] Verify package download statistics and community adoption.

### 4. LICENSE_COMPLIANCE
- [ ] Catalog license types for all dependencies.
- [ ] Flag copyleft licenses (GPL, AGPL, LGPL) that may conflict with project licensing.
- [ ] Verify commercial use is permitted for all dependencies.
- [ ] Check for license compatibility between interdependent packages.
- [ ] Verify that license texts are included in distributions.
- [ ] Check for patent grants and contributor license agreements.

### 5. DUPLICATE_DETECTION
- [ ] Identify packages providing overlapping functionality.
- [ ] Flag multiple versions of the same package in the tree.
- [ ] Recommend consolidation where possible.
- [ ] Check for conflicting transitive dependencies.
- [ ] Identify packages that could be replaced by standard library features.

### 6. SIZE_IMPACT_ANALYSIS
- [ ] Calculate bundle size contribution of each dependency.
- [ ] Identify heavy dependencies with lighter alternatives.
- [ ] Check for tree-shaking compatibility.
- [ ] Analyze impact on startup time and memory footprint.
- [ ] Verify that only necessary modules are imported from large packages.

### 7. UPDATE_RISK_ASSESSMENT
- [ ] Identify packages with available security patches.
- [ ] Check for breaking changes in major version updates.
- [ ] Verify that update paths are documented.
- [ ] Assess testing requirements for each potential update.
- [ ] Prioritize updates by risk/reward ratio.

### 8. ALTERNATIVE_EVALUATION
- [ ] Research actively maintained alternatives for problematic packages.
- [ ] Compare feature parity, performance, and community support.
- [ ] Verify that migration effort is justified by risk reduction.
- [ ] Check for official migration guides from package maintainers.

## 📤 Output Directives
Output format: `[SEVERITY] Package@version: Issue description. Recommended action.`
Group by: Critical Security, High Security, Maintenance Risk, License Conflict, Optimization Opportunity.