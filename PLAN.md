# GuildMaster — FSD + Pinia Refactoring Plan

## Health Summary

This is a small, well-organized FSD game ("GuildMaster") with **strong structural hygiene but weak architectural enforcement**. **FSD compliance is ~70%**: all six layers exist and are correctly named, and every slice ships an `index.ts` Public API — but there is one genuine upward-layer import (a `features` slice importing from `app`), several deep cross-slice imports that bypass Public APIs, and heavy entity↔entity coupling in stores. **Pinia usage is functional but off-spec**: every store uses the **Options API** object style (the brief calls for `setup`-style stores), and substantial **business logic leaks into components/widgets** (`ForecastBlock`, `StartContract`, `OfferPayDebtsModal`, `App.vue`). **TypeScript strictness is good**: `strict` is on, there is **no `any` in application code** (only the generated `env.d.ts` shim), props/emits are fully typed everywhere — the main gaps are a few unsafe `as` casts and one untyped `Set`. **Layout readiness at 1280×720 is the weakest area**: there are no media queries (good — nothing breaks *below* 1280), but the app shell uses `100vw`-based widths (scrollbar overflow) and a **broken SCSS selector that means the combined header+footer height is never applied**, which clips content at 720px height. **Tests: 0%** — no Vitest, no Vue Test Utils, no test files at all.

---

# Phase 1 — Codebase Analysis

## 1. FSD Compliance

### Layers

All present and correctly named: `app`, `pages`, `widgets`, `features`, `entities`, `shared`. ✅

### Layer violations (lower importing higher) — 1 critical

| File | Offending import |
|---|---|
| `src/features/LoadGame/lib/useTryLoadLastGame.ts:2` | `import { router } from '@/app/providers'` |

A `features` slice imports the router singleton from `app`. This is a hard FSD violation (feature → app). It's also called from 4 pages: `GuildPage`, `ContractsBoardPage`, `GuildMercenariesPage`, `HiringMarketPage`.

### Cross-slice / deep imports bypassing the Public API

| File | Offending import | Problem |
|---|---|---|
| `widgets/ForecastBlock/ui/ForecastBlock.vue:10-11` | `@/entities/Guild/lib/getContractSuccessChance.ts`, `.../getGuildMercenaryContractPower.ts` | reaches into Guild internals; not re-exported by `Guild/index.ts` |
| `features/StartContract/ui/StartContract.vue:4,11,12` | `@/entities/Guild/config/GuildContract.config.ts`, `Guild/lib/...` | deep into Guild config + lib |
| `entities/Game/model/Game.store.ts:6,9` | `@/entities/ContractsBoard/model/BoardContract.builder.ts`, `@/entities/Contract/api/Contract.service.ts` | **cross-entity** deep imports; `contractService`/`buildBoardContract` aren't in those slices' Public APIs |
| `entities/Log/model/Log.store.ts:6` | `@/entities/Guild/config/GuildMercenary.config.ts` | **cross-entity** (Log → Guild) deep import |
| `entities/Guild/model/Guild.store.ts:8,9,26` | `@/entities/HiringMarket`, `@/entities/ContractsBoard`, `@/entities/Log`, `@/entities/Mercenary` | entity↔entity coupling (goes through Public API, but strict FSD forbids entity→entity) |

### Public API coverage

Every slice has `index.ts`. ✅ But the APIs are incomplete: Guild's externally-used `lib`/`config` helpers and ContractsBoard's `buildBoardContract` / Contract's `contractService` are consumed via deep paths because they're not exported.

### Business logic leaking into components / non-store composables

- `widgets/ForecastBlock/ui/ForecastBlock.vue:56-131` — full 7-day cashflow projection (contract income, salary scheduling) in a widget.
- `features/StartContract/ui/StartContract.vue:24-45` — squad power + success-chance + min-power-to-start computation.
- `features/OfferPayDebts/ui/OfferPayDebtsModal.vue:18-29` — greedy debt-settlement algorithm `buildGreedySelection`.
- `app/App.vue:53-59` — `shouldOfferDebtSettlement()` domain rule.
- `features/LoadGame/lib/useTryLoadLastGame.ts` — game-loading orchestration in a composable instead of a store action.
- `features/WatchGuildMainInfo/ui/WatchGuildMainInfo.vue:22-37` — completed/failed contract counting inline in the template.

