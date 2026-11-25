# Skeleton loading guide

How to build a loading placeholder for **any** component or screen with `Skeleton`, `SkeletonShimmer` and `useSkeletonTiming`. Source: Figma "[DIAL] Patterns 2.0" — Skeleton instructions, the "Partial loading modal / popup" animation notes, and the "Add plugin" popup example.

A skeleton shows the shape of the content while it loads. It replaces **only the data that comes from the server**, so the layout stays the same and nothing jumps when the content arrives.

## Choose an existing loading implementation first

**Use the kit component's built-in skeleton when one exists.** Otherwise reuse a suitable kit recipe or an existing shared skeleton for the same layout; only then compose the kit primitives described below. Do not create a second loading implementation for a component that already owns one.

| Situation                                       | Use                                                                                                                                                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grid on kit 0.17.0 or later                     | `Grid` with `loading`, `loadingAppearance={GridLoadingAppearance.Skeleton}` and a localised `loadingLabel`. Leave the data and selection with the grid; do not swap in placeholder rows.                      |
| A reusable skeleton already matches the content | Reuse that composition for the loading state and, where appropriate, the `Suspense` fallback.                                                                                                                 |
| No suitable built-in state or recipe            | Compose `Skeleton` and `SkeletonShimmer`, driven by `useSkeletonTiming`. Extract a shared composition if multiple consumers need the same structure.                                                          |
| A column or slot needs a different shape        | Use the owning component's customization point and return kit `Skeleton` primitives, or `null` for a column with no loaded content. Do not replace the component's shimmer, timing or accessibility behavior. |

**Version availability:** `GridLoadingAppearance.Skeleton`, `loadingLabel`, `renderLoadingCell`, `SkeletonTone` and the `SKELETON_*` sizing exports are available from `@epam/ai-dial-ui-kit` 0.17.0. Do not assume they exist in an earlier version.

For example, from 0.17.0:

```tsx
import { Grid, GridLoadingAppearance } from '@epam/ai-dial-ui-kit';

<Grid
  columnDefs={columns}
  rowData={rows}
  loading={isLoading}
  loadingAppearance={GridLoadingAppearance.Skeleton}
  loadingLabel="Loading files"
/>;
```

`Grid` owns the loading overlay and timing. `renderLoadingCell` is optional for column-specific shapes; return `null` for an actions column rather than drawing a placeholder for its controls. The grid keeps its selection column empty. For a custom row height, supply `additionalGridOptions.rowHeight` so the skeleton follows it.

### Rules for composing a skeleton

- **Use kit primitives for every visible placeholder.** Draw bars and circles with `Skeleton`, and use one `SkeletonShimmer` for the loading region. Do not build shapes from styled `div`s or add application-specific skeleton colors, radii, gradients, keyframes or animation.
- **Separate layout from appearance.** Flex/grid layout, spacing, clipping and responsive slot sizing belong to the surrounding component. Skeleton tone, standard sizes, radius and motion come from kit props, exported constants and `SkeletonShimmer`. Dynamic measurements needed to match an existing layout, such as actual grid column widths, are layout exceptions—not a reason to recreate placeholder styling.
- **Prefer shared recipes to copies.** Keep a reusable skeleton composition beside its owning feature when no kit recipe fits, and use it in both ordinary loading and `Suspense`. Reusable kit-level bar, circle and list-row recipes are a possible future addition; they are **not public components today**.
- **Use the kit's public API.** From 0.17.0 use `SkeletonTone` and the exported `SKELETON_*` constants below. Before 0.17.0, use the documented kit token classes and standard sizes until the consumer upgrades; do not invent app-specific styles.

## Primitives

| Part      | Stands in for          | Use                                                                                                                  |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Container | The real block         | `SkeletonShimmer` — in the real block's slot, sized by its placeholders. It carries the shimmer and ARIA attributes. |
| Circle    | Images, avatars, icons | `Skeleton` with `SkeletonVariant.Circular`, a shared circle size and `SkeletonTone.Sunken`.                          |
| Bar       | Text                   | `Skeleton` with `SkeletonVariant.Text`, `SKELETON_BAR_HEIGHT`, `SKELETON_BAR_CLASS_NAME` and a `SkeletonTone`.       |
| Shimmer   | Loading motion         | Built into `SkeletonShimmer`: one band over the whole container.                                                     |
| Timing    | When to show           | `useSkeletonTiming(isLoading)` — delay, minimum display time, reveal fade.                                           |

Compose circles and bars explicitly with an explicit `variant`, `width` and `height`. Do **not** use the `paragraph` / `showTitle` / `avatar` shortcuts of `Skeleton` for patterns that must match a real layout — their sizes (16 px bars, 32/40/64 px avatars) differ from the design.

