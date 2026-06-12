import { forwardRef, type CSSProperties } from 'react';
import type { SkeletonProps } from './Skeleton.types';
import styles from './Skeleton.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function toCssSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Skeleton — Lepidus Design System
 *
 * Loading placeholder that mirrors the shape of the content it stands in for:
 * `text` lines, a `circle` (avatar/icon) or a `rect` (image/card block), with
 * a shimmering gradient sweep that falls back to a static fill under
 * `prefers-reduced-motion`. Skeletons are decoration — each renders
 * `aria-hidden="true"`; put `aria-busy="true"` (and ideally a live-region
 * announcement) on the loading container instead.
 *
 * No dedicated Figma frame yet — built token-first; add the frame and node
 * link when designed.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, lines = 1, className, style, ...props }, ref) => {
    const sizeStyle: CSSProperties = {
      width: toCssSize(width),
      height: toCssSize(height ?? (variant === 'circle' ? width : undefined)),
      ...style,
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          className={cx(styles.paragraph, className)}
          style={{ width: toCssSize(width), ...style }}
          {...props}
        >
          {Array.from({ length: lines }, (_, i) => (
            <span
              key={i}
              className={cx(styles.skeleton, styles.text, i === lines - 1 && styles.lastLine)}
              style={{ height: toCssSize(height) }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cx(styles.skeleton, styles[variant], className)}
        style={sizeStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