### God-widgets / god-features

- `ForecastBlock` (307 lines, the largest non-store file, all logic) and `StartContract` (242 lines) are the main offenders.
- The `Game` store is a god-store (see §2).

### `shared/` usage

Correct. `shared/ui/Base*` is a clean UI kit, `shared/lib/random` is framework-agnostic, `shared/model/AppModal` + `AppNavigation` are legitimately app-wide UI state. No domain logic has leaked into `shared`. ✅

---

## 2. Pinia Store Quality

**Stores:** `guild`, `contractsBoard`, `hiringMarket`, `game`, `log` (entities) + `appModal` (shared).

| Criterion | Status |
|---|---|
| All business logic in stores | ❌ Leaks in components (see §1) |
| Composition API (`setup`) style | ❌ All 6 stores use Options API object form |
| TypeScript types for state/getters/actions | ✅ Good |
| Stores with too many responsibilities | ❌ `Game`, `Guild` |
| State mutation outside actions | ✅ None |
| Missing stores for domains | ❌ Forecast, debt-settlement, contract preview need store homes |
| Testing-friendly state init | ✅ Pure `state()` initializers |

### Too many responsibilities

- **`Game.store.ts`** mixes persistence (localStorage save/load/parse), the day-loop orchestrator (`finishDay`), and content generation (`addNewMercenariesToMarket`, `addNewContractsToBoard`). Three concerns.
- **`Guild.store.ts`** (350 lines) handles mercenaries, contracts, money/fame/reputation, salary, debt, morale, and contract resolution.

### Bug

`Game.store.ts:151-156` — `initLastSavedGame()` sorts `updatedAt` **ascending** and takes `[0]` — that loads the **oldest** save, not the latest.

---

## 3. Vue 3 + TypeScript Quality

### `any` usage

None in app code. Only `src/env.d.ts:3` (`DefineComponent<{}, {}, any>` — standard Vue SFC shim, acceptable). ✅

### Type assertions (`as`) bypassing typing

| File | Line | Context |
|---|---|---|
| `entities/Game/model/Game.store.ts` | 59 | `JSON.parse(raw) as Record<string, SavedGame>` — unvalidated cast over persisted data |
| `app/App.vue` | 30, 35 | `as RouteName` / `as NavigationRouteName` inside type guards |
| `shared/ui/BaseCheckbox/BaseCheckbox.vue` | 15 | `as HTMLInputElement` on event target (idiomatic) |
| `shared/ui/BaseInput/BaseInput.vue` | 40 | `as HTMLInputElement` on event target (idiomatic) |

### Props / emits

- Every component uses `defineProps<…>()`. ✅
- Every component uses `defineEmits<…>()`. ✅

### `ref` vs `reactive`

No `reactive`-wrapped primitives. One weak type: `OfferPayDebtsModal.vue:31` — `ref(new Set())` → inferred `Set<unknown>`; should be `ref<Set<string>>(new Set())`.

### Watchers

- `OfferPayDebts` watches the specific `() => props.modelValue` ✅
- `WatchContractsList.vue:19-29` uses `watchEffect` that **emits to the parent** to reset the active contract — works, but emitting from a watcher that also reads store arrays is fragile.

### `onUnmounted` cleanup

No timers, intervals, or manual `addEventListener` exist, so no missing cleanup. ✅

### Heavy template expressions

- `WatchGuildMainInfo.vue:22-37` — two `.filter().length` per render
- `StartContract.vue:114-116,137-141` — `Math.round`, per-card `.some()`

---

## 4. Performance

| Issue | Location | Notes |
|---|---|---|
| No route-level lazy loading | `app/providers/router/router.ts:2-8` | All 7 pages imported statically |
| No `defineAsyncComponent` for heavy modals | `StartContract`, `GameMenu`, `OfferPayDebtsModal`, etc. | `StartContract` (242 lines) is a good async candidate |
| Large lists without virtualization | `LogBlock`, `GuildMercenariesBlock`, `GuildContractsBlock`, list features | Volumes small today; log is the long-term risk |
| `immediate: true` expensive watchers | — | None found |
| Heavy Pinia getters | — | Getters are light; expensive work is in component `computed` (wrong layer) |
| Full library imports | — | No lodash/moment; `uuid` tree-shaken |
| Dead dependency | `package.json` | `vue-i18n` installed but never imported |

---

