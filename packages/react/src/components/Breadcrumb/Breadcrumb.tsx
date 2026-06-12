import { forwardRef, Fragment } from 'react';
import type { BreadcrumbProps } from './Breadcrumb.types';
import styles from './Breadcrumb.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Breadcrumb — Lepidus Design System
 *
 * Trail navigation matching the Figma "Bread crumb" component (node
 * 676:1587): ancestor crumbs are 14px semibold links in
 * component/breadcrumb/active-text (brand blue) with a bold "/" separator in
 * the same color; the current page is regular 14px --color-text-primary and
 * not interactive. Renders semantic <nav aria-label="Breadcrumb"> + <ol>
 * with aria-current="page" on the last crumb.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = '/', className, ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={cx(styles.breadcrumb, className)} {...props}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Fragment>
                  {item.href ? (
                    <a href={item.href} onClick={item.onClick} className={styles.link}>
                      {item.label}
                    </a>
                  ) : (
                    <button type="button" onClick={item.onClick} className={styles.link}>
                      {item.label}
                    </button>
                  )}
                  <span className={styles.separator} aria-hidden="true">
                    {separator}
                  </span>
                </Fragment>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  )
);

Breadcrumb.displayName = 'Breadcrumb';
