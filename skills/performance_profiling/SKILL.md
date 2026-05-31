---
name: "performance_profiling"
description: "Identifies performance bottlenecks and optimization opportunities in code. Invoke when addressing slow operations, high resource usage, or preparing for scale."
---

# SKILL: Performance Bottleneck Analysis

## 🎯 Objective
Systematically identify and quantify performance issues. Provide actionable optimization recommendations with measurable impact estimates.

## 🧠 Core Principle: Measure First, Optimize Second
Never optimize based on assumptions. Profile actual execution to find real bottlenecks. Focus optimization effort on the 20% of code causing 80% of latency.

## 📊 Impact Legend
- `CRITICAL` — Dominant cost (largest share of latency/memory) or a hard scaling ceiling. Fix first.
- `HIGH` — Significant, measured cost worth fixing this cycle.
- `MEDIUM` — Real but secondary cost.
- `LOW` — Minor or speculative; note and defer.

## ✅ Verification Discipline
Every finding must cite a measurement, not a hunch. "This loop looks slow" is not a finding; "this loop is 62% of request time (profiler, n=1k)" is. State the tool, the workload, and the number. If you could not measure, label the item explicitly as a hypothesis to validate, not a confirmed bottleneck.

**Tooling by ecosystem:** Node `--prof` / clinic.js / `0x`; Python `cProfile` / `py-spy`; JVM async-profiler / JFR; Go `pprof`; browser DevTools Performance panel; DB `EXPLAIN ANALYZE`.

## 🛠️ Execution Pipeline

### 1. BASELINE_MEASUREMENT
**Goal:** Quantify "now" before changing anything.
- [ ] Record current response times under typical load.
- [ ] Measure memory usage patterns during execution.
- [ ] Capture CPU utilization and I/O wait times.
- [ ] Document throughput (requests/second, operations/second).
- [ ] Measure startup time and initialization overhead.
- [ ] Record resource consumption (file descriptors, connections).

**How to verify:** Capture percentiles (p50/p95/p99), not just averages — averages hide tail latency that users actually feel.

### 2. HOT_PATH_IDENTIFICATION
**Goal:** Find where the time actually goes.
- [ ] Profile function call frequency and duration.
- [ ] Identify the slowest 10% of operations by cumulative time.
- [ ] Map the call graph to find repeated expensive operations.
- [ ] Identify synchronous operations blocking async flows.
- [ ] Find operations with high variance in execution time.
- [ ] Locate memory allocation hotspots.

### 3. ALGORITHM_ANALYSIS
**Goal:** Fix complexity, not just constants.
- [ ] Check time complexity of core algorithms (O(n²) loops, etc.).
- [ ] Identify unnecessary nested iterations.
- [ ] Flag operations that could use more efficient data structures.
- [ ] Check for redundant computations that could be cached.
- [ ] Identify opportunities for early termination or short-circuiting.
- [ ] Verify that sorting is only done when necessary.

**Example:**
```js
// ❌ O(n²): nested scan to find matches
const dups = a.filter(x => b.includes(x));

// ✅ O(n): hash set lookup
const set = new Set(b);
const dups = a.filter(x => set.has(x));
```

### 4. I/O_ANALYSIS
**Goal:** Stop waiting on the network and disk.
- [ ] Detect N+1 query patterns in database access.
- [ ] Identify synchronous I/O blocking the event loop.
- [ ] Check for missing caching on expensive computations.
- [ ] Verify that database connections are properly pooled.
- [ ] Check for unnecessary file system operations.
- [ ] Identify network calls that could be batched or parallelized.
- [ ] Verify that streaming is used for large data transfers.

**Example:**
```js
// ❌ Serial awaits: total time = sum of all calls
for (const id of ids) results.push(await fetch(id));

// ✅ Parallel: total time ≈ slowest call
const results = await Promise.all(ids.map(fetch));
```

### 5. MEMORY_ANALYSIS
**Goal:** Find leaks and allocation churn.
- [ ] Detect memory leaks (objects retained but unused).
- [ ] Identify unnecessary object allocations in hot paths.
- [ ] Check for large data structures loaded entirely into memory.
- [ ] Verify that buffers and caches have appropriate size limits.
- [ ] Check for string concatenation in loops (creates many intermediate objects).
- [ ] Identify opportunities for object pooling or reuse.
- [ ] Verify garbage collection frequency and impact.

### 6. CONCURRENCY_REVIEW
**Goal:** Use the cores without breaking correctness.
- [ ] Verify parallelization opportunities are exploited.
- [ ] Check for lock contention or race conditions.
- [ ] Identify sequential operations that could run concurrently.
- [ ] Verify that thread/process pools are sized appropriately.
- [ ] Check for deadlocks or livelocks.
- [ ] Verify that async operations are properly awaited.

### 7. DATABASE_PERFORMANCE
**Goal:** Make the database do less work.
- [ ] Analyze query execution plans for expensive operations.
- [ ] Verify that indexes are used effectively.
- [ ] Check for missing indexes on frequently queried columns.
- [ ] Identify queries that could benefit from denormalization.
- [ ] Verify that connection pooling is configured optimally.
- [ ] Check for long-running transactions that hold locks.

**How to verify:** Run `EXPLAIN ANALYZE` on slow queries. A `Seq Scan` over a large table on a filtered column usually means a missing index.

### 8. CACHING_ANALYSIS
**Goal:** Reuse work safely.
- [ ] Identify opportunities for result caching.
- [ ] Verify that cache invalidation is correct and timely.
- [ ] Check cache hit rates and miss penalties.
- [ ] Verify that cache keys are appropriately granular.
- [ ] Identify opportunities for HTTP caching (ETag, Cache-Control).
- [ ] Check for CDN opportunities for static assets.

### 9. NETWORK_OPTIMIZATION
**Goal:** Move fewer bytes, fewer times.
- [ ] Verify that response compression is enabled (gzip, brotli).
- [ ] Check for unnecessary data transfer (over-fetching).
- [ ] Verify that keep-alive connections are used.
- [ ] Check for HTTP/2 or HTTP/3 adoption.
- [ ] Identify opportunities for request batching or GraphQL.

### 10. SCALABILITY_ASSESSMENT
**Goal:** Confirm it holds under growth.
- [ ] Test behavior under increasing load.
- [ ] Identify resource exhaustion points (file descriptors, memory).
- [ ] Verify horizontal scaling capability.
- [ ] Check for state that prevents distributed deployment.
- [ ] Identify single points of failure or bottlenecks.

## 📤 Output Directives
Report format: `[IMPACT] Location: current cost → projected cost. Technique. (measurement source)`

**Example output:**
```
[CRITICAL] getDashboard(): 1,200ms p95, 90% in N+1 order lookup (450 queries). Batch to 1 query → ~120ms. (clinic.js)
[HIGH]     search(): O(n²) dedupe over ~5k items, 380ms. Use Set → ~15ms. (cProfile)
[MEDIUM]   /assets/*: no gzip, 2.1MB transfer. Enable brotli → ~400KB. (DevTools)
[LOW]      config parse on each request, ~3ms. Cache at startup. (manual timing)
```