## 5. Tests & Coverage

- **Coverage: 0%.** No Vitest, no `@vue/test-utils`, no `jsdom`/`happy-dom`, no `*.spec.ts`/`*.test.ts`, no `test` script in `package.json`.
- **Critical untested business logic:** entire `Guild` store (contract resolution, morale, salary/debt), `Game` store (save/load/day-loop), random helpers (`chance`, `getChanceWithPity`, `getRandomItems`).
- **Store actions** cannot currently be tested in isolation — no tooling exists.
- **Edge cases unmodeled:** empty board/market, zero-money debt, morale clamping, save-parse failure (`parseSavedGames` catch).

---

## 6. Technical Debt & Duplication

### Duplication

- **Squad-power reduction** in three places: `Guild.store.ts:66-71`, `ForecastBlock.vue:68-71`, `StartContract.vue:24-28`.
- **Expected income math:** `ForecastBlock.vue:75` re-derives `reward.money * getContractSuccessChance(...)`, mirroring `resolveInProgressContract` in the Guild store.

### `console.log` left in code

`features/ChangeSettings/ui/ChangeSettings.vue:15,22,29` — placeholder handlers.

### TODO / FIXME / HACK

None found. ✅

### Deprecated Vue patterns

None — no Options API components, no Vue 2 filters, no `this` in `<script setup>`. (Stores use Options-style Pinia, which is valid Pinia API.)

### Inconsistent error handling

`Game.store` wraps `JSON.parse` in try/catch (`parseSavedGames`) but `localStorage.setItem` in `saveGame` is unguarded (quota errors).

### Dead code

**Unused store actions:**
- `Guild.store`: `removeMoney`, `addReputation`, `removeReputation`, `addFame`, `removeFame`, `updateMercenary`, `updateContract`
- `ContractsBoard.store`: `addNewContract`
- `HiringMarket.store`: `addNewMercenary`

**Other:**
- Unused dependency: `vue-i18n`
- Dead branch: `BaseModal.vue:32` — `if (!props.height && !props.maxHeight)` can never be true (defaults are `'auto'`)

### Naming issues

- `Mercanary.titles.ts`, `mocks/mercanaries.ts` (typo)
- `Log.store`: `addNewContractEven` / `addNewContractEvenMultiple` (should be "Event")
- CSS: `start-contract__available-mernaries-list`

---

## 7. Layout at 1280 × 720px

### Global

- **No media queries** anywhere — no breakpoints below 1280px (no sub-1280 regressions), but also zero responsive adaptation.

### Critical layout bugs

**`100vw` overflow (P0):** `AppLayout.vue:106-109` sets `.app__container { width: 100vw }` and `calc(100vw - 19rem)` *inside* a flex parent that already has `padding: 0 2rem` (`AppLayout.vue:74`). `100vw` includes the vertical scrollbar and ignores parent padding → horizontal overflow at 1280.

**Broken combined-height selector (P0):** `AppLayout.vue:92-96`:

```scss
&--with-header {
  &--with-footer {
    height: calc(100vh - 18.5rem);
  }
}
```

This compiles to `.app__main--with-header--with-footer`, which is **never applied** (the template applies `--with-header` and `--with-footer` as *separate* classes). On every in-game page the content height resolves to `calc(100vh - 13rem)` instead of the intended `18.5rem` of chrome. At **720px height** the real chrome (header ≈8.5rem + footer ≈5rem) exceeds 13rem, so content is sized too tall and the footer/content overlap or clip.

### Font sizes below 14px body minimum

- `ForecastBlock.vue`: `&__metric-label` / `&__events` at `0.75rem` (12px), `&__card-label` `0.8rem`
- `LogBlock`: day separator `0.8rem`

### Tap targets below 32px

`BaseButton` `--sm`: `padding: 0.35rem 0.75rem; font-size: 1rem` → ~27px tall. Used by `BaseModal`'s "Закрыть" button.

### Per-route status at 1280×720

| Route | Status |
|---|---|
| `/menu` | OK (centered start menu) |
| `/guild` | Height-bug + `100vw` overflow; 2-col grid `1fr 18rem` fits |
| `/guild-contracts`, `/guild-mercenaries` | Height-bug + overflow; single scrollable list |
| `/hiring-market`, `/contracts-board` | Height-bug + overflow; 2-col `1fr 1fr` master-detail fits |
| `/log` | Height-bug + overflow; unbounded list relies on inner scroll |

