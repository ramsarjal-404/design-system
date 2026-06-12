import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import { Portal } from './Portal';
import styles from './Popover.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Placement of the floating layer relative to its anchor. */
export type PopoverPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** The element the popover is anchored to — a ref object or the element itself. */
  anchor: RefObject<HTMLElement | null> | HTMLElement | null;
  /** Whether the popover is shown. While `false`, nothing is rendered. */
  open: boolean;
  /** Called on outside pointer-down and on Escape. */
  onClose?: () => void;
  /**
   * Preferred placement (`bottom-start` default). Flips to the opposite
   * vertical side automatically when there is not enough viewport space.
   */
  placement?: PopoverPlacement;
  /** Gap in px between the anchor and the popover. Default 4. */
  offset?: number;
  /** Floating content. */
  children?: ReactNode;
}

/** SSR-safe layout effect (Popover only positions on the client). */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function resolveAnchor(
  anchor: RefObject<HTMLElement | null> | HTMLElement | null
): HTMLElement | null {
  if (!anchor) return null;
  return anchor instanceof HTMLElement ? anchor : anchor.current;
}

interface Position {
  top: number;
  left: number;
  placement: PopoverPlacement;
}

/**
 * Popover — Lepidus Design System primitive
 *
 * Anchored floating layer: positions itself against `anchor` with
 * `getBoundingClientRect` (position: fixed, viewport coordinates), tracks
 * scroll/resize, and flips vertically when it would overflow the viewport.
 * Renders through `Portal` on the `z/dropdown` layer, closes on outside
 * pointer-down and Escape, and enters with an opacity/transform transition
 * (`duration/fast` + `easing/standard`, disabled under
 * `prefers-reduced-motion: reduce`).
 *
 * The surface styling (background, border, shadow) belongs to the consumer —
 * Tooltip, menus and future flyouts all build on this one primitive.
 */
export function Popover({
  anchor,
  open,
  onClose,
  placement = 'bottom-start',
  offset = 4,
  children,
  className,
  style,
  ...props
}: PopoverProps) {
  // callback-ref state so positioning re-runs once the portal content mounts
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<Position | null>(null);
  const [entered, setEntered] = useState(false);

  const update = useCallback(() => {
    const anchorEl = resolveAnchor(anchor);
    if (!node || !anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const [side, align] = placement.split('-') as ['top' | 'bottom', 'start' | 'end'];

    // flip vertically when the preferred side overflows and the other fits
    let resolvedSide = side;
    if (
      side === 'bottom' &&
      rect.bottom + offset + height > window.innerHeight &&
      rect.top - offset - height >= 0
    ) {
      resolvedSide = 'top';
    } else if (
      side === 'top' &&
      rect.top - offset - height < 0 &&
      rect.bottom + offset + height <= window.innerHeight
    ) {
      resolvedSide = 'bottom';
    }

    const top = resolvedSide === 'bottom' ? rect.bottom + offset : rect.top - offset - height;
    const left = align === 'start' ? rect.left : rect.right - width;
    setPos({ top, left, placement: `${resolvedSide}-${align}` as PopoverPlacement });
  }, [node, anchor, placement, offset]);

  // position on open/mount and keep tracking the anchor
  useIsoLayoutEffect(() => {
    if (!open || !node) return;
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, node, update]);

  // run the enter transition one frame after the positioned layer paints
  useEffect(() => {
    if (!open || !node) {
      setEntered(false);
      setPos(null);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [open, node]);

  // outside pointer-down (ignoring the anchor itself) + Escape → onClose
  useEffect(() => {
    if (!open || !onClose) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (node?.contains(target)) return;
      if (resolveAnchor(anchor)?.contains(target)) return;
      onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, node, anchor]);

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={setNode}
        className={cx(
          styles.popover,
          pos?.placement.startsWith('top') && styles.placedTop,
          entered && styles.entered,
          className
        )}
        style={{
          top: pos?.top ?? 0,
          left: pos?.left ?? 0,
          visibility: pos ? undefined : 'hidden',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}

Popover.displayName = 'Popover';
