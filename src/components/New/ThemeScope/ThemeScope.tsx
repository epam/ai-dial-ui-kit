import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type ReactNode,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';

/**
 * Class names of the theme scopes wrapping the current subtree, outermost
 * first. Empty outside any `ThemeScope`.
 */
const ThemeScopeContext = createContext<string>('');

export interface ThemeScopeProps {
  /**
   * Class name that redefines the design tokens for this subtree — typically a
   * host-owned rule setting `--bg-*` / `--text-*` / `--stroke-*` custom
   * properties. Multiple space-separated classes are allowed.
   */
  className: string;
  children: ReactNode;
}

/**
 * Marks a subtree as living under a host-defined token scope, so overlays this
 * subtree opens in a portal are painted with the same tokens.
 * Design system 2.0
 *
 * Redefining design tokens on a panel root re-themes everything the panel
 * renders — until a `Dropdown`, `Popup`, `Tooltip` or `Calendar` escapes into a
 * `FloatingPortal` at the end of `<body>`, where the scope's custom properties
 * no longer reach it. Wrapping the panel in a `ThemeScope` re-applies the same
 * class to those portalled overlays, so an overlay opened from a dark panel
 * stays dark while the rest of the app keeps its own palette.
 *
 * The wrapper itself is `display: contents`, so it generates no box and leaves
 * the surrounding flex or grid layout untouched — custom properties inherit
 * through it all the same. Scopes nest: an inner scope's overlays carry the
 * outer classes first, matching the cascade they would see in place.
 *
 * @example
 * ```tsx
 * // .side-panel-theme redefines --bg-*, --text-* and --stroke-* tokens.
 * <ThemeScope className="side-panel-theme">
 *   <ConversationPanel {...props} />
 * </ThemeScope>
 * ```
 *
 * @param className - Class name redefining the design tokens for this subtree
 * @param children - The subtree painted with those tokens
 */
export const ThemeScope: FC<ThemeScopeProps> = ({ className, children }) => {
  const inherited = useContext(ThemeScopeContext);
  const scope = useMemo(
    () => [inherited, className].filter(Boolean).join(' '),
    [inherited, className],
  );

  return (
    <ThemeScopeContext.Provider value={scope}>
      <div className={mergeClasses('contents', className)}>{children}</div>
    </ThemeScopeContext.Provider>
  );
};

/**
 * Class names of the enclosing `ThemeScope`s, outermost first, or `''` when the
 * caller sits outside any scope. Components rendering into a `FloatingPortal`
 * merge this onto their floating root so the tokens follow them out of the
 * subtree.
 */
export const useThemeScope = (): string => useContext(ThemeScopeContext);
