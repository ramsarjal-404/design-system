import type { ComponentType, SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** Width and height in px. Defaults to 24. */
  size?: number;
}

/**
 * Shared runtime wrapper for generated Lepidus icons.
 *
 * Each generated icon embeds its sanitized inner SVG markup via
 * dangerouslySetInnerHTML, keeps its original viewBox, and scales via the
 * `size` prop. Monochrome icons use `currentColor`, so they inherit the CSS
 * `color` of their context; multicolor brand icons keep their fills.
 *
 * Icons are decorative by default (`aria-hidden="true"`); pass
 * `aria-hidden={false}` plus an `aria-label` when the icon is meaningful.
 */
export function createIcon(
  viewBox: string,
  inner: string,
  rootFill: string = 'none'
): ComponentType<IconProps> {
  function Icon({ size = 24, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={size}
        height={size}
        fill={rootFill}
        aria-hidden="true"
        focusable="false"
        {...props}
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    );
  }
  return Icon;
}
