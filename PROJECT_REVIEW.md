# Project Review: Architecture, Modules, and Known Bugs

## 1) What this project is

This repository is a **Next.js App Router** application for a multi-tenant "AI copilot" called **Pulse**. It combines:
- Supabase authentication/session handling,
- Prisma + PostgreSQL persistence,
- Workspace-level RBAC,
- document ingestion + embeddings,
- chat with retrieval-augmented generation (RAG).

Core dependency signals for this stack are declared in `package.json` (`next`, `react`, `@supabase/*`, `@prisma/*`, `openai`, `ai`, `@ai-sdk/*`).

## 2) Data model modules (`prisma/`)

### `prisma/schema.prisma`
Primary domain schema defining:
- `Profile` (user identity profile)
- `Workspace` (tenant boundary)
- `WorkspaceMember` (user<->workspace role assignment)
- `Document` and `DocumentChunk` (knowledge base + chunked vectors)
- `Conversation` and `Message` (chat persistence)
- `AuditLog` (security/observability events)

Notable design intent:
- Workspace isolation is explicit via `workspaceId` on many records.
- Vector embeddings are modeled as `Unsupported("vector(1536)")` for pgvector.

### `prisma.config.ts`
Prisma config that points schema to `prisma/schema.prisma` and gets DB URL from `DIRECT_URL`.

### `prisma/test.prisma` and `prisma/test_sqlite.prisma`
Lightweight sample schemas for alternate providers (PostgreSQL/SQLite), likely for local experiments.

## 3) Infrastructure / shared library modules (`src/lib`, `src/utils`, `src/proxy.ts`)

### `src/lib/prisma-db.ts`
Creates singleton Prisma client using `@prisma/adapter-pg` + `pg.Pool` and `DATABASE_URL`. In non-prod, it caches client on `global`.

### `src/lib/prisma.ts`
Re-export shim (`export { prisma } from "./prisma-db"`).

### `src/lib/rbac.ts`
Role/permission utility:
- Roles: `ADMIN`, `ANALYST`, `VIEWER`
- Permissions map (`DOCUMENTS_UPLOAD`, `SETTINGS_VIEW`, etc.)
- `getWorkspaceRole` and `hasPermission` helpers.

### `src/utils/supabase/client.ts`
Browser-side Supabase client factory.

### `src/utils/supabase/server.ts`
Server-side Supabase client factory using Next.js `cookies()`.

### `src/utils/supabase/middleware.ts`
Session refresh + auth gate middleware helper:
- refreshes auth via `supabase.auth.getUser()`
- redirects anonymous users away from protected routes to `/login`

### `src/utils/supabase/hooks.ts`
`useSupabaseUser()` React hook for client-side user state and auth subscription updates.

### `src/proxy.ts`
Next request entrypoint that runs `updateSession()` for most routes via matcher.

## 4) Service-layer modules (`src/services`)

### `src/services/document-service.ts`
Simple helper to create a `Document` row with raw content.

### `src/services/ingestion-service.ts`
Document ingestion pipeline:
1. split raw text into overlapping chunks,
2. generate OpenAI embeddings (`text-embedding-3-small`),
3. create `DocumentChunk` rows,
4. write vector embedding through raw SQL cast to `vector`,
5. mark document `COMPLETED`.

### `src/services/retrieval-service.ts`
RAG retrieval helper:
- embeds query,
- executes similarity search over `DocumentChunk.embedding` joined to `Document` filtered by workspace,
- returns concatenated high-similarity chunk text.

### `src/services/audit-service.ts`
Persistence helper to write audit log events (`QUERY`, `UPLOAD`, etc.) with graceful error logging.

### `src/services/workspace-init.ts`
Initial account bootstrap helper to upsert profile + create default workspace/member.

## 5) App Router modules (`src/app`)

### Global shell
- `src/app/layout.tsx`: root layout, fonts, metadata, sidebar inclusion, user role lookup.
- `src/app/globals.css`: global theme/layout styling.

