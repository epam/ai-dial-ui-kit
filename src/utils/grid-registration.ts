import {
  AllCommunityModule,
  ModuleRegistry,
  setupAgTestIds,
} from 'ag-grid-community';

let registered = false;

/**
 * Registers AG Grid's community modules and configures its test-id
 * attribute exactly once, the first time the Grid actually renders - never
 * merely because a module that re-exports `Grid` was imported or evaluated.
 *
 * The Grid (`src/components/New/Grid/Grid.tsx`) calls this at the top of its
 * render path instead of running the registration at module scope. That
 * keeps the side effect provably absent from the module body itself: a
 * consumer's bundler that ends up retaining the Grid module in its graph for some
 * other reason (e.g. an eager root-barrel re-export it cannot prove is
 * unused) no longer thereby executes `ag-grid-community`/`ag-grid-react`
 * registration - only actually rendering a Grid does.
 */
export const registerAgGridModulesOnce = (): void => {
  if (registered) {
    return;
  }
  registered = true;
  setupAgTestIds({ testIdAttribute: 'dataQA' });
  ModuleRegistry.registerModules([AllCommunityModule]);
};
