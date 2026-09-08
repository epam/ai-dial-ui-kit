import {
  AllCommunityModule,
  ModuleRegistry,
  setupAgTestIds,
} from 'ag-grid-community';

let registered = false;

/**
 * Registers AG Grid's community modules and configures its test-id
 * attribute exactly once, the first time either Grid generation actually
 * renders - never merely because a module that re-exports `DialGrid`/`Grid`
 * was imported or evaluated.
 *
 * Both Grid generations (`src/components/Grid/Grid.tsx`,
 * `src/components/New/Grid/Grid.tsx`) call this at the top of their render
 * path instead of running the registration at module scope. That keeps the
 * side effect provably absent from the module body itself: a consumer's
 * bundler that ends up retaining either Grid module in its graph for some
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
