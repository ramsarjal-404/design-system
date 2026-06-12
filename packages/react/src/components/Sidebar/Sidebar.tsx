import { forwardRef, type CSSProperties } from 'react';
import type { SidebarItem, SidebarProps } from './Sidebar.types';
import styles from './Sidebar.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function ItemInner({ item }: { item: SidebarItem }) {
  return (
    <>
      <span className={styles.iconBox}>{item.icon}</span>
      <span className={styles.label}>{item.label}</span>
    </>
  );
}

/**
 * Sidebar — Lepidus Design System (nav tokens)
 *
 * Vertical icon rail driven by component/nav/* tokens:
 *   - rail bg: component/nav/sidebar-bg (#1C4599)
 *   - icons + labels: component/nav/icon-color (#FFFFFF)
 *   - default active item: white square (component/nav/item-bg, radius-ms 9px)
 *     with the icon in component/nav/item-active-text (#2E98D4)
 *
 * variant="rounded" (Figma node 557:382, "Sidebar-Rounded"): capsule rail with
 * a component/nav/rounded-border stroke; the active item becomes a 50px circle
 * filled with component/nav/rounded-selected-bg (#11337A) inside a dashed
 * component/nav/rounded-selected-border ring, label in typography/label/md.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      variant = 'default',
      items,
      header,
      footer,
      width,
      ariaLabel = 'Primary',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const resolvedWidth = width ?? (variant === 'rounded' ? 85 : 100);
    const navStyle: CSSProperties = {
      ...style,
      width: typeof resolvedWidth === 'number' ? `${resolvedWidth}px` : resolvedWidth,
    };

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cx(styles.sidebar, variant === 'rounded' && styles.rounded, className)}
        style={navStyle}
        {...props}
      >
        {header != null && <div className={styles.header}>{header}</div>}

        <ul className={styles.items}>
          {items.map((item) => {
            const cls = cx(
              styles.item,
              item.active && styles.active,
              item.disabled && styles.disabled
            );
            return (
              <li key={item.key}>
                {item.href ? (
                  <a
                    href={item.disabled ? undefined : item.href}
                    className={cls}
                    aria-current={item.active ? 'page' : undefined}
                    aria-disabled={item.disabled || undefined}
                  >
                    <ItemInner item={item} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className={cls}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    <ItemInner item={item} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {footer != null && <div className={styles.footer}>{footer}</div>}
      </nav>
    );
  }
);

Sidebar.displayName = 'Sidebar';
