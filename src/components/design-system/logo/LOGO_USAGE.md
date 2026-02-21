# LifeOps Brand Logo System

## Overview

The LifeOps Brand Logo System provides responsive SVG/vector assets with variants for light/dark modes and multiple sizes. Use across product pages, dashboards, and the marketing site for consistent branding.

## Components

### LifeOpsLogo
Full logo (icon + wordmark). Primary brand asset for navigation, headers, and marketing.

```tsx
import { LifeOpsLogo } from '@/components/design-system'

// Default: gradient, medium size, links to home
<LifeOpsLogo />

// Navigation (large, gradient)
<LifeOpsLogo size="lg" variant="gradient" asLink />

// Collapsed sidebar (icon only)
<LifeOpsLogo iconOnly size="md" variant="gradient" />

// Footer on dark background
<LifeOpsLogo size="lg" variant="gradient" asLink />
```

### LifeOpsIcon
Icon/mark only. Use for favicons, app icons, collapsed navigation, social avatars.

```tsx
import { LifeOpsIcon } from '@/components/design-system'

// Favicon size
<LifeOpsIcon size="xs" variant="gradient" />

// App icon
<LifeOpsIcon size="xl" variant="gradient" />

// Light variant on dark backgrounds (e.g., dark nav)
<LifeOpsIcon size="md" variant="light" />

// Dark variant on light backgrounds
<LifeOpsIcon size="md" variant="dark" />
```

### LifeOpsWordmark
"LifeOps" text only. Use when icon alone is insufficient (headers, print).

```tsx
import { LifeOpsWordmark } from '@/components/design-system'

<LifeOpsWordmark variant="gradient" size="xl" />
<LifeOpsWordmark variant="dark" size="lg" asLink />
```

## Variants

| Variant   | Use Case                          | Background          |
|-----------|------------------------------------|---------------------|
| `gradient`| Default, primary→accent gradient   | Any                 |
| `light`   | White logo                         | Dark backgrounds    |
| `dark`    | Dark logo                          | Light backgrounds   |

## Sizes

| Size | Pixels (icon) | Use Case                    |
|------|---------------|-----------------------------|
| `xs` | 16px          | Favicon, tiny badges        |
| `sm` | 24px          | Inline text, small nav      |
| `md` | 32px          | Default, cards              |
| `lg` | 48px          | Nav, headers, marketing     |
| `xl` | 64px          | Hero, large marketing       |

## Design System Integration

- **CSS Variables:** Logo colors use `--logo-primary`, `--logo-accent`, `--logo-light`, `--logo-dark` from `index.css`
- **Theme:** Automatically adapts when using `variant="light"` or `variant="dark"` with theme context
- **Accessibility:** Icons include `aria-label` or `aria-hidden` as appropriate

## Do Not

- Stretch or distort the logo
- Use colors outside the design system
- Add effects (drop shadow, outline) without design approval
- Use icon and wordmark with custom spacing that breaks alignment
