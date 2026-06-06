# GuildMaster

**English** · [Русский](./README.ru.md)

> [Overview](#overview) · [Gameplay](#gameplay) · [Game loop](#game-loop) · [Tech](#tech-stack) · [Getting started](#getting-started)

A small browser game about running a mercenaries' guild. You hire fighters, take on
contracts, send squads into the field, and try to keep the guild solvent and your
people happy day after day.

## Overview

You are the master of a freshly founded guild. The world offers a steady trickle of
mercenaries to hire and contracts to fulfill — your job is to match the right people to
the right jobs, manage cash flow, and survive the consequences of every decision.
Progress is saved locally in the browser, so you can pick a game back up later.

## Gameplay

- **Hire mercenaries** from the Hiring Market. Each has a level, a hire price, and a
  weekly salary.
- **Take contracts** from the Contracts Board. A contract has a required power, a
  reward, a prepayment, and a deadline to start.
- **Send a squad.** A mercenary's effective power scales with their level and current
  morale. You need at least 75% of the required power to start a contract.
- **Advance the day.** Time only moves when you end the day. Each day resolves running
  contracts, pays salaries, ages mercenaries, and may add new offers to the world.
- **Watch the books.** The Forecast shows a 7‑day cash‑flow projection so you can see
  salary spikes and expected contract income before they hit.
- **Keep morale up.** Unpaid salaries become debt, debt drains morale every day, and a
  mercenary at zero morale leaves the guild — which demoralizes everyone who stays.

### Outcomes

- Contract **success chance** scales with squad power vs. required power: ~50% at 75%
  power, ~90% at equal power, 100% at double power.
- **Success** pays the reward and raises the squad's morale; **failure** and **overdue**
  contracts lower morale instead.
- If money runs short on payday, the shortfall becomes per‑mercenary **debt** — pay it
  off before morale collapses.

## Game loop

1. Start a new guild (or load a save) from the Menu.
2. Hire mercenaries and accept promising contracts.
3. Assign a strong‑enough squad and start the contract.
4. End the day to resolve contracts and pay wages.
5. Settle debts, react to the event log, and repeat.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Vue 3 (`<script setup>` SFCs) |
| Language | TypeScript (`strict`) |
| State | Pinia (Composition / `setup` stores) |
| Routing | Vue Router (lazy‑loaded routes) |
| Build | Vite |
| Styling | SCSS |
| Tests | Vitest + @vue/test-utils + jsdom |
| Quality | ESLint + Prettier |
| Persistence | `localStorage` |

The codebase follows **Feature‑Sliced Design** (`app`, `pages`, `widgets`, `features`,
`entities`, `shared`). Business logic lives in Pinia stores; heavy modals and pages are
code‑split via dynamic imports.

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build          # type-check + production build
npm run preview        # preview the production build
npm run typecheck      # vue-tsc
npm run lint           # ESLint
npm run lint:fix       # ESLint --fix
npm run test           # run Vitest once
npm run test:watch     # Vitest watch mode
npm run test:coverage  # coverage report
```
