import { Children, cloneElement, forwardRef, isValidElement, useState } from 'react';
import type { ReactElement } from 'react';
import type { AvatarGroupProps, AvatarProps, AvatarStatus } from './Avatar.types';
import styles from './Avatar.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Derive up to two initials — first word + last word ("Ada Lovelace" → "AL"). */
function getInitials(name?: string): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';
  return (first + last).toUpperCase().slice(0, 2);
}

/** Deterministic hash of the name onto the 6 chart-series tokens (1-based). */
function seriesIndex(name?: string): number {
  const value = name ?? '';
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return (hash % 6) + 1;
}

const STATUS_LABEL: Record<AvatarStatus, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

/**
 * Avatar — Lepidus Design System
 *
 * Identity thumbnail: renders the `src` image when it loads, otherwise falls
 * back to initials derived from `name` on a deterministic background hashed
 * from the name onto `--color-chart-series-1…6` with `--color-text-inverse`
 * text. Optional presence dot (`status`) and `circle`/`square` shapes.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    { src, alt, name, size = 'md', shape = 'circle', status, className, ...props },
    ref
  ) => {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const showImage = Boolean(src) && failedSrc !== src;
    const accessibleName = alt ?? name;

    return (
      <span
        ref={ref}
        className={cx(styles.avatar, styles[size], styles[shape], className)}
        {...props}
      >
        {showImage ? (
          <img
            className={styles.image}
            src={src}
            alt={alt ?? name ?? ''}
            onError={() => setFailedSrc(src ?? null)}
          />
        ) : (
          <span
            className={cx(styles.fallback, styles[`series${seriesIndex(name)}`])}
            role={accessibleName ? 'img' : undefined}
            aria-label={accessibleName}
          >
            <span aria-hidden="true">{getInitials(name)}</span>
          </span>
        )}
        {status ? (
          <span
            className={cx(styles.status, styles[`status-${status}`])}
            role="img"
            aria-label={STATUS_LABEL[status]}
          />
        ) : null}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

/**
 * AvatarGroup — Lepidus Design System
 *
 * Overlapping stack of Avatars. Children beyond `max` collapse into a "+N"
 * overflow chip; `size`/`shape` are pushed down onto every child so the
 * stack stays uniform.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size = 'md', shape = 'circle', className, children, ...props }, ref) => {
    const avatars = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
    const limit = max !== undefined && max >= 0 ? max : avatars.length;
    const visible = avatars.slice(0, limit);
    const overflow = avatars.length - visible.length;

    return (
      <div ref={ref} role="group" className={cx(styles.group, className)} {...props}>
        {visible.map((child, index) =>
          cloneElement(child, {
            key: child.key ?? index,
            size,
            shape,
            className: cx(styles.groupItem, child.props.className),
          })
        )}
        {overflow > 0 ? (
          <span
            className={cx(
              styles.avatar,
              styles[size],
              styles[shape],
              styles.groupItem,
              styles.overflow
            )}
            aria-label={`${overflow} more`}
          >
            <span aria-hidden="true">+{overflow}</span>
          </span>
        ) : null}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
