# Skeleton loading guide

How to build a loading placeholder for **any** component or screen with `Skeleton`, `SkeletonShimmer` and `useSkeletonTiming`. Source: Figma "[DIAL] Patterns 2.0" — Skeleton instructions, the "Partial loading modal / popup" animation notes, and the "Add plugin" popup example.

A skeleton shows the shape of the content while it loads. It replaces **only the data that comes from the server**, so the layout stays the same and nothing jumps when the content arrives.

## Primitives

| Part      | Stands in for          | Use                                                                                                                           |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Container | The real block         | `SkeletonShimmer` — in the real block's slot, sized by its placeholders. It also carries the shimmer and the ARIA attributes. |
| Circle    | Images, avatars, icons | `<Skeleton variant={SkeletonVariant.Circular} width={24} height={24} className="bg-layer-sunken" />`                          |
| Bar       | Text                   | `<Skeleton variant={SkeletonVariant.Text} width="70%" height={20} className="rounded-xl bg-layer-sunken" />`                  |
| Shimmer   | Loading motion         | Built into `SkeletonShimmer`: one band over the whole container.                                                              |
| Timing    | When to show           | `useSkeletonTiming(isLoading)` — delay, minimum display time, reveal fade.                                                    |

Compose circles and bars explicitly with an explicit `variant`, `width` and `height`. Do **not** use the `paragraph` / `showTitle` / `avatar` shortcuts of `Skeleton` for patterns that must match a real layout — their sizes (16 px bars, 32/40/64 px avatars) differ from the design.

Inside a `SkeletonShimmer` the per-element pulse of every `Skeleton` is switched off, so you do not need `active={false}` on each one.

## Minimal example

```tsx
import {
  Skeleton,
  SkeletonShimmer,
  SkeletonVariant,
  useSkeletonTiming,
} from '@epam/ai-dial-ui-kit';

const PluginList = ({ isLoading, plugins }: Props) => {
  const {
    showPlaceholder,
    showSkeleton,
    placeholderClassName,
    showContent,
    contentClassName,
  } = useSkeletonTiming(isLoading);

  return (
    <div>
      {showPlaceholder && (
        <SkeletonShimmer
          label={showSkeleton ? 'Loading plugins' : undefined}
          className={`flex flex-col gap-4 ${placeholderClassName}`}
        >
          <div className="flex gap-3">
            <Skeleton
              variant={SkeletonVariant.Circular}
              width={24}
              height={24}
              className="shrink-0 bg-layer-sunken"
            />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton
                variant={SkeletonVariant.Text}
                width="70%"
                height={20}
                className="rounded-xl bg-layer-sunken"
              />
              <Skeleton
                variant={SkeletonVariant.Text}
                width="45%"
                height={20}
                className="rounded-xl bg-layer-base"
              />
            </div>
          </div>
        </SkeletonShimmer>
      )}
      {showContent && <div className={contentClassName}>{/* plugins */}</div>}
    </div>
  );
};
```

`SkeletonShimmer` renders its `label` in a live region **next to** the container, not inside it: an `aria-busy` region does not announce its own changes. The region is always rendered, so it is already in the page when the text arrives — mount `SkeletonShimmer` with `showPlaceholder` (from the start of the load) and pass `label` only once `showSkeleton` is `true`.

## Scope: wrap only the loaded content

`SkeletonShimmer` goes around **the one region whose content is loading** — nothing else. Find that region first, then wrap it. Never wrap the whole component.

- **Replace with skeleton:** images, avatars, icons, names, descriptions, list items — everything loaded from the server.
- **Keep real, outside `SkeletonShimmer`:** page title, navigation, tabs, labels, input fields, search, buttons, footer, headers, toolbars. They stay visible, interactive and unshimmered. A button may be `disabled` if its action needs the loaded data.

Example — a component laid out as `<Button> <Content> <Search>`: only `<Content>` is loading, so only it is wrapped.

```tsx
<div className="flex flex-col gap-4">
  <Button label="Add" /> {/* real */}
  {/* content slot: the same element and layout role (flex-1, grid cell, …) for skeleton and content */}
  <div className="min-h-0 flex-1">
    {showPlaceholder && (
      <SkeletonShimmer
        label={showSkeleton ? 'Loading items' : undefined}
        className={`flex flex-col gap-4 ${placeholderClassName}`}
      >
        {/* bars and circles, in normal flow */}
      </SkeletonShimmer>
    )}
    {showContent && <div className={contentClassName}>{/* items */}</div>}
  </div>
  <Search /> {/* real */}
</div>
```

Wrong: `<SkeletonShimmer><Button/><Content/><Search/></SkeletonShimmer>` or a skeleton drawn over the button and the search field — the shimmer sweeps across controls that never load, and `aria-hidden` makes them unreachable to assistive technology.

