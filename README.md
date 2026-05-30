# TanStack Demo

A simulated content management system demonstrating the integration of TanStack Query, Zod, and OpenAPI schemas.

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Roles & Permissions](#roles--permissions)
- [API Overview](#api-overview)

---

## Overview

This is a submission review platform where authenticated users can browse, filter, review, create, and manage content submissions. Admins have full CRUD access, while reviewers have read and status-update access. A dashboard provides summary statistics, recent activity, and top submitter rankings.

The entire backend is mocked in-browser using **MSW**, making the app fully self-contained for development and testing with no external server required.

---

## Getting Started

```bash
pnpm install
pnpm dev
```

To use MSW
```bash
cp .env.msw.example .env.msw
pnpm dev:msw
```


---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 |
| Language | TypeScript |
| Build Tool | Vite |
| Server State | TanStack Query (Vue Query) v5 |
| Table | TanStack Table v8 |
| Form Validation | Zod v4 |
| API Client | openapi-fetch (type-safe, generated from OpenAPI schema) |
| Mock API | Mock Service Worker (MSW) v2 |
| Testing | Vitest + Vue Test Utils |

---

## Features

### Submissions
- **List view** with server-side pagination, sorting, and filtering
- **Filter by** status, type, submitter tier, and free-text search
- **Sortable columns** with URL-synced state (page, pageSize, sortBy, sortOrder)
- **Row selection** with batch operations
- **Batch review** — approve or reject multiple submissions at once with a reason
- **Batch delete** — remove multiple submissions in one action
- **Hover prefetch** — submission detail data is prefetched on row hover for instant navigation
- **Detail view** — view full submission content and metadata
- **Create / Edit form** — admin-only form to create or update submissions (supports article, video, image, and link content types)
- **Delete** — admin-only, with redirect on success

### Dashboard
- Summary stats: total, pending, approved, rejected, and flagged submission counts
- Breakdown by submission type with approval rates
- Recent activity feed (submitted, approved, rejected, flagged)
- Top submitters ranked by submission count with approval rates

### Auth
- Login / logout flow
- Role-based access: `admin` and `reviewer`
- Route guards: unauthenticated users are redirected to `/login`; non-admins are redirected away from admin-only routes
- Auto-redirect to `/submissions` when already logged in
- Global `auth:unauthorized` event handler resets session and redirects to login

### UX
- Indeterminate progress bar during background data fetches
- Skeleton loading states for table rows
- Toast notifications via `vue-sonner`
- Dark mode support via CSS variables
- Responsive layout with sticky navbar

---

## Project Structure

```
src/
├── api/                        # API client and generated OpenAPI schema types
│   ├── client.ts
│   └── schema.d.ts
├── assets/                     # Global CSS
├── components/                 # Shared/layout components
│   ├── ui/                     # Base UI primitives (Button, Card, Input, Table, etc.)
│   ├── DataTable.vue
│   ├── MainLayout.vue
│   ├── NavBar.vue
│   └── TableSkeleton.vue
├── features/
│   ├── dashboard/              # Dashboard feature (stats, tables, queries)
│   └── submission/             # Submission feature
│       ├── mutations/
│       ├── queries/
│       ├── schemas/
│       ├── stores/
│       └── views/
│           ├── SubmissionsView/        # List, filters, table, batch actions
│           ├── SubmissionDetailView/   # Single submission view
│           └── SubmissionFormView/     # Create / edit form
├── mocks/                      # MSW mock server (handlers, in-memory DB)
├── router/                     # Vue Router config with route guards
├── schemas/                    # Shared Zod schemas (auth, common)
├── stores/                     # Pinia stores (auth)
└── main.ts                     # App entry point (bootstraps MSW in dev)
```

---

## Usage

### Logging In

Navigate to `/login`. The mock database contains seeded users. Use any of the seeded credentials to log in. Upon successful login, you will be redirected to the Submissions list.

### Browsing Submissions

The `/submissions` route shows a paginated, sortable table of all submissions. Use the filter controls to narrow results by:
- **Status**: `pending`, `approved`, `rejected`, `flagged`
- **Type**: `article`, `video`, `image`, `link`
- **Tier**: submitter tier level
- **Search**: free-text search across submission titles

All filter and pagination state is synced to the URL query string, making views shareable and bookmarkable.

### Viewing a Submission

Click **View** on any row to navigate to `/submissions/:id`. The detail page shows full metadata and content. Hovering over the row prefetches the data, so navigation is near-instant.

### Creating a Submission (Admin only)

Click the **New Submission** button (visible to admins) or navigate to `/submissions/new`. Fill in the form and submit.

### Editing / Deleting a Submission (Admin only)

From the detail view, admins see **Edit** and **Delete** buttons. Edit navigates to `/submissions/:id/edit` with the form pre-populated. Delete removes the submission and redirects to the list.

### Batch Actions

Select multiple rows using the checkboxes. A batch actions bar appears at the bottom with options to:
- **Batch Review** — set a verdict (`approved` or `rejected`) and provide a reason
- **Batch Delete** — permanently remove all selected submissions

### Dashboard

Navigate to `/dashboard` to see aggregate statistics:
- Summary counts (total, pending, approved, rejected, flagged)
- Submission breakdown by content type
- Recent activity timeline
- Top 5 submitters by volume and approval rate

---

## Roles & Permissions

| Action | `reviewer` | `admin` |
|---|:---:|:---:|
| View submissions list | ✅ | ✅ |
| View submission detail | ✅ | ✅ |
| Filter / search | ✅ | ✅ |
| Batch review | ✅ | ✅ |
| Batch delete | ✅ | ✅ |
| Create submission | ❌ | ✅ |
| Edit submission | ❌ | ✅ |
| Delete submission | ❌ | ✅ |
| View dashboard | ✅ | ✅ |

Route-level guards enforce admin-only routes (`/submissions/new`, `/submissions/:id/edit`). Non-admins are redirected to `/submissions`.

---

## API Overview

The OpenAPI schema (`src/api/schema.d.ts`) defines the following endpoints, all mocked by MSW in development:

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | Authenticate and receive a Bearer token |
| `POST` | `/auth/logout` | Invalidate session token |
| `GET` | `/auth/me` | Get the currently authenticated user |
| `GET` | `/submissions` | List submissions with filters and pagination |
| `POST` | `/submissions` | Create a new submission |
| `GET` | `/submissions/:id` | Get a single submission |
| `PATCH` | `/submissions/:id` | Update a submission |
| `DELETE` | `/submissions/:id` | Delete a submission |
| `PATCH` | `/submissions/:id/status` | Update submission status |
| `POST` | `/submissions/batch-review` | Approve or reject multiple submissions |
| `POST` | `/submissions/batch-delete` | Delete multiple submissions |
| `GET` | `/dashboard/stats` | Get aggregated dashboard statistics |

All API calls are type-safe via `openapi-fetch`, using types generated directly from the OpenAPI schema.
