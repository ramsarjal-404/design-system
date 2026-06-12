import { forwardRef } from 'react';
import type { ElementType, Ref } from 'react';
import type { LinkProps } from './Link.types';
import styles from './Link.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Decorative new-tab glyph for external links. */
function ExternalGlyph() {
  return (
    <svg
      className={styles.externalIcon}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.75 3.75H4.25c-.83 0-1.5.67-1.5 1.5v6.5c0 .83.67 1.5 1.5 1.5h6.5c.83 0 1.5-.67 1.5-1.5V9.25" />
      <path d="M9.75 2.75h3.5v3.5" />
      <path d="M13 3 7.25 8.75" />
    </svg>
  );
}

/**
 * Link — Lepidus Design System
 *
 * Navigation anchor bound to semantic tokens: `--color-text-brand` text that
 * darkens to `--color-brand-primary-hover` on hover. `inline` (underlined,
 * for running text) and `standalone` (no underline, trailing icon slot)
 * variants; `external` adds target/rel plus a screen-reader "(opens in new
 * tab)" suffix; `disabled` renders a span with `aria-disabled` per WAI
 * guidance. Use the `as` prop to swap in a router link component.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      variant = 'inline',
      external = false,
      disabled = false,
      icon,
      as,
      href,
      target,
      rel,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cx(styles.link, styles[variant], className);
    const trailingIcon =
      variant === 'standalone' && icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null;

    if (disabled) {
      // WAI guidance: a disabled link is not a link — no href, not focusable.
      return (
        <span
          ref={ref as Ref<HTMLSpanElement>}
          className={cx(classes, styles.disabled)}
          aria-disabled="true"
          {...props}
        >
          {children}
          {trailingIcon}
        </span>
      );
    }

    const Component: ElementType = as ?? 'a';
    // Only forward href/target/rel when they have values — spreading
    // `href={undefined}` would clobber an href set internally by a router
    // link component passed via `as`.
    const anchorProps = {
      ...(href !== undefined && { href }),
      ...(external
        ? { target: '_blank', rel: 'noreferrer' }
        : {
            ...(target !== undefined && { target }),
            ...(rel !== undefined && { rel }),
          }),
    };
    return (
      <Component ref={ref} className={classes} {...anchorProps} {...props}>
        {children}
        {trailingIcon}
        {external ? (
          <>
            <span className={styles.visuallyHidden}>(opens in new tab)</span>
            <ExternalGlyph />
          </>
        ) : null}
      </Component>
    );
  }
);

Link.displayName = 'Link';
