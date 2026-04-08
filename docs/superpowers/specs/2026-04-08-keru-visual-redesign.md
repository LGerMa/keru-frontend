# Keru Visual Redesign — Design Spec
**Date:** 2026-04-08  
**Approach:** B — New design tokens + full page rebuild using frontend-design skill  
**Scope:** Visual style only. Navigation structure (bottom nav mobile, sidebar desktop) is unchanged.

---

## 1. Design Direction

**Fresh / Distinctive** — indigo-primary, tight typography, modern card shapes. Not the generic blue finance app look.

Inspirations drawn from: `DESIGN.md` (Wise: tight tracking, strong hierarchy) and `DESIGN_PROPOSAL.md` (Material Dashboard: card anatomy, stat rows). Neither is copied directly — this is a synthesis.

---

## 2. Design Tokens (`src/app/globals.css`)

### Color Palette

| Token | Light | Dark | Role |
|---|---|---|---|
| `--primary` | `#6366f1` (indigo-500) | `#818cf8` (indigo-400) | Buttons, active nav, accents |
| `--primary-foreground` | `#ffffff` | `#0f0f1a` | Text on primary bg |
| `--background` | `#f8f7ff` (indigo-tinted white) | `#0f0f1a` (dark navy) | Page background |
| `--card` | `#ffffff` | `#16162a` (lifted navy) | Card/surface background |
| `--card-foreground` | `#1a1a2e` | `#f1f0ff` | Text on cards |
| `--foreground` | `#1a1a2e` | `#f1f0ff` | Body text |
| `--muted` | `#f0f0ff` | `#1e1e35` | Subtle backgrounds |
| `--muted-foreground` | `#7c7c9a` | `#5c5c7a` | Secondary/meta text |
| `--border` | `#e8e7ff` | `#1e1e35` | Borders |
| `--destructive` | `#ef4444` | `#f87171` | Danger/sign out |
| `--income` | `#22c55e` | `#22c55e` | Income amounts (kept from original) |

### Typography

| Role | Size | Weight | Tracking | Case | Usage |
|---|---|---|---|---|---|
| KPI / Balance | `36px` | `800` | `-1.5px` | — | Balance, income, expense totals |
| Page title | `20px` | `700` | `-0.5px` | — | Dashboard, History, Tags, Profile |
| Stat card number | `20–28px` | `800` | `-0.5px` | — | Dashboard stat cards |
| Section label | `11px` | `600` | `0.5px` | UPPERCASE | "Recent Transactions", "Spending Trends" |
| Body | `14px` | `400` | `0` | — | Transaction description, form labels |
| Meta / caption | `11px` | `500` | `0` | — | Dates, tag names, counts |

Font: Inter (already loaded). No new font import needed.

### Radius Scale

| Name | Value | Used on |
|---|---|---|
| `--radius-sm` | `4px` | Inputs, small chips |
| `--radius-md` | `10px` | Buttons, tab switchers |
| `--radius-lg` | `16px` | Transaction rows card, list containers |
| `--radius-xl` | `20px` | Stat cards, main cards |
| `--radius-pill` | `9999px` | Month pills, tag pills, sidebar active nav |

### Shadow System (indigo-tinted)

```css
--shadow-card-sm:  0 1px 3px rgba(99,102,241,0.06), 0 1px 2px rgba(99,102,241,0.04);
--shadow-card-md:  0 2px 12px rgba(99,102,241,0.08), 0 1px 4px rgba(99,102,241,0.06);
--shadow-card-lg:  0 4px 20px rgba(99,102,241,0.15), 0 2px 8px rgba(99,102,241,0.10);
--shadow-hero:     0 8px 32px rgba(99,102,241,0.35);
--shadow-colored:  0 4px 20px rgba(99,102,241,0.40);
```

### Hero Gradient

```css
--gradient-hero: linear-gradient(135deg, #4f46e5 0%, #6366f1 60%, #818cf8 100%);
```

Used on: dashboard balance card (mobile), FAB button.

---

## 3. Layout Shell (`src/app/(app)/layout.tsx`)

No structural changes. Visual updates only:

- **Sidebar logo**: `keru.` wordmark — `font-weight: 800`, `letter-spacing: -0.5px`, indigo dot (`<span style="color:#6366f1">.</span>`)
- **Sidebar active nav**: pill shape (`border-radius: 9999px`), `background: #6366f1`, white text/icon. Replace current `bg-primary/10 text-primary` tint.
- **Sidebar inactive nav**: `text-muted-foreground`, hover `bg-muted`
- **Bottom nav FAB**: rounded square (`border-radius: 14px`) with hero gradient background and colored shadow. Replace current circular FAB.
- **Bottom nav active icon**: indigo color, label `font-weight: 600`
- **Page background**: `bg-background` (picks up new `--background` token automatically)

---

## 4. Pages

### 4a. Login & Register (`src/app/(auth)/`)

- Centered layout (unchanged)
- Add branded icon mark: `48×48px` rounded square (`border-radius: 14px`) with hero gradient, white `K` at `font-size: 20px font-weight: 800`, above the wordmark
- Wordmark: `keru.` same treatment as sidebar
- Inputs: `border: 1px solid var(--border)`, `border-radius: var(--radius-md)`, `background: var(--card)`
- Primary button: `background: #6366f1`, `border-radius: var(--radius-md)`, `box-shadow: var(--shadow-colored)`
- Link: `color: #6366f1 font-weight: 600`

