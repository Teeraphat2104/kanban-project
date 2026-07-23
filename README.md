# Kanban Project

A full-stack Kanban board application with real-time collaboration, built with Next.js 15 and self-hosted Supabase.

## Features

- **Authentication** - Email/password sign-up and sign-in via Supabase GoTrue
- **Boards Management** - Create, edit, and delete boards with descriptions
- **Kanban Columns** - Add, rename, reorder, and delete columns
- **Drag & Drop Cards** - Reorder cards within columns and move between columns using @dnd-kit
- **Card Details** - Title, description, due date, tags, and assignees
- **Tags** - Board-scoped colored tags for categorization
- **Assignees** - Self-assign cards ("Assign to me")
- **Search & Filter** - Filter by text, tag, due date, and assignee
- **Real-time Updates** - Supabase Realtime for live collaboration across tabs/users
- **Row Level Security** - Role-based access (owner/editor/viewer) enforced at database level
- **Dark/Light Theme** - Theme switching via next-themes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Drag & Drop | @dnd-kit |
| State Management | TanStack React Query |
| Forms | React Hook Form + Zod |
| Auth & Database | Supabase (self-hosted) |
| Database | PostgreSQL 17 |
| API Gateway | Kong 3.9 |
| Containerization | Docker Compose |

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- npm

### Installation

```bash
git clone https://github.com/Teeraphat2104/kanban-project.git
cd kanban-project
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your own secrets (JWT keys, Postgres password, etc.)

### Start with Docker

```bash
docker-compose up -d
```

This starts 8 services: Next.js app, PostgreSQL, GoTrue auth, PostgREST, Realtime, Meta, Studio, and Kong gateway.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, Register, OAuth callback
│   ├── (board)/             # Board detail page (/boards/[boardId])
│   └── (dashboard)/         # Boards list page (/boards)
├── components/
│   ├── auth/                # Auth button
│   ├── boards/              # Board cards, create/edit/delete dialogs
│   ├── kanban/              # Kanban board, columns, cards, search/filter
│   ├── providers/           # Query provider
│   └── ui/                  # shadcn/ui components
├── hooks/                   # TanStack Query hooks (use-boards, use-cards, etc.)
├── lib/
│   └── supabase/            # Supabase clients (browser, server, admin)
└── types/                   # TypeScript database types
```

## Database Schema

| Table | Description |
|-------|-------------|
| `boards` | Board with title, description, creator |
| `board_members` | Board membership with roles (owner/editor/viewer) |
| `columns` | Columns within a board, ordered by position |
| `cards` | Cards within a column, with title, description, due date |
| `tags` | Board-scoped colored tags |
| `card_tags` | Many-to-many: cards ↔ tags |
| `card_assignees` | Many-to-many: cards ↔ users |

All tables have RLS policies enforcing role-based access.

## Docker Services

| Service | Port | Description |
|---------|------|-------------|
| Next.js App | 3000 | Application server |
| Supabase DB | 5432 | PostgreSQL database |
| GoTrue Auth | 9999 | Authentication service |
| PostgREST | 3001 | Auto-generated REST API |
| Realtime | 4000 | WebSocket subscriptions |
| Meta | 5555 | Database metadata API |
| Studio | 8080 | Supabase admin dashboard |
| Kong | 8000 | API gateway |

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
