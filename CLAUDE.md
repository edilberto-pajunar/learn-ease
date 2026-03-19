# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LearnEase (T-BRITE)** — Technology-Based Reading for Interactive Teaching and Engagement. A Next.js LMS for reading comprehension assessments with pre-test/post-test workflows, lesson management, and AI-assisted vocabulary features.

## Commands

```bash
npm run start      # Start dev server (runs next dev)
npm run build      # Production build (ESLint disabled in next.config)
npm run lint       # Run ESLint
```

There are no test commands configured in this project.

## Architecture

### Auth & Role-Based Access

Auth is handled by Firebase Auth + Firestore. `src/components/Wrapper.tsx` wraps the entire app — it calls `onAuthStateChanged`, fetches the user doc from `users/{uid}`, stores it in `useAuthStore`, and redirects unauthenticated users to `/login`. Layout components (`StudentLayout`, `AdminLayout`) additionally redirect based on `user.role` (`admin` | `student`).

The middleware at `src/middleware.ts` is intentionally disabled; Wrapper handles all route protection client-side.

### State Management Pattern

All state lives in Zustand stores under `src/hooks/`. Stores follow a consistent pattern:

- Async actions defined directly inside the store (not in separate thunks)
- Real-time Firestore listeners (`onSnapshot`) are set up in store actions; unsubscribe functions are stored in state
- Service layer methods are called from stores, not from components

### Data Flow

Components → Zustand store actions → Service layer (`src/services/`) → Firestore SDK

Services return mapped data with `doc.id` attached as the `id` field. Each service exports a single object with async methods.

### Key Stores

| Store                | Responsibility                                                                  |
| -------------------- | ------------------------------------------------------------------------------- |
| `useAuthStore`       | Current user, auth status, user's submissions                                   |
| `useAdminStore`      | Students, materials, quarter/testType config, skills                            |
| `useReadStore`       | Reading test session: materials, answers, timing, batch submission accumulation |
| `useSubmissionStore` | Querying submissions by batch/test type                                         |
| `useDashboardStore`  | Analytics calculations (scores, WPM, accuracy) for pre/post tests               |
| `useLessonStore`     | Lessons CRUD, lesson progress tracking                                          |

### Reading Test Flow

The core student flow: Student selects test → `useReadStore` fetches materials → answers accumulate in `batchedSubmissions` → final `submitBatchAnswers()` call saves all to Firestore → `updateUserWithTestMaterial()` marks the test as completed on the user document.

### AI Integration

`POST /api/agent` uses Ollama locally (default model: `llama3.2:latest`) via LangChain to generate vocabulary examples/explanations. Response is validated with Zod and returns `{ example: string, explanation: string }`.

### Firebase Setup

`firebase/client_app.ts` (note: outside `src/`) initializes Firebase using `NEXT_PUBLIC_*` env vars and exports `auth` and `db`. Path alias `@/firebase/*` maps to `./firebase/*`.

### Firestore Collections

- `users/` — user profiles (doc ID = Firebase Auth UID)
- `materials/` — reading passages with questions, keyed by `quarter`, `skill`, `testType`
- `submissions/` — test responses; also stored as subcollection at `users/{uid}/submissions/`
- `lessons/` — lesson content with chapters, activities, embedded materials
- `admin/` — global config (current quarter, test type)
- `feedback/` — student feedback

### TypeScript Interfaces

All shared interfaces are in `src/interface/`. Key types: `AppUser`, `Material`, `Submission`, `Lesson`. Import from these rather than inline typing.

## Environment Variables

All Firebase config vars must be prefixed `NEXT_PUBLIC_` (client-side). The Ollama API is called server-side from the API route with no auth required (local dev only).

## PWA

Configured via `next-pwa`. Automatically disabled in development. Service worker and manifest live in `public/`.
