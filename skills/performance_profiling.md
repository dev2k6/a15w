---
name: "performance_profiling"
description: "Identifies performance bottlenecks and optimization opportunities in code. Invoke when addressing slow operations, high resource usage, or preparing for scale."
---

# SKILL: Performance Bottleneck Analysis

## 🎯 Objective
Systematically identify and quantify performance issues. Provide actionable optimization recommendations with measurable impact estimates.

## 🧠 Core Principle: Measure First, Optimize Second
Never optimize based on assumptions. Profile actual execution to find real bottlenecks. Focus optimization effort on the 20% of code causing 80% of latency.

## 🛠️ Execution Pipeline

### 1. BASELINE_MEASUREMENT
- [ ] Record current response times under typical load.
- [ ] Measure memory usage patterns during execution.
- [ ] Capture CPU utilization and I/O wait times.
- [ ] Document throughput (requests/second, operations/second).
- [ ] Measure startup time and initialization overhead.
- [ ] Record resource consumption (file descriptors, connections).

### 2. HOT_PATH_IDENTIFICATION
- [ ] Profile function call frequency and duration.
- [ ] Identify the slowest 10% of operations by cumulative time.
- [ ] Map the call graph to find repeated expensive operations.
- [ ] Identify synchronous operations blocking async flows.
- [ ] Find operations with high variance in execution time.
- [ ] Locate memory allocation hotspots.

### 3. ALGORITHM_ANALYSIS
- [ ] Check time complexity of core algorithms (O(n²) loops, etc.).
- [ ] Identify unnecessary nested iterations.
- [ ] Flag operations that could use more efficient data structures.
- [ ] Check for redundant computations that could be cached.
- [ ] Identify opportunities for early termination or short-circuiting.
- [ ] Verify that sorting is only done when necessary.

### 4. I/O_ANALYSIS
- [ ] Detect N+1 query patterns in database access.
- [ ] Identify synchronous I/O blocking the event loop.
- [ ] Check for missing caching on expensive computations.
- [ ] Verify that database connections are properly pooled.
- [ ] Check for unnecessary file system operations.
- [ ] Identify network calls that could be batched or parallelized.
- [ ] Verify that streaming is used for large data transfers.

### 5. MEMORY_ANALYSIS
- [ ] Detect memory leaks (objects retained but unused).
- [ ] Identify unnecessary object allocations in hot paths.
- [ ] Check for large data structures loaded entirely into memory.
- [ ] Verify that buffers and caches have appropriate size limits.
- [ ] Check for string concatenation in loops (creates many intermediate objects).
- [ ] Identify opportunities for object pooling or reuse.
- [ ] Verify garbage collection frequency and impact.

### 6. CONCURRENCY_REVIEW
- [ ] Verify parallelization opportunities are exploited.
- [ ] Check for lock contention or race conditions.
- [ ] Identify sequential operations that could run concurrently.
- [ ] Verify that thread/process pools are sized appropriately.
- [ ] Check for deadlocks or livelocks.
- [ ] Verify that async operations are properly awaited.

### 7. DATABASE_PERFORMANCE
- [ ] Analyze query execution plans for expensive operations.
- [ ] Verify that indexes are used effectively.
- [ ] Check for missing indexes on frequently queried columns.
- [ ] Identify queries that could benefit from denormalization.
- [ ] Verify that connection pooling is configured optimally.
- [ ] Check for long-running transactions that hold locks.

### 8. CACHING_ANALYSIS
- [ ] Identify opportunities for result caching.
- [ ] Verify that cache invalidation is correct and timely.
- [ ] Check cache hit rates and miss penalties.
- [ ] Verify that cache keys are appropriately granular.
- [ ] Identify opportunities for HTTP caching (ETag, Cache-Control).
- [ ] Check for CDN opportunities for static assets.

### 9. NETWORK_OPTIMIZATION
- [ ] Verify that response compression is enabled (gzip, brotli).
- [ ] Check for unnecessary data transfer (over-fetching).
- [ ] Verify that keep-alive connections are used.
- [ ] Check for HTTP/2 or HTTP/3 adoption.
- [ ] Identify opportunities for request batching or GraphQL.

### 10. SCALABILITY_ASSESSMENT
- [ ] Test behavior under increasing load.
- [ ] Identify resource exhaustion points (file descriptors, memory).
- [ ] Verify horizontal scaling capability.
- [ ] Check for state that prevents distributed deployment.
- [ ] Identify single points of failure or bottlenecks.

## 📤 Output Directives
Report format: `[IMPACT] Location: Current cost → Potential cost after optimization. Specific technique to apply.`