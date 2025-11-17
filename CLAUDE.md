# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 portfolio website builder with:
- Public portfolio homepage with Three.js 3D animations
- Protected admin panel for content management
- JWT authentication (HTTP-only cookies)
- SQLite database with Prisma ORM

## Essential Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Production build (standalone output)
npm run lint             # ESLint checks

# Database
npm run db:push          # Push schema changes to database
npm run db:migrate       # Create and run migrations
npm run db:reset         # Reset database completely
npm run db:generate      # Regenerate Prisma client
```

## Architecture

### Tech Stack
- Next.js 15.3.5 (App Router)
- TypeScript 5, Tailwind CSS 4
- Prisma ORM with SQLite
- shadcn/ui components (Radix UI)
- Three.js + React Three Fiber for 3D

### Key Directories
- `src/app/api/` - REST API routes (auth, personal-info, experience, education, projects, skills)
- `src/app/admin/` - Protected admin dashboard
- `src/components/admin/` - CRUD forms for each content type
- `src/components/three/` - 3D animation components
- `src/components/ui/` - shadcn/ui component library
- `prisma/schema.prisma` - Database schema (5 models: PersonalInfo, Experience, Education, Project, Skill)
- `middleware.ts` - JWT auth protection for `/admin/*` routes

### Authentication
- Hardcoded demo credentials: `admin@portfolio.com` / `admin123`
- JWT tokens stored in HTTP-only cookies (24h expiry)
- Protected routes handled by middleware

### API Patterns
All content endpoints follow consistent REST pattern:
- GET: Fetch data
- POST: Create (body contains data)
- PUT: Update (body contains id + data)
- DELETE: Remove (id passed as query param `?id=xxx`)

### Code Conventions
- Client components use `'use client'` directive
- Import paths use `@/` alias (e.g., `@/lib/db`, `@/components/ui/button`)
- API routes wrapped in try-catch, return JSON with appropriate status codes
- Forms accept `onUpdate` callback to refresh parent state after mutations
- Prisma client singleton at `src/lib/db.ts`

### Build Configuration
- Next.js output set to "standalone" for Docker deployment
- TypeScript and ESLint errors ignored during build (see `next.config.ts`)
- Many ESLint rules disabled for flexibility (see `eslint.config.mjs`)
