type SizeCallback = () => void;

/**
 * One `ResizeObserver`, one `window.resize` listener and one animation frame
 * shared by every element being watched, instead of a set per component.
 *
 * A screen rendering hundreds of truncating labels used to allocate hundreds of
 * observers, hundreds of resize listeners and hundreds of animation frames —
 * and, because each frame read layout on its own, the browser could be forced
 * into a reflow once per label. Routing every watcher through this module keeps
 * the cost flat: one observer, and one frame in which all pending measurements
 * run back to back, so the layout is recalculated once for the whole batch.
 */
const callbacks = new Map<Element, SizeCallback>();
const pending = new Set<SizeCallback>();

let observer: ResizeObserver | null = null;
let frame: number | null = null;

const flush = () => {
  frame = null;

  // Snapshot first: a callback is free to schedule itself again, and that
  // belongs in the next frame rather than in this one's loop.
  const batch = Array.from(pending);
  pending.clear();

  batch.forEach((callback) => callback());
};

/**
 * Queues a measurement for the next animation frame, coalescing it with every
 * other measurement queued for that frame.
 *
 * Passing the same callback twice before the frame runs schedules it once.
 *
 * @param callback - Reads layout and stores the result; must be referentially stable
 */
export const scheduleMeasure = (callback: SizeCallback) => {
  pending.add(callback);

  if (frame === null) {
    frame = requestAnimationFrame(flush);
  }
};

const handleWindowResize = () => {
  callbacks.forEach(scheduleMeasure);
};

const handleResizeEntries = (entries: ResizeObserverEntry[]) => {
  entries.forEach((entry) => {
    const callback = callbacks.get(entry.target);

    if (callback) {
      scheduleMeasure(callback);
    }
  });
};

const teardown = () => {
  window.removeEventListener('resize', handleWindowResize);
  observer?.disconnect();
  observer = null;
  pending.clear();

  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
};

/**
 * Watches an element's box for size changes and calls back — batched through
 * {@link scheduleMeasure} — whenever it may need re-measuring.
 *
 * A parent can resize without the window doing so, which is what the
 * `ResizeObserver` covers; the `window.resize` listener stays for environments
 * that have no `ResizeObserver`.
 *
 * One callback per element: observing the same element again replaces it.
 *
 * @param element - The element to watch
 * @param callback - Runs when the element may have changed size; must be referentially stable
 * @returns Unsubscribes the element, tearing the shared observer down once nothing is left to watch
 */
export const observeElementSize = (
  element: Element,
  callback: SizeCallback,
) => {
  if (callbacks.size === 0) {
    window.addEventListener('resize', handleWindowResize);
  }

  callbacks.set(element, callback);

  if (!observer && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(handleResizeEntries);
  }

  observer?.observe(element);

  return () => {
    callbacks.delete(element);
    observer?.unobserve(element);
    pending.delete(callback);

    if (callbacks.size === 0) {
      teardown();
    }
  };
};