Test: if an element would look the same without the data, it is not skeleton. If you cannot name the data that is loading for an element, leave it real.

## Height: let the content size it, never fix it

**Do not set a fixed height** (`h-[320px]`, `height: 588px`) on a skeleton or its wrapper. Fixed heights break on other viewports, font sizes, zoom, translations and breakpoints. The skeleton gets its height the way the real content does.

A skeleton collapses to 0 when nothing in it has height of its own. The shimmer band is absolutely positioned and adds none, so the height must come from the placeholders. Rules:

1. **Placeholders are in normal flow and carry the height.** Every bar and circle has an explicit `width` and `height` (20 px bars; 24 / 48 px circles) and is a regular block or flex child — never `absolute`, never `h-full` of a parent that has no height. The container is `h-auto`; its height is the sum of its rows and gaps, so it grows and shrinks with them.
2. **Same slot as the real content.** Render the skeleton and the content in the **same parent element**, with the same layout role (`flex-1`, a grid cell, `min-h-0` and so on) and the same padding and gaps. Then the slot decides how big the area is — responsive exactly like the content — and the skeleton only fills it.
3. **Mirror the structure, so the heights match naturally.** Same number of lines per item, same gaps and padding. For lists render a typical number of rows (3–6, enough to read as a list); the slot's `overflow-clip` trims the excess when the slot is short, and a taller slot simply shows more of the container's own background.
   - **Content-sized containers (popups, dropdowns, cards, panels with no set height): at least 3 lines.** Their height is whatever the content gives them, so with no data they are 0 high — the skeleton is the only thing that can hold the space. Always render **a minimum of 3 placeholder lines** (bars 20 px, 16 px apart; or 3 list items), never 1–2, never an empty shimmer. Use more when the real content is usually longer. Do not add a fixed height to achieve this; the lines are the height.
