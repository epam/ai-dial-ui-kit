import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

type Module = typeof import('../element-size-observer');

let observeElementSize: Module['observeElementSize'];
let scheduleMeasure: Module['scheduleMeasure'];

let constructedObservers = 0;
let observedElements: Element[] = [];
let unobservedElements: Element[] = [];
let disconnectCount = 0;
let notifyResize: ResizeObserverCallback | null = null;

class ResizeObserverStub implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    constructedObservers += 1;
    notifyResize = callback;
  }

  observe(element: Element) {
    observedElements.push(element);
  }

  unobserve(element: Element) {
    unobservedElements.push(element);
  }

  disconnect() {
    disconnectCount += 1;
  }
}

let frames: FrameRequestCallback[] = [];

/** Runs whatever the module queued, the way the browser would on the next frame. */
const runFrame = () => {
  const queued = frames;
  frames = [];
  queued.forEach((callback) => callback(0));
};

const resizeEntryFor = (target: Element) =>
  ({ target }) as unknown as ResizeObserverEntry;

const originalResizeObserver = globalThis.ResizeObserver;

/**
 * Observes through the module under test and remembers the unsubscribe, so a
 * test never leaves the previous module copy's resize listener attached to the
 * shared `window`.
 */
let unsubscribes: (() => void)[] = [];

const observe = (element: Element, callback: () => void) => {
  const unsubscribe = observeElementSize(element, callback);
  unsubscribes.push(unsubscribe);

  return unsubscribe;
};

beforeEach(async () => {
  constructedObservers = 0;
  observedElements = [];
  unobservedElements = [];
  disconnectCount = 0;
  notifyResize = null;
  frames = [];
  unsubscribes = [];

  globalThis.ResizeObserver =
    ResizeObserverStub as unknown as typeof ResizeObserver;

  vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(
    (callback) => {
      frames.push(callback);

      return frames.length;
    },
  );
  vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});

  // The module keeps its observer, its listener and its frame in module scope,
  // so every test needs a fresh copy of it.
  vi.resetModules();
  ({ observeElementSize, scheduleMeasure } =
    await import('../element-size-observer'));
});

afterEach(() => {
  unsubscribes.forEach((unsubscribe) => unsubscribe());
  unsubscribes = [];

  vi.restoreAllMocks();
  globalThis.ResizeObserver = originalResizeObserver;
});

describe('Dial UI Kit :: observeElementSize', () => {
  test('Should allocate one ResizeObserver and one resize listener for many elements', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const elements = [
      document.createElement('span'),
      document.createElement('span'),
      document.createElement('span'),
    ];

    elements.forEach((element) => observe(element, vi.fn()));

    expect(constructedObservers).toBe(1);
    expect(observedElements).toEqual(elements);
    expect(
      addEventListener.mock.calls.filter(([type]) => type === 'resize'),
    ).toHaveLength(1);
  });

  test('Should measure every observed element in a single frame on window resize', () => {
    const first = vi.fn();
    const second = vi.fn();

    observe(document.createElement('span'), first);
    observe(document.createElement('span'), second);
    // The initial observe schedules nothing on its own.
    expect(frames).toHaveLength(0);

    window.dispatchEvent(new Event('resize'));

    expect(frames).toHaveLength(1);

    runFrame();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  test('Should measure only the element the observer reported', () => {
    const measured = document.createElement('span');
    const onMeasured = vi.fn();
    const untouched = vi.fn();

    observe(measured, onMeasured);
    observe(document.createElement('span'), untouched);

    notifyResize?.([resizeEntryFor(measured)], {} as ResizeObserver);
    runFrame();

    expect(onMeasured).toHaveBeenCalledTimes(1);
    expect(untouched).not.toHaveBeenCalled();
  });

  test('Should stop measuring an element once it is unobserved', () => {
    const element = document.createElement('span');
    const measure = vi.fn();
    const other = vi.fn();

    const unobserve = observe(element, measure);
    observe(document.createElement('span'), other);

    unobserve();
    window.dispatchEvent(new Event('resize'));
    runFrame();

    expect(unobservedElements).toEqual([element]);
    expect(measure).not.toHaveBeenCalled();
    expect(other).toHaveBeenCalledTimes(1);
  });

  test('Should drop a measurement already queued for an unobserved element', () => {
    const measure = vi.fn();

    const unobserve = observe(document.createElement('span'), measure);

    scheduleMeasure(measure);
    unobserve();
    runFrame();

    expect(measure).not.toHaveBeenCalled();
  });

  test('Should tear the shared listener and observer down with the last element', () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const first = observe(document.createElement('span'), vi.fn());
    const second = observe(document.createElement('span'), vi.fn());

    first();

    expect(disconnectCount).toBe(0);

    second();

    expect(disconnectCount).toBe(1);
    expect(
      removeEventListener.mock.calls.filter(([type]) => type === 'resize'),
    ).toHaveLength(1);
  });

  test('Should build a new observer after a full teardown', () => {
    observe(document.createElement('span'), vi.fn())();
    observe(document.createElement('span'), vi.fn());

    expect(constructedObservers).toBe(2);
  });
});

describe('Dial UI Kit :: scheduleMeasure', () => {
  test('Should run a callback queued repeatedly only once per frame', () => {
    const measure = vi.fn();

    scheduleMeasure(measure);
    scheduleMeasure(measure);
    scheduleMeasure(measure);

    expect(frames).toHaveLength(1);

    runFrame();

    expect(measure).toHaveBeenCalledTimes(1);
  });

  test('Should coalesce callbacks from different elements into one frame', () => {
    const first = vi.fn();
    const second = vi.fn();

    scheduleMeasure(first);
    scheduleMeasure(second);

    expect(frames).toHaveLength(1);

    runFrame();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  test('Should defer a callback queued from inside a frame to the next one', () => {
    const followUp = vi.fn();
    const measure = vi.fn(() => scheduleMeasure(followUp));

    scheduleMeasure(measure);
    runFrame();

    expect(followUp).not.toHaveBeenCalled();

    runFrame();

    expect(followUp).toHaveBeenCalledTimes(1);
  });

  test('Should schedule a fresh frame after the previous one has run', () => {
    const measure = vi.fn();

    scheduleMeasure(measure);
    runFrame();
    scheduleMeasure(measure);

    expect(frames).toHaveLength(1);

    runFrame();

    expect(measure).toHaveBeenCalledTimes(2);
  });
});