### Landing/auth
- `src/app/page.tsx` + `src/app/page.module.css`: marketing landing page.
- `src/app/login/page.tsx` + `login.module.css`: OTP + OAuth sign-in UI.
- `src/app/auth/callback/route.ts`: exchanges Supabase auth code for session and redirects.
- `src/app/auth/auth-code-error/page.tsx`: auth failure UI.

### Dashboard/settings/research
- `src/app/dashboard/page.tsx` + module CSS: metric-style dashboard UI.
- `src/app/settings/page.tsx` + module CSS: settings panels (mostly presentation).
- `src/app/research/page.tsx` + module CSS: research UI scaffold (currently static).

### Documents feature
- `src/app/documents/page.tsx`: documents UI with upload zone + status list.
- `src/app/documents/actions.ts`: server actions for current workspace and document listing.
- `src/app/api/documents/upload/route.ts`: upload endpoint, parsing, RBAC check, ingestion trigger, audit logging.

### Chat feature
- `src/app/chat/page.tsx`: ensures workspace and loads initial conversations.
- `src/app/chat/actions.ts`: CRUD-like server actions for conversations/messages.
- `src/app/chat/ChatInterface.tsx`: client chat UI powered by `useChat`.
- `src/app/api/chat/route.ts`: chat API route (authZ, retrieval context injection, LLM streaming, message persistence).

## 6) Shared UI component modules (`src/components`)

- `Sidebar.tsx` + `Sidebar.module.css`: route nav with role-filtered items and logout.
- `UploadZone.tsx` + `UploadZone.module.css`: file upload trigger used in documents page.
- `PulseLogo.tsx` + `PulseLogo.module.css`: branding component.
- `LayoutWrapper.tsx`: alternate wrapper abstraction (appears unused by root layout).
- `Providers.tsx`: trivial pass-through provider wrapper.

## 7) Build/tooling config modules

- `next.config.ts`: enables React Compiler.
- `eslint.config.mjs`: Next core-web-vitals + TS linting.
- `tsconfig.json`: strict TypeScript config with `@/*` path alias.

## 8) Known bugs and defects found

### A. Hard build failure: `pdf-parse` import shape is wrong
`src/app/api/documents/upload/route.ts` imports `pdf` as default, but current `pdf-parse` ESM build does not provide default export. This is confirmed by `next build` error.

**Impact:** production build fails.

### B. Role mismatch bug (`OWNER` not recognized by RBAC)
`ensureDefaultWorkspace()` creates member role `"OWNER"`, but `Role` union in RBAC is only `ADMIN | ANALYST | VIEWER`.

**Impact:** permission checks can silently fail or produce inconsistent access control behavior.

### C. Security bug in upload API: trusts client-provided `profileId`
Upload endpoint accepts `profileId` from form data and uses it in `hasPermission(...)` instead of deriving identity from authenticated session.

**Impact:** if a malicious user can post forged `profileId`, RBAC checks are bypassable for uploads.

### D. Async ingestion fire-and-forget without error handling
`processDocument(document.id, rawText);` is invoked without `await`/queue and without lifecycle handling.

**Impact:** ingestion failures can be dropped silently; status may remain `PROCESSING` forever.

### E. Many lint violations (type safety + hook correctness + JSX escapes)
`npm run lint` reports 21 errors and 18 warnings across chat/settings/dashboard/login/sidebar/services, including `any` usage, hook dependency issues, and unescaped apostrophes.

**Impact:** degraded type safety and maintainability; CI likely fails if lint is enforced.

### F. `LayoutWrapper` calls `Sidebar` with missing required props
`Sidebar` expects `{ user, role }`, but `LayoutWrapper` renders `<Sidebar />`.

**Impact:** TypeScript compile error if this wrapper becomes part of the build path.

### G. Font fetching fragility during build
`next/font/google` requests for Outfit and Plus Jakarta Sans failed in this environment during build.

**Impact:** offline/locked CI environments may fail unless fonts are self-hosted or network is available.