Modals (`StartContract` `min(80vw,1200px) × min(80vh,1000px)` → 1024×576 at this resolution) fit and scroll internally. ✅

---

# Phase 2 — Refactoring Plan

## P0 — Critical

### P0-1. Remove the `features → app` layer violation

- **Problem:** `useTryLoadLastGame` imports the `router` singleton from `app`, inverting FSD layering; navigation side-effects also belong in a store, not a feature composable.
- **Location:** `src/features/LoadGame/lib/useTryLoadLastGame.ts:2`; callers in 4 pages.
- **Solution:**
  1. Move the load-or-redirect decision into `Game` store (e.g. action `ensureGameLoaded()` returning `{ loaded: boolean }`).
  2. Perform `router.push` in the page/feature using `useRouter()` (the composable, not the app singleton).
  3. **Before:** `import { router } from '@/app/providers'`
  4. **After:** `const router = useRouter()` inside the page; store returns load result.
- **Effort:** M
- **Impact:** architecture compliance, testability

### P0-2. Fix the broken app-shell height + `100vw` overflow at 1280×720

- **Problem:** Content height miscalculated (dead combined selector) and `100vw` causes horizontal overflow.
- **Location:** `src/shared/ui/AppLayout/AppLayout.vue:84-96` (height), `104-111` (`100vw`).
- **Solution:**
  1. Replace nested `&--with-header { &--with-footer {…} }` with a real applied class, e.g. `.app__main--with-header.app__main--with-footer { height: calc(100vh - 18.5rem) }`, or use a single flex column where `.app__main` is `flex: 1; min-height: 0` between fixed header/footer.
  2. Replace `width: 100vw` / `calc(100vw - 19rem)` with `width: 100%` / `flex: 1; min-width: 0`.
  3. Verify at exactly 1280×720.
- **Effort:** M
- **Impact:** correctness, visual quality

### P0-3. Move business logic out of components into Pinia

- **Problem:** Domain logic in `ForecastBlock`, `StartContract`, `OfferPayDebtsModal`, `App.vue` breaks the "stores are the only place for business logic" rule and is duplicated.
- **Location:** `ForecastBlock.vue:56-131`; `StartContract.vue:24-45`; `OfferPayDebtsModal.vue:18-29,66-72`; `App.vue:53-59`.
- **Solution:** Add Guild-store getters/actions:
  - `squadPower(mercIds)`
  - `contractSuccessPreview(contract, mercs)`
  - `canSettleAnyDebt`
  - `greedyDebtSelection`
  - `cashflowForecast(days)`
  - Components consume them; keep only view state (`selectedMercenaries`, modal open flags).
  - Collapse the three duplicated squad-power reductions into one store helper.
- **Effort:** L
- **Impact:** architecture compliance, removes duplication, unblocks store testing

### P0-4. Eliminate cross-entity deep imports

- **Problem:** `Game`/`Log` stores reach into other entities' internals; entity↔entity coupling.
- **Location:** `Game.store.ts:6,9`; `Log.store.ts:6`; deep imports from `ForecastBlock`/`StartContract` into Guild internals.
- **Solution:**
  1. Export needed symbols from each slice's `index.ts` (`buildBoardContract`, `contractService`, Guild `lib`/`config` constants).
  2. **Before:** `@/entities/Contract/api/Contract.service.ts`
  3. **After:** `@/entities/Contract`
  4. For true entity→entity orchestration (Guild↔HiringMarket↔ContractsBoard↔Log), keep orchestration in `Game` store so entities stay decoupled.
  5. Validate `JSON.parse` result in `Game.store.ts:59` instead of blind `as Record<string, SavedGame>`.
- **Effort:** M
- **Impact:** architecture compliance, type safety

---

## P1 — High

### P1-1. Add a testing stack + cover the stores

- **Problem:** 0% coverage on critical business logic.
- **Location:** new `vitest.config.ts`, `src/**/*.spec.ts`.
- **Solution:**
  1. Add `vitest`, `@vue/test-utils`, `jsdom`; add `"test"` script.
  2. Test `Guild` (resolution, morale clamp, salary/debt) and `Game` (save/load round-trip, `finishDay`) via `setActivePinia(createPinia())` — no component mounting.
  3. Mock `random` helpers for deterministic `chance`.