Inside a `SkeletonShimmer` the per-element pulse of every `Skeleton` is switched off, so you do not need `active={false}` on each one.

## Minimal example

This example uses the tone and sizing exports available from 0.17.0.

```tsx
import {
  SKELETON_BAR_CLASS_NAME,
  SKELETON_BAR_HEIGHT,
  SKELETON_BAR_WIDTHS,
  Skeleton,
  SkeletonShimmer,
  SkeletonTone,
  SkeletonVariant,
  useSkeletonTiming,
} from '@epam/ai-dial-ui-kit';

type Props = { isLoading: boolean; plugins: string[] };

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
          {SKELETON_BAR_WIDTHS.slice(0, 3).map((width) => (
            <Skeleton
              key={width}
              variant={SkeletonVariant.Text}
              width={width}
              height={SKELETON_BAR_HEIGHT}
              tone={SkeletonTone.Sunken}
              className={SKELETON_BAR_CLASS_NAME}
            />
          ))}
        </SkeletonShimmer>
      )}
      {showContent && (
        <div className={`flex flex-col gap-4 ${contentClassName}`}>
          {plugins.map((plugin) => (
            <div key={plugin}>{plugin}</div>
          ))}
        </div>
      )}
    </div>
  );
};
```

`SkeletonShimmer` renders its `label` in a live region **next to** the container, not inside it: an `aria-busy` region does not announce its own changes. The region is rendered whenever `SkeletonShimmer` is mounted, so mount the shimmer with `showPlaceholder` (from the start of the load) and pass `label` only once `showSkeleton` is `true`.

## Scope: wrap only the loaded content

`SkeletonShimmer` goes around **the one region whose content is loading** — nothing else. Find that region first, then wrap it. Never wrap the whole component.

- **Replace with skeleton:** images, avatars, icons, names, descriptions, list items — everything loaded from the server.
- **Keep real, outside `SkeletonShimmer`:** page title, navigation, tabs, labels, input fields, search, buttons, footer, headers, toolbars. They stay visible, interactive and unshimmered. A button may be `disabled` if its action needs the loaded data.
- **Preserve state.** Do not replace real records with invented placeholder data merely to display the skeleton. Keep the component's data and selection intact where its loading API supports that behavior; decide separately whether stale content remains visible during a refresh.

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

## Height: follow the content or its existing slot

**Do not add an arbitrary fixed height** (`h-[320px]`, `height: 588px`) merely to make a content-sized skeleton visible. Fixed heights break on other viewports, font sizes, zoom, translations and breakpoints. Let placeholders size a content-sized slot; if the real content already fills a sized region, the skeleton may fill that same region or follow its measured dimensions. A grid body overlay, for example, follows the grid viewport and actual column widths rather than establishing a new fixed height.

A skeleton collapses to 0 when nothing in it has height of its own. The shimmer band is absolutely positioned and adds none, so the height must come from the placeholders. Rules:

1. **In a content-sized slot, placeholders are in normal flow and carry the height.** Every bar and circle has an explicit `width` and `height` (20 px bars; 24 / 48 px circles) and is a regular block or flex child — never `absolute` or `h-full` of a parent that has no height. The container is `h-auto`; its height is the sum of its rows and gaps. An already-sized region may instead use the owning component's measured layout.
2. **Same slot as the real content.** Render the skeleton and the content in the **same parent element**, with the same layout role (`flex-1`, a grid cell, `min-h-0` and so on) and the same padding and gaps. Then the slot decides how big the area is — responsive exactly like the content — and the skeleton only fills it.
3. **Mirror the structure, so the heights match naturally.** Same number of lines per item, same gaps and padding. For lists render a typical number of rows (3–6, enough to read as a list); the slot's `overflow-clip` trims the excess when the slot is short, and a taller slot simply shows more of the container's own background.
   - **Content-sized containers (popups, dropdowns, cards, panels with no set height): at least 3 lines.** Their height is whatever the content gives them, so with no data they are 0 high — the skeleton is the only thing that can hold the space. Always render **a minimum of 3 placeholder lines** (bars 20 px, 16 px apart; or 3 list items), never 1–2, never an empty shimmer. Use more when the real content is usually longer. Do not add a fixed height to achieve this; the lines are the height.
