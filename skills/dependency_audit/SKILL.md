---
name: "dependency_audit"
description: "Audits project dependencies for security vulnerabilities, license conflicts, and maintenance status. Invoke when checking dependency health, before major releases, or during security reviews."
---

# SKILL: Dependency Health Audit

## 🎯 Objective
Maintain a secure, maintainable, and legally compliant dependency tree. Identify risks from outdated packages, vulnerable libraries, and license incompatibilities.

## 🧠 Core Principle: Proactive Risk Management
Dependencies are attack vectors and maintenance burdens. Regular audits prevent supply chain attacks and reduce technical debt accumulation.

## 📊 Severity Legend
- `CRITICAL` — Known exploited/critical CVE, or malicious package. Remove or patch now.
- `HIGH` — High-severity CVE or unmaintained package on a critical path.
- `MEDIUM` — License conflict, abandoned non-critical package, or duplicate.
- `LOW` — Optimization opportunity (bundle size, consolidation).
- `OK` — Verified healthy.

## ✅ Verification Discipline
Use real tooling and data, never recall. Vulnerability claims must trace to an advisory ID (CVE/GHSA/OSV). License claims must trace to the package's actual license field/file. If a tool is unavailable in the environment, say so rather than inventing results.

**Tooling by ecosystem:**
- Node: `npm audit --json`, `npm outdated`, `osv-scanner`
- Python: `pip-audit`, `safety check`
- Go: `govulncheck ./...`
- Rust: `cargo audit`
- Multi: `osv-scanner`, `trivy fs`

## 🛠️ Execution Pipeline

### 1. INVENTORY_COLLECTION
**Goal:** Know exactly what is in the tree.
- [ ] Parse package managers (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, Gemfile).
- [ ] List all direct and transitive dependencies with exact versions.
- [ ] Identify unused dependencies (imported but never called).
- [ ] Categorize dependencies by purpose (runtime, dev, peer, optional).
- [ ] Map dependency relationships to identify critical paths.
- [ ] Check for pinned vs unpinned version specifications.

### 2. VULNERABILITY_SCAN
**Goal:** Find known CVEs, worst-first.
- [ ] Query CVE databases for known vulnerabilities in each package.
- [ ] Prioritize Critical and High severity issues.
- [ ] Check if fixes are available in newer versions.
- [ ] Verify vulnerability disclosures from package maintainers.
- [ ] Check for supply chain attack indicators (sudden ownership changes, unusual updates).
- [ ] Review security advisories from package registries.

**How to verify:** Run the ecosystem scanner and cite the advisory ID + fixed version for every finding. Distinguish runtime exposure from dev-only (a dev-only CVE is usually lower priority).

### 3. MAINTENANCE_STATUS
**Goal:** Avoid betting on abandoned code.
- [ ] Verify each package has recent commits (within 12 months).
- [ ] Check for deprecation warnings or maintenance mode notices.
- [ ] Identify packages with single maintainers or abandoned repos.
- [ ] Verify that packages have active issue tracking and PR reviews.
- [ ] Check for breaking change announcements in changelogs.
- [ ] Verify package download statistics and community adoption.

### 4. LICENSE_COMPLIANCE
**Goal:** Ship legally.
- [ ] Catalog license types for all dependencies.
- [ ] Flag copyleft licenses (GPL, AGPL, LGPL) that may conflict with project licensing.
- [ ] Verify commercial use is permitted for all dependencies.
- [ ] Check for license compatibility between interdependent packages.
- [ ] Verify that license texts are included in distributions.
- [ ] Check for patent grants and contributor license agreements.

**Quick reference:** MIT/BSD/Apache-2.0 are permissive and generally safe. GPL/AGPL are strong copyleft — flag for legal review if the project ships as proprietary/SaaS. "UNLICENSED" or missing license = treat as `MEDIUM` until clarified.

### 5. DUPLICATE_DETECTION
**Goal:** Trim redundancy and version conflicts.
- [ ] Identify packages providing overlapping functionality.
- [ ] Flag multiple versions of the same package in the tree.
- [ ] Recommend consolidation where possible.
- [ ] Check for conflicting transitive dependencies.
- [ ] Identify packages that could be replaced by standard library features.

### 6. SIZE_IMPACT_ANALYSIS
**Goal:** Keep the footprint honest.
- [ ] Calculate bundle size contribution of each dependency.
- [ ] Identify heavy dependencies with lighter alternatives.
- [ ] Check for tree-shaking compatibility.
- [ ] Analyze impact on startup time and memory footprint.
- [ ] Verify that only necessary modules are imported from large packages.

### 7. UPDATE_RISK_ASSESSMENT
**Goal:** Sequence upgrades by risk/reward.
- [ ] Identify packages with available security patches.
- [ ] Check for breaking changes in major version updates.
- [ ] Verify that update paths are documented.
- [ ] Assess testing requirements for each potential update.
- [ ] Prioritize updates by risk/reward ratio.

### 8. ALTERNATIVE_EVALUATION
**Goal:** Replace problem packages with justified swaps.
- [ ] Research actively maintained alternatives for problematic packages.
- [ ] Compare feature parity, performance, and community support.
- [ ] Verify that migration effort is justified by risk reduction.
- [ ] Check for official migration guides from package maintainers.

## 📤 Output Directives
Output format: `[SEVERITY] package@version: Issue (advisory ID). Recommended action.`
Group by: Critical Security, High Security, Maintenance Risk, License Conflict, Optimization Opportunity.

**Example output:**
```
CRITICAL SECURITY
  [CRITICAL] lodash@4.17.4: Prototype pollution (CVE-2019-10744). Upgrade to >=4.17.12.
HIGH SECURITY
  [HIGH] minimist@0.0.8: Prototype pollution (CVE-2020-7598). Upgrade to >=1.2.6.
MAINTENANCE RISK
  [MEDIUM] left-pad@1.0.0: No commits in 4 years, single maintainer. Replace with String.prototype.padStart.
LICENSE CONFLICT
  [MEDIUM] some-lib@2.1.0: AGPL-3.0 conflicts with proprietary distribution. Legal review required.
```