4. **Express any minimum with the layout, not a pixel height.** If the slot would be empty without data, give it a **floor** with relative units (`min-h-32`, `min-h-[8lh]`) — a `min-height`, never `height`.
5. **Do not rely on `h-full`, `flex-1` or `grow` on the `SkeletonShimmer` itself.** They resolve to nothing inside an auto-height parent. If the skeleton must fill a flex or grid slot, put the sizing class on the **slot** and let the shimmer be a plain block inside it.
6. **Hold the space during the timing delay too.** `useSkeletonTiming` shows nothing for the first 400 ms. If the skeleton is the only thing giving the container height, render it on `showPlaceholder` with `placeholderClassName` (invisible, but in layout) instead of `showSkeleton` — see [Timing](#timing). This is the usual reason a content-sized popup is 0 high.
7. **Do not let a flex parent squash it** — `shrink-0` on a skeleton that should keep its natural height.

**Check before you finish:** force loading on (Storybook, or a temporary `isLoading = true`) and resize the viewport. The skeleton must measure more than 0 px at every width, and the area must not jump when the content arrives. jsdom does no layout, so a test can only assert structure: the placeholders have `width` and `height`, and no fixed-height class sits on the container.

## Tone

Two tones, both from **kit tokens**. Set them with token classes in `className`.

| Tone  | Class             | Use for                                          |
| ----- | ----------------- | ------------------------------------------------ |
| Dark  | `bg-layer-sunken` | Primary lines: titles, list-item names, circles. |
| Light | `bg-layer-base`   | Secondary lines: subtitles, descriptions.        |

- **Prefer kit tokens.** Do not use the `color` prop, hex values, or app-specific CSS variables for skeleton colour. The tokens follow the host's theme through the kit's own theming, so a skeleton stays correct in light and dark without extra work.
- `Skeleton`'s default background is `bg-layer-raised`, which is nearly invisible on a raised surface such as a popup. **Always override it** with one of the two classes above.

All bars are **20 px high** with a **12 px radius** (`rounded-xl`). Circles are fully round.

## Sizing rules

| Content                       | Skeleton                                                                                                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title                         | One long dark bar, **20 px** high.                                                                                                                                               |
| Description, subtitle         | A **shorter, lighter** bar under the title.                                                                                                                                      |
| Paragraph                     | Two bars, **20 px** high: one long (about 69% of the container), one about **75–80%** of the first. **8 px** gap between them.                                                   |
| Short text (version, tag)     | Short bar, about **100–150 px** wide.                                                                                                                                            |
| Long text (name, description) | Full-width bar. Descriptions get **two lines**.                                                                                                                                  |
| List item                     | Circle + text column, **12 px** apart. Text column = dark bar, **12 px** gap, shorter light bar for the subtitle. Rows are **16 px** apart. A list without icons uses bars only. |
| Image, avatar, icon           | Circle: **24 px** in lists, **48 px** in cards.                                                                                                                                  |
| Sidebar / catalog list        | Bars only, **20 px** high, **16 px** apart, **8 px** inset from the left edge.                                                                                                   |

### Rhythm

- Vary bar widths — about **40% / 70% / 100%** — and **alternate dark and light** rows, so the result looks like real text.
- Widths are **fixed, not random**. Never use `Math.random()`: it causes hydration mismatches and a different look on every render.
- Sidebar example (container 224 px): 108, 208, 176, 208, 176, 208, 176, 148, 208, 176, 148, 208, 176, 148 px, alternating dark / light.

## Layout stability

- The skeleton has the **same structure** as the real content (avatar, title, description lines).
- The skeleton sits in the **same slot** as the real content, so the area has the same size in both states. Do not pin it with a fixed height; if the surrounding layout already has a size (a popup with a set height), the skeleton just fills that slot.
- Nothing moves when the content appears.

## Animation

One motion source, provided by `SkeletonShimmer`: a single band that crosses the whole loading container.

- **One** wave over the whole list container — **not one per row**. Never put a `SkeletonShimmer` per row.
- Left → right, **1.5 s**, `linear`, `infinite`, animated with `transform: translateX` (not `background-position`).
- Band: white gradient peaking at **70% opacity**, about **50%** of the container width, starting fully off the left edge and ending fully off the right edge. The peak colour is the `--skeleton-shimmer-color` CSS variable (default `rgb(255 255 255 / 0.7)`); a host can override it, for example to tone the band down in a dark theme.
- `prefers-reduced-motion: reduce` → no animation; the static skeleton stays. `SkeletonShimmer` handles this itself.
- Only the loading area animates. Header, input and footer stay static and **interactive**, so the popup never looks frozen.
- **One primary indicator.** Do not run a spinner and a shimmer at full strength together — keep one primary and make the other quiet or static (e.g. a small spinner in the input beside a "Scanning…" caption while the list shimmers).
- `active={false}` on `SkeletonShimmer` gives a static skeleton.

## Timing

`useSkeletonTiming(loading, { delay?, minDuration? })` applies the rules:

- Show the skeleton only if loading takes longer than **300–500 ms** (`delay`, default **400**). A fast response never flashes a placeholder.
- Once shown, keep it for at least **500 ms** (`minDuration`, default **500**).
- When the content is ready, `contentClassName` **crossfades it in over 180 ms** (inside the 150–200 ms range) and the shimmer unmounts. It is empty when no skeleton was shown and under reduced motion.

It returns `showSkeleton` and `showContent`, plus `showPlaceholder` and `placeholderClassName`. During the delay `showSkeleton` and `showContent` are both `false`.

**Do not render nothing during the delay.** A container whose height depends on its content (popup, dropdown, card) would be empty and **0 high** for those 400 ms — and for the whole load if the skeleton is the only thing holding its height. Mount the skeleton from the start with `showPlaceholder` and pass `placeholderClassName` to `SkeletonShimmer`: it is `invisible` during the delay (the rows hold the space, nothing is drawn) and empty once the skeleton is shown. A fast response then still never flashes a placeholder, and the container never collapses. Use `showSkeleton` only where the space is held by something else.

**Pass `label` only while the skeleton is visible:** `label={showSkeleton ? 'Loading…' : undefined}`. `invisible` hides the drawing, not the live region — a `label` set during the delay would announce "Loading" on every load, including fast ones the user never sees a skeleton for. The live region itself is always mounted from the start of the load, so the text that arrives when the skeleton shows is announced reliably (see [Accessibility](#accessibility)).

## Accessibility

`SkeletonShimmer` sets these for you:

- `aria-busy="true"` on the loading container.
- `aria-hidden="true"` and `inert` on the placeholders, and `aria-hidden="true"` on the shimmer band, so they are neither read nor focusable.
- A `role="status"` announcement of `label`, in an always-mounted live region beside the container.

You still own:

- Do not put focusable elements (buttons, links, inputs) **inside** a skeleton.
- Cancel and close controls keep working during loading, so the user can abort.
- Give `label` a short, specific text ("Loading plugins"), and localise it.

## Loading versus empty

An empty, error or "no results" state appears **only once loading has finished**. While data is loading, the list is not empty — it is unknown.

- Decide the state from the loading flag **first**: `isLoading` → skeleton; then error → error state; then no items → empty state; then content. Never derive "empty" from `items.length === 0` while loading, because a list fed by a query or context is `[]` until the data arrives.
- Pass the data owner's loading flag into the component that renders the list (an `isLoading` prop) and gate its empty and error branches on it. A component that cannot see the flag will show its empty state first and the content after — a flash of "No results" before every load.
- This applies to lazy components too: a panel whose chunk is loading **and** whose data is loading must show the skeleton for both waits, then the empty state only if the loaded list is really empty.

## Suspense fallbacks for popups, dropdowns and overlays

A `Suspense` fallback is a loading state, and `fallback={null}` inside a popup, dropdown or `renderOverlay` body is the zero-height bug: the surface is open, but nothing inside it has height, so it opens at 0 px and jumps when the chunk arrives.

- The fallback of a popup, dropdown or overlay body must be a **skeleton that holds the panel's width and at least 3 lines** (see [Height](#height-let-the-content-size-it-never-fix-it)). Give it the same width classes and padding as the real panel.
- Make it the **same shape as the panel's own loading state**. Render one `*Skeleton` component in both places — as the `Suspense` fallback and as the branch the panel shows while `isLoading` — so the chunk wait and the data wait read as **one continuous skeleton** and nothing changes layout between them.
- The surface is already open, so a blank body for the default 400 ms delay reads as a broken popup: pass `{ delay: 0 }` to `useSkeletonTiming` inside it, and render on `showPlaceholder` (see [Timing](#timing)).
- `fallback={null}` is right only for something that has no visible surface until it loads (a modal that mounts only after the chunk arrives).

## Kit `Dropdown`

`Dropdown` has no intrinsic height for custom content, so a skeleton inside it has to carry the height itself.

**`renderOverlay`.** The overlay is whatever you return — no minimum height, no padding. Return the skeleton block (at least 3 lines, the panel's real width, on `showPlaceholder`); a bare `null` or a skeleton that renders nothing yet opens the dropdown at 0 px.

```tsx
<Dropdown
  renderOverlay={() => (
    <div className="w-72 p-3">
      {showPlaceholder && (
        <SkeletonShimmer
          label={showSkeleton ? 'Loading' : undefined}
          className={`flex flex-col gap-4 ${placeholderClassName}`}
        >
          {/* at least 3 rows, bars and circles with explicit sizes */}
        </SkeletonShimmer>
      )}
      {showContent && <div className={contentClassName}>{/* items */}</div>}
    </div>
  )}
>
  <Button label="Open" />
</Dropdown>
```

**`items`.** The dropdown renders each entry as a fixed-height `MenuItem` button that truncates and greys out when `disabled`. A skeleton placed in a regular item is clipped to one row and looks faded. Use **one** item of `type: DropdownItemType.PlainText` — a plain `div` with no height and no disabled styling — with `className: 'p-0!'` to drop its padding, whose `label` is the single `SkeletonShimmer` block. Never one item per placeholder row. Render the loading text in an always-mounted `sr-only` element beside it, so it is announced before the skeleton mounts.

A `loading` prop on `Dropdown` is not provided today; until it is, use the two patterns above.

## Recipe

1. List what the screen loads from the server. Only those parts become skeleton. Controls, search, headers and footers stay real, outside the shimmer ([Scope](#scope-wrap-only-the-loaded-content)).
2. Render the skeleton in the **same slot** as the real content, with placeholders in normal flow that carry their own height. No fixed heights ([Height](#height-let-the-content-size-it-never-fix-it)).
3. Wrap the placeholders in one `SkeletonShimmer`, with a `label`.
4. Replace each loaded element using the [sizing table](#sizing-rules), with kit-token tones.
5. Apply the [rhythm](#rhythm): fixed widths, alternating tone.
6. Leave controls, labels and chrome real, outside the shimmer container.
7. Drive it with `useSkeletonTiming(isLoading)`; render the skeleton on `showPlaceholder` with `placeholderClassName` (so the space is held during the delay), then `showContent` with `contentClassName`.
8. Check the order of states: loading → error → empty → content. An empty or error state never shows while `isLoading` ([Loading versus empty](#loading-versus-empty)).
9. For a popup, dropdown or lazy panel, use one skeleton for both the `Suspense` fallback and the data wait ([Suspense fallbacks](#suspense-fallbacks-for-popups-dropdowns-and-overlays)).
10. Force loading on (Storybook or a temporary `isLoading = true`), resize the viewport, and check: the skeleton box is taller than 0 at every width, the area does not jump when content arrives, and nothing but the loaded data is shimmering.

## Known gaps

- **`Skeleton` on its own** still pulses per element (`animate-pulse`, via `active`, default `true`) and has no `prefers-reduced-motion` guard. Use it inside `SkeletonShimmer`, which switches the pulse off; do not use a bare `Skeleton` list for a loading region.
- **`Skeleton` does not set `aria-hidden`** itself. `SkeletonShimmer` hides its children; a `Skeleton` used outside it needs `aria-hidden="true"` from you.
- **Defaults** — `bg-layer-raised` and a 4 px radius for `Text` / `Rectangular`; override with `className` as shown.
- **The `color` prop** exists on `Skeleton` for custom colours, but this guide does not use it: prefer the kit tokens.
