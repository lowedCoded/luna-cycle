# Plan: Menstrual Cycle Tracker

## Tech Stack
- Next.js 16.2.10 + TypeScript
- Tailwind CSS v4
- Zustand (state + localStorage persist)
- Framer Motion (animations)
- date-fns (date utils)
- lucide-react (icons)
- recharts (charts)

## Architecture

### Routes (App Router)
- `/` — Dashboard (cycle phase, countdown, quick log, tip of day)
- `/calendar` — Full calendar with phase coloring
- `/diary` — Symptom diary with mood/pain tracking
- `/tips` — Categorized tips with verified info
- `/settings` — Theme picker, language, cycle config

### Theme System (3 themes via CSS variables)
- `[data-theme="romantic"]` — Soft pink/lavender, rounded, floral SVG
- `[data-theme="natural"]` — Sage/terracotta, organic shapes, leaf SVG
- `[data-theme="modern"]` — Dark purple/neon, glassmorphism, geometric SVG

### Data Flow
- Zustand stores with `persist` middleware → localStorage
- Settings store (theme, lang, cycle config)
- Cycle store (period dates, predictions)
- Diary store (symptoms, mood entries)

### i18n
- Custom context-based solution (RU + EN)
- JSON objects with nested keys
- `useTranslations()` hook

### Key Components
- `CycleRing` — Animated SVG ring showing cycle phase progress
- `CycleCalendar` — Custom calendar with phase colors
- `SymptomForm` — Mood slider, pain scale, symptom checkboxes
- `ThemeSwitcher` — 3 theme cards with live preview
- Decorative SVGs per theme (floral, leaf, geometric patterns)

### SVG Decorations (per theme)
- Romantic: flowers, petals, soft waves
- Natural: leaves, organic blobs, vines
- Modern: geometric grids, gradient orbs, neon lines

### Animations
- Page transitions (fade + slide)
- Theme switching (smooth CSS transition 0.5s)
- Ring progress animation
- Card hover effects
- Calendar day selection

### Tips Content
- 7 curated tips covering: health, nutrition, sport, psychology
- Each tip: title (RU+EN), description, category, source URL, verified flag
- Sourced from WHO, Mayo Clinic, medical journals

## Implementation Order
1. Project setup + deps ✅
2. Theme CSS variables + globals.css
3. Types + i18n files
4. Zustand stores
5. AppLayout + Sidebar + BottomNav
6. Dashboard (CycleRing, QuickLog, PhaseCard)
7. Calendar page
8. Diary page
9. Tips page
10. Settings page
11. SVG decorations
12. Animations polish
13. Final debugging
