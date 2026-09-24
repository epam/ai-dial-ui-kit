# Theming & CSS Variable Tokens

AI DIAL UI Kit uses CSS custom properties (variables) for theming.
Dark and light themes are switched by setting different values for these variables on `:root` or a theme wrapper element.

## Usage in Tailwind

The Tailwind config maps CSS variables to utility classes.
Use these classes in your components:

```tsx
// Backgrounds
<div className="bg-layer-0" />   // darkest background
<div className="bg-layer-1" />   // main content area
<div className="bg-layer-2" />   // elevated panels

// Text
<span className="text-primary" />    // main text color
<span className="text-secondary" />  // muted text
<span className="text-error" />      // error state

// Borders
<div className="border border-primary" />  // standard border
<div className="border border-error" />    // error border
```

## Override CSS Variables

```css
:root {
  --bg-layer-0: #000000;
  --bg-layer-1: #0c101d;
  --bg-layer-2: #161b2d;
  --bg-layer-3: #1d2439;
  --text-primary: #eef1f7;
  --text-secondary: #9fa6bd;
  --text-error: #f76464;
  --stroke-primary: #696e7c;
  --controls-bg-accent-primary: #3664e2;
  /* ... see tailwind.config.js for full list */
}
```

## Overlay stacking

Portalled overlays stack on a ladder driven by one variable, `--z-overlay`
(default `52`): `z-popup` (base — `Popup` backdrop), `z-floating` (+1 —
`Dropdown`/`Select` overlays, submenus, `Calendar`), `z-interactive-tooltip`
(+2 — `InteractiveTooltip`), `z-tooltip` (+3 — `Tooltip`). To lift every
overlay above a host's own sticky header or modal, set the base once on `:root`
(or in a `ThemeScope` class) — the steps move together, so their order is kept:

```css
:root {
  --z-overlay: 1000;
}
```

Do not override `[role='menu']` or hardcode `z-[53]` in a host. To move one
overlay only, pass a `z-*` utility through its class prop (`listClassName`,
`overlayClassName`, `contentClassName`, `panelClassName`) — `mergeClasses`
replaces the layer's step with it.

## Token Reference
