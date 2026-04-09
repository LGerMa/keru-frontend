# Keru Design System

Fresh indigo theme. Mobile-first. Clean, confident, friendly fintech.

---

## Colors

### Brand

| Token | Light | Dark | Use |
|---|---|---|---|
| Primary | `oklch(0.585 0.233 277)` — indigo | `oklch(0.675 0.179 277)` — lighter indigo | Buttons, active states, accents |
| Primary foreground | White | White | Text on primary |
| Background | `oklch(0.985 0.012 277)` — near-white with indigo tint | `oklch(0.098 0.022 277)` — near-black | Page canvas |
| Card | `oklch(1.000 0.000 0)` — pure white | `oklch(0.148 0.022 277)` | Cards, panels |
| Muted | `oklch(0.950 0.012 277)` | `oklch(0.195 0.022 277)` | Secondary surfaces |

### Semantic

| Name | Value | Use |
|---|---|---|
| Income | `#22C55E` (emerald green) | Income amounts, income buttons — same in light and dark |
| Destructive | `oklch(0.577 0.245 27)` | Delete, error states |
| Border | `oklch(0.915 0.015 277)` | Card borders, separators |
| Muted foreground | `oklch(0.558 0.042 277)` | Labels, placeholders, secondary text |

### Hero gradient

`linear-gradient(135deg, #4f46e5 → #6366f1 → #818cf8)` — used on balance card, FAB, auth icon mark.

### Indigo tints (for icon badges, tag backgrounds)

Append `18` in hex (≈10% opacity) to any 6-digit hex color: `#6366f118`.  
Income badge: `rgba(34, 197, 94, 0.12)`. Expense/default badge: `rgba(99, 102, 241, 0.10)`.

---

## Typography

Font: **Inter** (system default). No display font.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title | `text-lg` (18px) | 700 (`font-bold`) | `tracking-tight` |
| Section label | `text-xs` (12px) | 600 (`font-semibold`) | `uppercase tracking-wider` |
| Balance / hero number | `text-4xl` (36px) | 800 (`font-extrabold`) | `letter-spacing: -1.5px` |
| KPI number (desktop cards) | `text-3xl` (30px) | 700 (`font-bold`) | |
| Amount in list | `text-sm` (14px) | 700 (`font-bold`) | Income: `#22C55E`, expense: foreground |
| Body / description | `text-sm` (14px) | 400 (`font-normal`) | |
| Label / meta | `text-xs` (12px) | 400 | `text-muted-foreground` |
| Button | `text-sm` (14px) | 600 (`font-semibold`) | |

---

## Radius

Base unit: `--radius: 1rem` (16px).

| Token | Size | Use |
|---|---|---|
| `rounded-sm` (`radius-sm`) | 4px | Tiny chips |
| `rounded-md` (`radius-md`) | 10px | Inputs, small elements |
| `rounded-lg` (`radius-lg`) | 16px | Default cards |
| `rounded-xl` (`radius-xl`) | 20px | Buttons, tab switchers |
| `rounded-2xl` | 24px | Section containers, list wrappers |
| `rounded-3xl` | 32px | Balance hero card |
| `rounded-full` | 9999px | Nav pills, month chips, action buttons |
| Icon badge | 10px (explicit) | 36×36 transaction icon badges |
| FAB / auth mark | 14px (explicit) | Rounded-square feel |

---

## Shadows / Elevation

All shadows use indigo tint (`rgba(99, 102, 241, …)`).

| Class | Use |
|---|---|
| `shadow-card-sm` | Tag cards, secondary surfaces |
| `shadow-card-md` | Main content cards, lists |
| `shadow-card-lg` | Prominent panels |
| `shadow-hero` | Balance card, hero elements |
| `shadow-colored` | Primary buttons, FAB, auth icon |

---

## Layout & Spacing

### Page structure

- Mobile: single column, `px-5` horizontal padding, `pb-20` (bottom nav clearance)
- Desktop (≥1024px): fixed sidebar `w-60` (240px), content `ml-60`, max-width `max-w-4xl`, `px-10`

### Sidebar

- `bg-card` surface, `border-r border-border`
- `keru.` wordmark — black "keru" + indigo "." — top-left
- Two action buttons (`Income` green / `Expense` indigo) side-by-side below the wordmark
- Nav items: `rounded-full` pill, active = `bg-primary text-primary-foreground`, inactive = `text-muted-foreground`

### Mobile bottom nav

- Fixed bottom bar, `max-w-md` centered, `bg-card border-t`
- 4 nav items (Home, History, Tags, Profile) + centered FAB
- FAB: `gradient-hero`, `rounded-[14px]`, 48×48, `shadow-hero`
- Active item: `text-primary font-semibold`, inactive: `text-muted-foreground`

### Dashboard

- Mobile: balance hero card full-width, quick-action row (Expense primary + Income outline), recent transactions, top tags, trends chart
- Desktop: 3-card stat row (Balance gradient | Income white | Expenses white) + 2-column content grid (transactions + tags/chart)

### Spacing rhythm

- Section gap: `mb-5` (20px) between major blocks
- Card padding: `p-4` standard, `p-6` for hero
- List items: `py-3` with separator or overflow-hidden container

---

## Component Patterns

### Balance hero card

Full-width `gradient-hero`, `rounded-3xl`, `shadow-hero`. Balance in white `font-extrabold` with tight letter-spacing. Income in `text-emerald-300`, expenses in `text-white/80`.

### Transaction item

36×36 icon badge with tag-color tint background (`color + 18` hex). Title `text-sm font-medium`, description `text-xs text-muted-foreground`. Amount right-aligned `text-sm font-bold` — green for income, foreground for expense.

### Section headers

`text-xs font-semibold uppercase tracking-wider` label on the left, optional "See all" link `text-xs text-primary font-semibold` on the right.

### List containers

`bg-card rounded-2xl shadow-card-md overflow-hidden px-1` — items rendered inside with dividers.

### Tab switcher (Expenses page)

`bg-card rounded-xl p-1 border border-border`. Active expense tab: `bg-primary text-primary-foreground`. Active income tab: `backgroundColor: #22C55E, color: white`. Both `rounded-lg`.

### Tag cards

`bg-card rounded-2xl shadow-card-sm border border-border px-4 py-3` with color dot and name.

### Auth pages

Centered card, `keru.` wordmark, branded K icon mark (`gradient-hero`, `rounded-[14px]`, `shadow-colored`). Primary button: `bg-primary rounded-xl shadow-colored`.

---

## Dark Mode

Enabled via `.dark` class on `<html>`. All colors flip via CSS custom properties — no component changes needed. Income `#22C55E` stays the same in both modes.
