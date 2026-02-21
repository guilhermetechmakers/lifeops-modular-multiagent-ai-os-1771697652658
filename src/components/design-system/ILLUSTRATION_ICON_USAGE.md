# LifeOps Illustration & Icon Set

## Overview

Custom SVG illustrations for the landing page and iconography for modules and actions. Complements the Brand Logo System with consistent LifeOps branding.

## Illustrations

### HeroIllustration

Custom hero visual: AI operations, multi-agent orchestration, bento-style dashboard.

```tsx
import { HeroIllustration } from '@/components/design-system'

<HeroIllustration size="lg" className="drop-shadow-2xl" />
```

| Size | Pixels | Use Case        |
|------|--------|-----------------|
| sm   | 320    | Compact layouts |
| md   | 400    | Default         |
| lg   | 480    | Hero, marketing |

### EmptyStateIllustration

Helpful visuals for empty lists and dashboards.

```tsx
import { EmptyStateIllustration } from '@/components/design-system'
import { EmptyState } from '@/components/ui/empty-state'

<EmptyState
  icon={Inbox}
  illustration={<EmptyStateIllustration variant="projects" size="md" />}
  heading="No projects yet"
  description="Create your first project to get started."
  action={<Button>Create Project</Button>}
/>
```

| Variant  | Use Case              |
|----------|-----------------------|
| default  | Generic empty (inbox)  |
| projects | Projects module       |
| content  | Content module         |
| finance  | Finance module        |
| health   | Health module         |

## Module Icons

Custom SVG icons for LifeOps modules. Use for FeatureOverview, sidebar, and module dashboards.

```tsx
import {
  ModuleProjectsIcon,
  ModuleContentIcon,
  ModuleFinanceIcon,
  ModuleHealthIcon,
  ModuleCronjobsIcon,
  ModuleApprovalsIcon,
} from '@/components/design-system'

<ModuleProjectsIcon size="lg" />
<ModuleContentIcon size="md" useCurrentColor />
```

| Icon                 | Module   | Gradient/Color   |
|----------------------|----------|------------------|
| ModuleProjectsIcon   | Projects | primary          |
| ModuleContentIcon    | Content  | accent           |
| ModuleFinanceIcon    | Finance  | success          |
| ModuleHealthIcon     | Health   | primary→accent   |
| ModuleCronjobsIcon   | Cronjobs | primary→accent   |
| ModuleApprovalsIcon  | Approvals| accent→primary   |

## Action Icons

Custom SVG icons for actions (play, pause, approve).

```tsx
import { ActionPlayIcon, ActionPauseIcon, ActionApproveIcon } from '@/components/design-system'

<ActionPlayIcon size="md" />
<ActionPauseIcon size="sm" useCurrentColor />
<ActionApproveIcon size="lg" />
```

## Design System Integration

- **Colors:** Uses CSS variables (`--primary`, `--accent`, `--success`, `--border`, etc.)
- **Sizing:** Consistent size presets (sm, md, lg)
- **Accessibility:** Illustrations use `aria-hidden`; icons support `useCurrentColor` for theme inheritance
