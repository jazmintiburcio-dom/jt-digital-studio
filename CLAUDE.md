# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio/digital studio site built with **Next.js 15 (App Router)** and **Tailwind CSS v4**, deployed on Vercel.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Run production build locally
npm run lint         # ESLint check
```

For running a single test (if a test runner is added later):
```bash
npx jest path/to/file.test.ts          # Jest
npx vitest run path/to/file.test.ts    # Vitest
```

## Architecture

### Directory Structure

```
app/                  # Next.js App Router — all routes live here
  layout.tsx          # Root layout (fonts, metadata, global providers)
  page.tsx            # Home page (/)
  globals.css         # Global styles + Tailwind @import
  (sections)/         # Optional route groups for page sections (no URL segment)
components/           # Shared UI components
  ui/                 # Primitive/reusable components (Button, Card, etc.)
public/               # Static assets served at /
  images/             # Site images (use next/image for all images here)
```

### Routing & Pages

Each route is a folder inside `app/` containing a `page.tsx`. Layouts in `layout.tsx` wrap all child routes at that level. Use **route groups** (`(groupName)/`) to co-locate related files without affecting the URL.

### Data & Content

This is a static portfolio site. Page content lives directly in component files or in a `lib/data.ts` / `content/` folder as typed constants — no CMS or database by default. If a headless CMS is added later, update this section.

### Metadata & SEO

Define metadata via Next.js's `generateMetadata()` or the static `metadata` export in each `page.tsx`. The root `layout.tsx` holds site-wide defaults. Open Graph images go in `app/opengraph-image.png` (auto-detected by Next.js).

### Images

Always use `next/image` (`<Image>`) instead of `<img>`. Set explicit `width` and `height` (or use `fill` with a sized parent). Priority-load the above-the-fold hero image with `priority`.

### Fonts

Load fonts via `next/font/google` in `layout.tsx` and apply them as CSS variables (`--font-sans`, etc.) so Tailwind can reference them.

### Styling Conventions

- Tailwind utility classes are the primary styling mechanism — no separate CSS files per component.
- Custom design tokens (colors, spacing) go in `tailwind.config.ts` under `theme.extend`.
- Use `cn()` (from `clsx` + `tailwind-merge`) for conditional class merging.
- Dark mode: use Tailwind's `dark:` variant; toggle via `class` strategy on `<html>`.

### Component Conventions

- All components are TypeScript (`.tsx`). Props interfaces are defined inline above the component or in a sibling `types.ts`.
- Server Components by default; add `"use client"` only when the component needs interactivity, browser APIs, or React hooks.
- Named exports for components (not default exports), except for page and layout files which Next.js requires as default exports.

### TypeScript

Strict mode is on. Avoid `any` — use `unknown` with type guards or define proper types in `lib/types.ts`.
