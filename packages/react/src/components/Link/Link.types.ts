import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

export type LinkVariant = 'inline' | 'standalone';

export interface LinkProps extends ComponentPropsWithoutRef<'a'> {
  /**
   * Visual variant — `inline` (default) is underlined for use inside running text;
   * `standalone` drops the underline and supports a trailing `icon` slot.
   */
  variant?: LinkVariant;
  /**
   * Marks the destination as external: adds `target="_blank"` + `rel="noreferrer"`,
   * a visually-hidden "(opens in new tab)" suffix for screen readers, and a small
   * decorative new-tab glyph.
   */
  external?: boolean;
  /**
   * Disabled per WAI guidance: renders a non-focusable `<span aria-disabled="true">`
   * with no `href`, styled with the disabled text color.
   */
  disabled?: boolean;
  /**
   * Trailing icon slot for the `standalone` variant — pass an SVG using
   * `currentColor`. Rendered `aria-hidden`; ignored by the `inline` variant.
   */
  icon?: ReactNode;
  /**
   * Polymorphic escape hatch: `'a'` (default) or a component such as a router
   * link. The component receives all anchor props (`href`, `className`, …).
   */
  as?: ElementType;
  /** Link text (required — never rely on the icon alone). */
  children: ReactNode;
}
