# PlanPal Style Guidelines

## Layout

- **Mobile-first** — all views designed for mobile first; desktop/tablet are progressive enhancements
- **Full-height screen** — each view is `flex flex-1 flex-col` filling the available space
- **Bottom navigation** — `BottomBar` (h-16) is the primary navigation, pinned at the bottom
- **No sidebar** — desktop may use wider padding or multi-column layouts, never a sidebar

## Spacing

| Token | Value | Usage |
|---|---|---|
| Page horizontal padding | `px-4` (16px) | Consistent on all view containers |
| Page top padding | `pt-4` (16px) | Above the page header |
| Page bottom padding | `pb-4` (16px) | Below scrollable content |
| Section spacing (vertical) | `gap-4` or `space-y-4` | Between sections/cards |
| Card/Item padding | `p-4` | Inside cards or list items |
| Between list items | `gap-2` or `gap-3` | Between stacked items |
| Icon-to-text gap | `gap-2` or `gap-3` | Inside icon+label rows |

## Typography

| Element | Size | Weight | Class |
|---|---|---|---|
| Page title | `text-2xl` (24px) | `font-semibold` | `text-2xl font-semibold` |
| Section title | `text-lg` (18px) | `font-semibold` | `text-lg font-semibold` |
| Card/Item title | `text-base` (16px) | `font-medium` | `text-base font-medium` |
| Body / description | `text-sm` (14px) | `font-normal` | `text-sm text-muted-foreground` |
| Small / metadata | `text-xs` (12px) | `font-normal` | `text-xs text-muted-foreground` |
| Bottom bar label | `text-xs` (12px) | `font-medium` | `text-xs font-medium` |

## Colors

- **Foreground / text** — `text-foreground` / `text-muted-foreground`
- **Backgrounds** — `bg-background` (page), `bg-card` / `bg-muted` (cards and surfaces)
- **Borders** — `border-border`
- **Active state** — `text-foreground` (bottom bar icon+label)
- **Inactive state** — `text-muted-foreground`

## Component Patterns

### Page view shell
```
<div className="flex flex-1 flex-col">
  <header className="px-4 pt-4">
    <h1 className="text-2xl font-semibold">Title</h1>
  </header>
  <div className="flex-1 overflow-y-auto px-4 pb-4">
    {/* content */}
  </div>
</div>
```

### Cards
- Use `rounded-xl border bg-card p-4` for card surfaces
- Card title row: `flex items-center justify-between`
- Gap between stacked cards: `space-y-3` or `flex flex-col gap-3`

### List items
- Row: `flex items-center justify-between py-3`
- Left side: icon + text with `flex items-center gap-3`
- Divider: `border-b border-border last:border-b-0` on items

## Shadows / Elevation

- Cards use `border` only, no box shadows
- Bottom bar uses `border-t`

## State Handling

- **Loading** — centered "Loading..." text (or skeleton placeholders in future)
- **Empty** — centered empty state with icon + message
- **Error** — `error.tsx` at route level with "Try again" button
