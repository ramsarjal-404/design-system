import { forwardRef, type CSSProperties } from 'react';
import type { ScrollbarProps } from './Scrollbar.types';
import styles from './Scrollbar.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Scrollbar — Lepidus Design System
 *
 * Presentational scrollbar track + thumb (Figma node 326:16 "scroll bar").
 * A fully-rounded pill track holding a thumb whose color reflects state.
 *
 * Token bindings (see Scrollbar.module.css):
 *   track → component/scrollbar/track · thickness → space/5 · radius → radius/xxl
 *   thumb: default → component/scrollbar/thumb · active → color/button/secondary/bg ·
 *          disabled → color/button/disabled/bg
 *
 * Variants: default | active | disabled.  Orientation: vertical | horizontal.
 */
export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  (
    {
      variant = 'active',
      orientation = 'vertical',
      thumbSize = 26,
      thumbOffset = 0,
      length = '451px',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const trackLength = typeof length === 'number' ? `${length}px` : length;
    const cssVars = {
      '--track-length': trackLength,
      '--thumb-size': `${thumbSize}%`,
      '--thumb-offset': `${thumbOffset}%`,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        role="scrollbar"
        aria-orientation={orientation}
        aria-disabled={variant === 'disabled' || undefined}
        aria-valuenow={Math.round(thumbOffset)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cx(styles.track, styles[orientation], styles[variant], className)}
        style={{ ...cssVars, ...style }}
        {...props}
      >
        <div className={styles.thumb} />
      </div>
    );
  }
);

Scrollbar.displayName = 'Scrollbar';
