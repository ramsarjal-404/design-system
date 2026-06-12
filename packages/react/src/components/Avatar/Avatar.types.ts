import { type HTMLAttributes, type ReactNode } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'offline';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Image source. When it fails to load the avatar gracefully falls back to initials. */
  src?: string;
  /** Image alt text — becomes the accessible name when the image renders. Falls back to `name`. */
  alt?: string;
  /**
   * Person's display name. Drives the initials fallback (max 2 characters) and the
   * deterministic background color (hashed onto `--color-chart-series-1…6`). Also used
   * as the accessible name when no `alt` is provided.
   */
  name?: string;
  /** Avatar size — sm 24px, md 32px, lg 40px, xl 56px. */
  size?: AvatarSize;
  /** Container shape — `circle` (default, `--radius-avatar`) or `square` (`--radius-ms`). */
  shape?: AvatarShape;
  /**
   * Optional presence dot pinned to the bottom-right corner. Maps to
   * online → `--color-status-success-text`, away → `--chart-yellow`,
   * offline → `--color-text-disabled`. Announced via an `aria-label` ("Online" …).
   */
  status?: AvatarStatus;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum number of avatars to render before collapsing the rest into a
   * "+N" overflow chip. Unset renders every child.
   */
  max?: number;
  /** Size applied to every avatar in the stack (overrides the children's own `size`). */
  size?: AvatarSize;
  /** Shape applied to every avatar in the stack (overrides the children's own `shape`). */
  shape?: AvatarShape;
  /** `<Avatar>` elements to stack. */
  children: ReactNode;
}
