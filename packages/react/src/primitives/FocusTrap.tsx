import {
  cloneElement,
  useEffect,
  useRef,
  type ClassAttributes,
  type MutableRefObject,
  type ReactElement,
  type Ref,
} from 'react';

/** Selector for everything the trap treats as focusable (extracted from Modal). */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface FocusTrapProps {
  /**
   * Whether the trap is engaged. While `true`, focus moves into the child on
   * mount and Tab / Shift+Tab cycle within it. Default `true`.
   */
  active?: boolean;
  /**
   * Restore focus to the element that was focused before the trap engaged
   * when the trap deactivates/unmounts. Default `true`.
   */
  restoreFocus?: boolean;
  /**
   * A single element child that serves as the trap container. FocusTrap
   * attaches via the child's ref (no wrapper element is added to the DOM),
   * merging with any ref the child already carries.
   */
  children: ReactElement;
}

function assignRef(ref: Ref<HTMLElement> | undefined, node: HTMLElement | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref && typeof ref === 'object') {
    (ref as MutableRefObject<HTMLElement | null>).current = node;
  }
}

/**
 * FocusTrap — Lepidus Design System primitive
 *
 * Keeps keyboard focus inside its single element child while `active`
 * (extracted from the Modal's inline focus management so any overlay surface
 * can reuse it):
 *
 * - on activation, focus moves to the first focusable descendant — or to the
 *   container itself (give it `tabIndex={-1}`) when it has none;
 * - Tab on the last focusable element wraps to the first, Shift+Tab on the
 *   first wraps to the last;
 * - on deactivation/unmount, focus returns to the previously focused element
 *   (`restoreFocus`).
 *
 * Attaches through the child's ref via `cloneElement`, so it adds no extra
 * DOM node and preserves the child's own ref.
 */
export function FocusTrap({ active = true, restoreFocus = true, children }: FocusTrapProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const previous =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = containerRef.current;
    (container?.querySelector<HTMLElement>(FOCUSABLE) ?? container)?.focus();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;
      const nodes = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (nodes.length === 0) {
        e.preventDefault();
        containerRef.current.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const focused = document.activeElement;
      if (e.shiftKey && (focused === first || focused === containerRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && focused === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onTab, true);
    return () => {
      document.removeEventListener('keydown', onTab, true);
      if (restoreFocus) previous?.focus();
    };
  }, [active, restoreFocus]);

  const childRef = (children as ReactElement & { ref?: Ref<HTMLElement> }).ref;
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      containerRef.current = node;
      assignRef(childRef, node);
    },
  } as ClassAttributes<HTMLElement>);
}

FocusTrap.displayName = 'FocusTrap';
