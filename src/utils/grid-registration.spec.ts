import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { describe, expect, test, vi } from 'vitest';

describe('Dial UI Kit :: registerAgGridModulesOnce', () => {
  test('does not register AG Grid modules merely by being imported', async () => {
    const registerModulesSpy = vi.spyOn(ModuleRegistry, 'registerModules');

    // Fresh module instance: this file's own `registered` guard must not
    // have been flipped by importing the module alone.
    vi.resetModules();
    await import('./grid-registration');

    expect(registerModulesSpy).not.toHaveBeenCalled();
  });

  test('registers AG Grid modules the first time it is called, and only once', async () => {
    const registerModulesSpy = vi.spyOn(ModuleRegistry, 'registerModules');

    vi.resetModules();
    const { registerAgGridModulesOnce } = await import('./grid-registration');

    registerAgGridModulesOnce();
    expect(registerModulesSpy).toHaveBeenCalledWith([AllCommunityModule]);
    // AG Grid's own `registerModules` may internally call itself while
    // expanding a combined module like `AllCommunityModule` - that is its
    // implementation detail, not this guard's. What this guard owns is:
    // a *second* top-level call must add zero further underlying calls.
    const callsAfterFirstInvocation = registerModulesSpy.mock.calls.length;

    registerAgGridModulesOnce();
    registerAgGridModulesOnce();
    expect(registerModulesSpy).toHaveBeenCalledTimes(callsAfterFirstInvocation);
  });
});