### 4b. Dashboard (`src/app/(app)/dashboard/page.tsx`)

**Mobile:**
- Remove `<BalanceCard>` component. Replace with full-bleed indigo hero card:
  - Background: `var(--gradient-hero)`, `border-radius: 24px`, `box-shadow: var(--shadow-hero)`
  - Shows: month label (muted white, uppercase), balance (36px 800 weight white), income row + expenses row below
- Two quick-action buttons below hero: `+ Expense` (indigo filled) and `+ Income` (white outlined), side by side
- Section labels: uppercase 11px 600 weight
- Transaction rows: inside a white card (`border-radius: var(--radius-lg)`), each row has a `36×36px` icon badge (`border-radius: 10px`). Badge background: muted indigo (`#f0f0ff`) for expenses, muted green (`#f0fff4`) for income. Badge content: first letter of the description or tag name.

**Desktop:**
- 3-card stat row: Balance card uses hero gradient (indigo), Income and Expenses use white cards with `var(--shadow-card-md)`
- Chart + recent transactions: unchanged layout (`grid-cols-[1fr_340px]`), new card styles applied

### 4c. History (`src/app/(app)/expenses/page.tsx`)

- Tab switcher: white card background with indigo active tab (filled, `border-radius: var(--radius-md)`)
- Month filter — mobile: horizontal-scroll pill chips. Active pill: `background: #6366f1 color: white`. Inactive: `background: var(--card) border: 1px solid var(--border)`
- Month filter — desktop: vertical list, same pill active state
- Transaction list: white card container (`border-radius: var(--radius-lg) box-shadow: var(--shadow-card-md)`). Each row has icon badge square (`36×36px rounded-[10px]`). Same badge treatment as dashboard rows (muted background, text initial).
- Income amounts: `color: #22c55e font-weight: 700`
- Expense amounts: `color: var(--foreground) font-weight: 700`

### 4d. Profile (`src/app/(app)/profile/page.tsx`)

**No gradient hero.** Option B:
- Standard page header: `Profile` title + `Edit` button (same as current)
- Avatar card row: white card (`border-radius: var(--radius-xl) box-shadow: var(--shadow-card-md)`), flex row with:
  - Left: `52×52px` avatar with hero gradient background, white initials (`font-size: 18px font-weight: 800`), `border-radius: 14px`
  - Right: display name (`font-size: 14px font-weight: 700`), email (`font-size: 10px muted`), member since (`font-size: 9px color: #6366f1`)
- Info rows: white card with `border-radius: var(--radius-lg)`, row separator `border-bottom: 1px solid var(--muted)`
- Sign out button: `border: 1px solid var(--destructive)/40`, `color: var(--destructive)`, `border-radius: var(--radius-md)`

### 4e. Tags (`src/app/(app)/tags/page.tsx`)

- Each tag: white card row (`border-radius: var(--radius-lg) padding: 12px 16px box-shadow: var(--shadow-card-sm)`)
- Color indicator: `10×10px` circle left of tag name
- Count: right-aligned muted text
- New tag button: `+ New` link top-right, `color: #6366f1 font-weight: 600`

---

## 5. Dark Mode

Dark mode tokens defined in `globals.css` under `.dark {}`. Key differences:
- Background shifts to dark navy (`#0f0f1a`), cards to lifted navy (`#16162a`)
- Primary shifts to lighter indigo (`#818cf8`) for contrast on dark
- Borders become `#1e1e35` (subtle)
- Shadows remain but use slightly lower opacity

No component-level dark mode logic needed — all handled via CSS tokens.

---

## 6. What Does NOT Change

- Navigation structure (bottom nav mobile / sidebar desktop)
- Route structure, page logic, hooks, API calls
- shadcn/ui component internals (`src/components/ui/`)
- All TypeScript types, hooks, context, lib utilities
- Auth flow
- Recharts chart component (inherits colors from tokens automatically)

---

## 7. Files Modified

| File | Change |
|---|---|
| `src/app/globals.css` | Full token redesign (colors, radius, shadows, dark mode) |
| `src/app/(app)/layout.tsx` | Logo wordmark, sidebar active pill, FAB style |
| `src/app/(auth)/login/page.tsx` | Icon mark, typography, button/input styles |
| `src/app/(auth)/register/page.tsx` | Same as login |
| `src/app/(app)/dashboard/page.tsx` | Hero balance card, quick actions, stat cards |
| `src/components/app/balance-card.tsx` | Rewrite as indigo gradient hero card |
| `src/components/app/transaction-item.tsx` | Icon badge, new amount colors |
| `src/components/app/recent-transactions.tsx` | White card wrapper, section label |
| `src/components/app/trends-chart.tsx` | Chart colors → indigo palette |
| `src/components/app/top-tags.tsx` | Section label, pill style |
| `src/app/(app)/expenses/page.tsx` | Tab switcher, month pills, list card |
| `src/app/(app)/profile/page.tsx` | Avatar card row (option B), info rows |
| `src/app/(app)/tags/page.tsx` | Tag card rows |
