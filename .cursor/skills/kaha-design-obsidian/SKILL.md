---
name: kaha-design-obsidian
description: Apply the Obsidian black-and-white premium design system for KAHA.VN luxury lighting. Use when implementing any UI for KAHA, when the user mentions design tokens, typography, luxury look, black and white, premium UI, or brand consistency for KAHA.
---

# KAHA Obsidian Design System

Luxury lighting brand. Black-and-white editorial aesthetic. No playful shadows, no bouncy motion.

## Tokens

Use OKLCH for smooth contrast. Declare in `src/app/globals.css`:

**Accent (đã chốt):** *Platinum / brushed nickel* — lạnh, chroma thấp; đọc như kim loại xước trong showroom, không vàng champagne.

```css
:root {
  --ink-900: oklch(0.12 0 0);
  --ink-700: oklch(0.24 0 0);
  --ink-500: oklch(0.42 0 0);
  --ink-300: oklch(0.72 0 0);
  --paper:   oklch(0.98 0 0);
  --paper-warm: oklch(0.97 0.005 85);
  --hairline: oklch(0.88 0 0);
  --platinum: oklch(0.73 0.038 268);
  --platinum-deep: oklch(0.58 0.048 268);
}
```

Map in `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      ink: { 900: 'oklch(0.12 0 0)', 700: 'oklch(0.24 0 0)', 500: 'oklch(0.42 0 0)', 300: 'oklch(0.72 0 0)' },
      paper: 'oklch(0.98 0 0)',
      hairline: 'oklch(0.88 0 0)',
      platinum: { DEFAULT: 'oklch(0.73 0.038 268)', deep: 'oklch(0.58 0.048 268)' },
    },
  },
}
```

## Typography

Exactly two font families. Self-host via `next/font/local`.

- **Display**: Playfair Display (or Canela if licensed). Weights 400, 700. Optical sizing on.
- **Body**: Inter. Weights 400, 500, 600. Variable if possible.

```ts
import { Playfair_Display, Inter } from 'next/font/google';
export const fontDisplay = Playfair_Display({ subsets: ['latin','vietnamese'], weight: ['400','700'], variable: '--font-display', display: 'swap' });
export const fontBody = Inter({ subsets: ['latin','vietnamese'], weight: ['400','500','600'], variable: '--font-body', display: 'swap' });
```

Feature settings on body: `font-feature-settings: "ss01", "cv11", "tnum"` for thin numerals.

## Scale

Use a restrained scale. No intermediate sizes.

```
display-xl  : 96px / 1.0  weight 400  display
display-lg  : 72px / 1.05 weight 400  display
display-md  : 48px / 1.1  weight 400  display
h1          : 36px / 1.2  weight 600  body
h2          : 28px / 1.3  weight 600  body
h3          : 20px / 1.4  weight 600  body
body        : 16px / 1.6  weight 400  body
caption     : 13px / 1.5  weight 500  body (tracking 0.08em uppercase)
```

## Spacing

Section padding dày hơn thông thường. Never use 16px sections on desktop.

```
section-y  : 120px desktop / 64px mobile
section-x  : 48px desktop / 20px mobile
card-gap   : 24px
hairline-y : 1px  color var(--hairline)
```

## Motion

Three rules:

1. Duration 180-300ms. Never over 400ms.
2. Easing: `cubic-bezier(0.4, 0, 0.2, 1)`.
3. Transform + opacity only on scroll/hover. No `box-shadow` transitions.

```css
* { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
```

Use View Transitions API for page-to-page:
```tsx
import { unstable_ViewTransition as ViewTransition } from 'react';
<ViewTransition name={`product-${id}`}>...</ViewTransition>
```

## Component principles

- **Buttons**: solid `ink-900` background, `paper` text. Ghost variant: `ink-900` border 1px, transparent bg. No pills. Radius 0 or 2px.
- **Cards**: no shadow. Hairline border top or bottom only. White bg on `paper-warm` page.
- **Dividers**: 1px `hairline`, never thicker.
- **Inputs**: bottom border only. No box. Caret color `platinum`.
- **Images**: always 4:5 or 3:4 for product. 16:9 for hero. Fill container, never stretch.
- **Accent**: use `platinum` sparingly. Only for: active link underline, price highlight, badge "New". Never for headings or large surfaces.

## Hero templates

Three allowed hero layouts for KAHA. Pick one per landing page; do not invent more.

1. **Editorial split**: left column 48% text, right column 52% image, no margin between.
2. **Centered display**: display-xl headline centered, single image below at 100vw, 80vh.
3. **Full-bleed image**: image 100vw, 100vh with overlay text bottom-left, max-width 480px.

## Product detail layout

- Gallery left 60%, info right 40% on desktop.
- Gallery: 4:5 main image, thumbnail strip below.
- Info order: breadcrumb, title (h1), sku caption, price, variant selector, quote-request CTA, add-to-cart CTA, hairline, collapsible sections (Chi tiết kỹ thuật, Vật liệu, Bảo hành, Giao hàng).
- Tab bar mobile: `Thông tin` / `Spec` / `Đánh giá`.

## Icon & logo usage

- Logo file: `/Users/ga/Google Drive/KAHA.VN/KAHA-LOGO/kaha-2025-R.png` (PNG tạm đến khi có SVG).
- SVG preferred long-term; with PNG only, serve at intrinsic resolution — never upscale.
- Icons: Lucide icons only. Stroke width 1.5, never filled.
- Icon size: 16, 20, 24. No 18 or 22.

## Accessibility

- Body text contrast against `paper-warm`: `ink-900` passes AAA.
- Caption `ink-500`: passes AA, not AAA — use sparingly on small type.
- Focus ring: 2px `platinum-deep`, offset 2px.
- Never convey information by color alone (use icon + text).

## What not to do

- No purple, blue, red accent. No gradient. No glow.
- No tilted text, no handwritten font.
- No Font Awesome, no Bootstrap icons.
- No `text-shadow`, no `filter: blur()`.
- No animated loading skeleton with shimmer; use static hairline placeholder.
- No social proof badges plastered on hero.
- No emoji in UI copy.

## Reference pages to study

Use as mental model while building. Do not copy layouts 1:1.
- Flos.com — product detail hierarchy.
- Molteni.it — editorial hero.
- Visualcomfort.com — catalog filter UX.
