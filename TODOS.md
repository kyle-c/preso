# TODOS

## Phase 2: Structural Refactoring (after Phase 1 quality fixes)

### P1 — High Priority

- [ ] **Split generate/route.ts (2,573 lines)**
  Extract to: `lib/prompt-builder.ts`, `lib/provider-adapter.ts`, `lib/stream-orchestrator.ts`, `lib/vision-preprocessor.ts`.
  **Why:** Single largest file, mixes HTTP handling with prompt engineering and streaming. Untestable as-is.
  **Effort:** L (human: ~1 week / CC: ~30 min)

- [ ] **Split create/[id]/page.tsx (2,107 lines, 40+ state vars)**
  Extract: `<CommentsPanel>`, `<EditPanel>`, `<SidebarPanel>`, and move state to `useReducer` or Zustand.
  **Why:** Every state change re-renders everything. Impossible to reason about data flow.
  **Effort:** L (human: ~1 week / CC: ~30 min)

- [ ] **Centralize color palette**
  Colors are defined 4x in slide-renderer.tsx plus brand-kit.ts. Create single source of truth.
  **Why:** Color changes require updating multiple files. Already caused inconsistency bugs.
  **Effort:** S (human: ~2 hours / CC: ~10 min)

- [ ] **Extract auth middleware**
  26 API routes each independently call `getServerSession()` with identical error handling.
  **Why:** DRY violation. Every new route copies the same 3 lines.
  **Effort:** S (human: ~2 hours / CC: ~10 min)

### P2 — Medium Priority

- [ ] **Structured logging (Winston/Pino)**
  Replace 45+ console.log calls with structured JSON logs including request IDs and timestamps.
  **Why:** Can't debug production issues with console.log. No request tracing.
  **Effort:** M (human: ~3 days / CC: ~20 min)

- [ ] **Generation metrics**
  Track: success rate by provider/model, latency p50/p95/p99, prompt token usage, error types.
  **Why:** No visibility into which providers fail, how long generations take, or error patterns.
  **Effort:** M (human: ~3 days / CC: ~20 min)

- [ ] **P2 unit tests**
  Add tests for: `detectNarrative()`, `analyzeDataShape()`, `serializeBrandForPrompt()`.
  **Why:** Complete deterministic function coverage. Already tested P1 functions in Phase 1.
  **Effort:** S (human: ~4 hours / CC: ~15 min)

- [ ] **Split slide-renderer.tsx (2,010 lines)**
  Extract: chart rendering, comments layer, navigation controls, TOC.
  **Why:** Second-largest component. Multiple responsibilities tangled.
  **Effort:** M (human: ~3 days / CC: ~20 min)

- [ ] **Redis graceful degradation**
  When Redis is down, disable write features (save, edit, generate) but keep read-only slide viewing functional.
  **Why:** Phase 1 adds try/catch + toast for Redis errors, but the app still crashes on write operations. Graceful degradation would let users at least view existing presentations during outages.
  **Depends on:** Phase 1 Redis error handling (try/catch + toast)
  **Effort:** M (human: ~3 days / CC: ~20 min)

### P3 — Lower Priority

- [ ] **Per-slide Coach suggestions UI**
  Infrastructure exists (coachSummary runs). Need visual indicators on individual slides showing quality issues.
  **Why:** Coach runs but results aren't visible per-slide, only in aggregate.
  **Effort:** S (human: ~4 hours / CC: ~15 min)

- [ ] **Custom font @font-face loading**
  Uploaded custom fonts are stored but not injected as @font-face in the slide renderer.
  **Why:** Brand kit font uploads don't actually affect rendering.
  **Effort:** S (human: ~4 hours / CC: ~10 min)

- [ ] **Revision history pagination**
  Currently loads all 30 revisions at once. Add pagination or lazy loading for large histories.
  **Why:** Performance concern as revision count grows. Silent cap at 30 loses older data.
  **Effort:** S (human: ~2 hours / CC: ~10 min)

## Deferred (from CEO Plan — not in current roadmap)

- Multi-tenancy / workspace isolation (wait for SaaS decision)
- Custom domain for shared links
- Version history / presentation diff
- AI-powered slide design suggestions
- Figma integration
- Google Slides OAuth export