4. **Express any minimum with the layout, not a pixel height.** If the slot would be empty without data, give it a **floor** with relative units (`min-h-32`, `min-h-[8lh]`) — a `min-height`, never `height`.
5. **Do not rely on `h-full`, `flex-1` or `grow` on `SkeletonShimmer` to create height in an auto-height parent.** Put sizing on the slot and let its placeholders carry the height. In an already-sized slot, filling the available height is valid.
6. **Hold the space during the timing delay too.** `useSkeletonTiming` shows nothing for the first 400 ms. If the skeleton is the only thing giving the container height, render it on `showPlaceholder` with `placeholderClassName` (invisible, but in layout) instead of `showSkeleton` — see [Timing](#timing). This is the usual reason a content-sized popup is 0 high.
7. **Do not let a flex parent squash it** — `shrink-0` on a skeleton that should keep its natural height.

**Check before you finish:** force loading on (Storybook, or a temporary `isLoading = true`) and resize the viewport. The skeleton must measure more than 0 px at every width, and the area must not jump when the content arrives. jsdom does no layout, so a test can assert structure and placeholder dimensions but not geometry. Do not add an arbitrary fixed height to a content-sized wrapper.

## Tone

Two tones, both from **kit tokens**. From 0.17.0, set `tone` rather than repeating a background class.

| Tone   | Prop                         | Token             | Use for                                          |
| ------ | ---------------------------- | ----------------- | ------------------------------------------------ |
| Sunken | `tone={SkeletonTone.Sunken}` | `bg-layer-sunken` | Primary lines: titles, list-item names, circles. |
| Base   | `tone={SkeletonTone.Base}`   | `bg-layer-base`   | Secondary lines: subtitles, descriptions.        |

- **Prefer the kit API.** Do not use the `color` prop, hex values, app-specific CSS variables or background overrides for skeleton colour. The kit's tones follow the host's theme.
- With no `tone`, `Skeleton` retains its existing `bg-layer-raised` background, which can be nearly invisible on a raised surface. Choose the appropriate tone explicitly.
- Before 0.17.0 (no `SkeletonTone`), use the token classes from the table above directly, and switch to the tone prop after upgrading.

Use `SKELETON_BAR_HEIGHT` (20 px) and `SKELETON_BAR_CLASS_NAME` (12 px radius) for bars, and `SKELETON_CIRCLE_SIZE_LIST` / `SKELETON_CIRCLE_SIZE_CARD` (24 / 48 px) for circles. `SKELETON_SHORT_BAR_WIDTH` supplies a short bar width, and `SKELETON_BAR_WIDTHS` supplies deterministic widths to cycle through. Circles are fully round. These constants are available from 0.17.0.

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

`useSkeletonTiming(loading, { delay?, minDuration? })` applies the rules. Use it instead of adding component-specific timers, unless the owning kit component already handles timing itself:

- Show the skeleton only if loading takes longer than **300–500 ms** (`delay`, default **400**). A fast response never flashes a placeholder.
- Once shown, keep it for at least **500 ms** (`minDuration`, default **500**).
- When the content is ready, `contentClassName` adds a **180 ms** reveal (inside the 150–200 ms range) and the shimmer unmounts. The class is empty when no skeleton was shown; its `motion-safe` animation does not run under reduced motion.

It returns `showSkeleton` and `showContent`, plus `showPlaceholder` and `placeholderClassName`. During the delay `showSkeleton` and `showContent` are both `false`.

**Do not render nothing during the delay.** A container whose height depends on its content (popup, dropdown, card) would be empty and **0 high** for those 400 ms — and for the whole load if the skeleton is the only thing holding its height. Mount the skeleton from the start with `showPlaceholder` and pass `placeholderClassName` to `SkeletonShimmer`: it is `invisible` during the delay (the rows hold the space, nothing is drawn) and empty once the skeleton is shown. A fast response then still never flashes a placeholder, and the container never collapses. Use `showSkeleton` only where the space is held by something else.

**Pass `label` only while the skeleton is visible:** `label={showSkeleton ? 'Loading…' : undefined}`. `invisible` hides the drawing, not the live region — a `label` set during the delay would announce "Loading" on every load, including fast ones the user never sees a skeleton for. The live region itself is always mounted from the start of the load, so the text that arrives when the skeleton shows is announced reliably (see [Accessibility](#accessibility)).

## Accessibility

`SkeletonShimmer` sets these for you:

- `aria-busy="true"` on the loading container.
- `aria-hidden="true"` and `inert` on the placeholders, and `aria-hidden="true"` on the shimmer band, so they are neither read nor focusable.
- A `role="status"` announcement of `label`, in a live region beside the container. It is mounted whenever `SkeletonShimmer` is mounted.

You still own:

- Mount the live region before adding its message. With the default delay, mount `SkeletonShimmer` on `showPlaceholder` and add its label only when `showSkeleton` becomes true. If the shimmer cannot remain mounted before the message, keep a separate `LiveRegion` mounted outside the busy subtree and update only its text; do not duplicate the announcement.
- Do not put focusable elements (buttons, links, inputs) **inside** a skeleton. If an overlay covers interactive stale content, prevent interaction and remove that covered subtree from keyboard navigation and the accessibility tree while it is covered; `aria-hidden` alone does not remove focus.
- Cancel and close controls keep working during loading, so the user can abort.
- Give `label` a short, specific text ("Loading plugins"), and localise it.

## Loading versus empty

An empty, error or "no results" state appears **only once loading has finished**. While data is loading, the list is not empty — it is unknown.

- Decide the state from the loading flag **first**: `isLoading` → skeleton; then error → error state; then no items → empty state; then content. Never derive "empty" from `items.length === 0` while loading, because a list fed by a query or context is `[]` until the data arrives. When using `useSkeletonTiming`, defer the error, empty and content branches until `showContent` is true, so they do not appear behind a skeleton still meeting its minimum duration.
- Pass the data owner's loading flag into the component that renders the list (an `isLoading` prop) and gate its empty and error branches on it. A component that cannot see the flag will show its empty state first and the content after — a flash of "No results" before every load.
- This applies to lazy components too: a panel whose chunk is loading **and** whose data is loading must show the skeleton for both waits, then the empty state only if the loaded list is really empty.

## Suspense fallbacks for popups, dropdowns and overlays

A `Suspense` fallback is a loading state, and `fallback={null}` inside a popup, dropdown or `renderOverlay` body is the zero-height bug: the surface is open, but nothing inside it has height, so it opens at 0 px and jumps when the chunk arrives.

- The fallback of a popup, dropdown or overlay body must be a **skeleton that holds the panel's width and at least 3 lines** (see [Height](#height-follow-the-content-or-its-existing-slot)). Give it the same width classes and padding as the real panel.
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

1. Check for the component's built-in skeleton, then a shared recipe, before composing primitives ([Choose an existing loading implementation first](#choose-an-existing-loading-implementation-first)).
2. List the data that loads. Keep controls, search, headers and footers real, outside the shimmer ([Scope](#scope-wrap-only-the-loaded-content)). Preserve the component's data and selection where supported.
3. Render the skeleton in the **same slot** as the real content. In content-sized slots, placeholders carry the height; an already-sized region may be filled or measured ([Height](#height-follow-the-content-or-its-existing-slot)).
4. Use `Skeleton` for each bar or circle and one `SkeletonShimmer` for the loading area. Do not create custom placeholder styles or motion.
5. Use the kit's tones and sizing constants (0.17.0+) ([Tone](#tone), [Sizing](#sizing-rules)); use layout classes only for layout.
6. Apply the [rhythm](#rhythm): fixed widths, alternating tone. Share a composition when the same structure is reused.
7. Use `useSkeletonTiming(isLoading)` unless the component owns timing; render the skeleton on `showPlaceholder` with `placeholderClassName`, then show the resolved state on `showContent`.
8. Check the order of states: loading → error → empty → content. Do not show an empty or error state until loading and the skeleton's minimum display time have finished ([Loading versus empty](#loading-versus-empty)).
9. For a popup, dropdown or lazy panel, use one skeleton for both the `Suspense` fallback and the data wait ([Suspense fallbacks](#suspense-fallbacks-for-popups-dropdowns-and-overlays)).
10. Keep the announcement region mounted before its localised message arrives, and keep placeholder and covered interactive content inaccessible while loading ([Accessibility](#accessibility)).
11. Force loading on (Storybook or a temporary `isLoading = true`), resize the viewport, and check: the skeleton box is taller than 0 at every width, the area does not jump when content arrives, and nothing but the loaded data is shimmering.

## Known gaps

- **`Skeleton` on its own** still pulses per element (`animate-pulse`, via `active`, default `true`) and has no `prefers-reduced-motion` guard. Use it inside `SkeletonShimmer`, which switches the pulse off; do not use a bare `Skeleton` list for a loading region.
- **`Skeleton` does not set `aria-hidden`** itself. `SkeletonShimmer` hides its children; a `Skeleton` used outside it needs `aria-hidden="true"` from you.
- **Defaults** — with no tone, `Skeleton` uses `bg-layer-raised`, and `Text` / `Rectangular` have a 4 px radius. From 0.17.0 use a `SkeletonTone` and `SKELETON_BAR_CLASS_NAME` for the prescribed bar appearance.
- **The `color` prop** exists on `Skeleton` for custom colours, but this guide does not use it: prefer the kit tokens.