- **Effort:** L
- **Impact:** correctness, regression safety

### P1-2. Convert stores to `setup` style (per spec) — incrementally

- **Problem:** Options-style stores contradict the required Composition-API store style.
- **Location:** all six stores.
- **Solution:** Migrate one store at a time to `defineStore('x', () => { const state = ref(...); ... return {...} })`. Public API (`useXStore`) unchanged — backward compatible.
- **Effort:** L
- **Impact:** spec compliance, DX

### P1-3. Split the `Game` god-store

- **Problem:** persistence + day-loop + content-generation in one store.
- **Location:** `Game.store.ts`.
- **Solution:**
  1. Extract persistence into `shared/lib` (or a `SaveGame` entity) wrapper around localStorage.
  2. Keep day-loop orchestration in `Game`.
  3. Fix `initLastSavedGame` ascending-sort bug (load newest save).
- **Effort:** M
- **Impact:** architecture, correctness

### P1-4. Performance: lazy routes + async heavy modals + log windowing

- **Location:** `router.ts:2-8`; `AppModalRoot`; `LogBlock`.
- **Solution:**
  1. `component: () => import('@/pages/.../X.vue')` for routes.
  2. `defineAsyncComponent` for `StartContract`/`LoadGame`.
  3. Cap or window the log list.
- **Effort:** M
- **Impact:** initial-load perf

### P1-5. Complete the Public APIs

- **Problem:** consumers deep-import because exports are missing.
- **Location:** `Guild/index.ts`, `Contract/index.ts`, `ContractsBoard/index.ts`.
- **Solution:** Re-export helpers/services used externally; update import paths (ties into P0-4).
- **Effort:** S
- **Impact:** architecture compliance

---

## P2 — Nice to have

### P2-1. Remove dead store actions + dead `BaseModal` branch

- **Location:** `Guild.store`, `ContractsBoard.store`, `HiringMarket.store`, `BaseModal.vue:32`.
- **Solution:** Delete unused actions and unreachable branch.
- **Effort:** S
- **Impact:** cleanliness

### P2-2. Remove unused `vue-i18n` dependency

- **Location:** `package.json`.
- **Solution:** Remove dependency (or adopt it for hardcoded Russian strings).
- **Effort:** S
- **Impact:** bundle/DX

### P2-3. Fix typos

- **Location:** `Mercanary.titles.ts`, `mocks/mercanaries.ts`, `Log.store` `addNewContractEven*`, CSS `mernaries`.
- **Effort:** S
- **Impact:** consistency

### P2-4. Bump sub-14px fonts and small tap targets

- **Location:** `ForecastBlock`/`LogBlock` `0.75–0.8rem` → ≥`0.875rem`; `BaseButton --sm` → ≥32px min-height.
- **Effort:** S
- **Impact:** visual/a11y

### P2-5. Tighten TypeScript types

- **Location:** `OfferPayDebtsModal.vue:31` (`Ref<Set<string>>`); `App.vue:30,35` (typed guard without `as`).
- **Effort:** S
- **Impact:** type safety

---

# Phase 3 — Quick Wins (< 30 min each)

1. **Complete Public APIs + fix deep imports** — add missing re-exports (`buildBoardContract`, `contractService`, Guild lib/config consts) and swap deep paths in `Game.store`, `Log.store`, `ForecastBlock`, `StartContract` to slice roots. *(P0-4/P1-5, S)*

2. **Delete dead store actions + dead `BaseModal` branch** — pure removal, zero behavior change. *(P2-1, S)*

3. **Remove unused `vue-i18n` dependency** — one line in `package.json`. *(P2-2, S)*

4. **Remove three `console.log` placeholders** in `ChangeSettings.vue:15,22,29`. *(S)*

5. **Fix `initLastSavedGame` sort bug** — change sort so the **newest** save loads, not the oldest. *(part of P1-3, S)*

---

# Implementation Order (Suggested)

```
Week 1 (P0):
  P0-2 (layout) → P0-4 (Public APIs) → P0-1 (router violation) → P0-3 (business logic to stores)

Week 2 (P1):
  P1-5 (finish Public APIs) → P1-1 (Vitest + store tests) → P1-4 (lazy routes)

Week 3 (P1/P2):
  P1-2 (setup stores, one at a time) → P1-3 (split Game store) → P2 quick wins
```
