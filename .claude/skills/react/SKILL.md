---
name: react
description: React patterns for components, hooks, state, and Next.js App Router. Use when building React/Next.js UIs, components, or client-side logic.
---

# React

## GateFlow stack

- **Next.js 14** App Router
- **Server Components** by default; `'use client'` when needed (state, events, browser APIs)
- **Workspace:** `@gate-access/ui` for shared components

## Patterns

- **Server vs Client** — Keep client boundaries small; fetch in server components when possible
- **Hooks** — `useState`, `useEffect`, `useTransition` for forms/async
- **Forms** — Server Actions or `onSubmit` with `e.preventDefault()`
- **i18n** — `useTranslation()` from `react-i18next` for AR/EN

## File structure

- `page.tsx` — Route page (server or client)
- `*-client.tsx` — Client component (forms, interactivity)
- Co-locate with route when small

## Import

- Use `@gate-access/ui` for Button, Input, Card, etc.
- Use `@gate-access/types` for shared types
