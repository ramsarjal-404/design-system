import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ClassAttributes,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type MutableRefObject,
  type ReactElement,
  type Ref,
  type SyntheticEvent,
} from 'react';
import { Popover } from '../../primitives';
import type { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function assignRef(ref: Ref<HTMLElement> | undefined, node: HTMLElement | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref && typeof ref === 'object') {
    (ref as MutableRefObject<HTMLElement | null>).current = node;
  }
}

type Handler<E extends SyntheticEvent> = (event: E) => void;

function compose<E extends SyntheticEvent>(
  theirs: Handler<E> | undefined,
  ours: Handler<E>
): Handler<E> {
  return (event) => {
    theirs?.(event);
    ours(event);
  };
}

/**
 * Tooltip — Lepidus Design System
 *
 * Short text label describing a control, shown on hover **and** keyboard
 * focus after a 300ms delay (cancelled on leave/blur/Escape). Positioned by
 * the shared **Popover** primitive (viewport-aware, flips vertically) on an
 * inverted surface: `color/text/primary` background with `color/text/inverse`
 * text, so it adapts per theme.
 *
 * The single child is cloned (`cloneElement`) to attach the hover/focus
 * handlers and `aria-describedby` pointing at the `role="tooltip"` bubble —
 * existing handlers, ref and describedby on the child are preserved.
 *
 * A tooltip is supplementary description only: it must **never contain
 * interactive content** (links, buttons) and must never be the only place a
 * control's name lives — icon-only triggers still need their own
 * `aria-label`.
 */
export function Tooltip({
  content,
  children,
  placement = 'bottom-start',
  delay = 300,
  offset = 4,
  id,
  className,
}: TooltipProps) {
  const autoId = useId();
  const tooltipId = id ?? `lepidus-tooltip-${autoId}`;
  const [visible, setVisible] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const cancelTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const show = useCallback(() => {
    cancelTimer();
    timerRef.current = window.setTimeout(() => setVisible(true), delay);
  }, [cancelTimer, delay]);

  const hide = useCallback(() => {
    cancelTimer();
    setVisible(false);
  }, [cancelTimer]);

  useEffect(() => cancelTimer, [cancelTimer]);

  const childProps = children.props as {
    onMouseEnter?: Handler<MouseEvent>;
    onMouseLeave?: Handler<MouseEvent>;
    onFocus?: Handler<FocusEvent>;
    onBlur?: Handler<FocusEvent>;
    onKeyDown?: Handler<KeyboardEvent>;
    'aria-describedby'?: string;
  };
  const childRef = (children as ReactElement & { ref?: Ref<HTMLElement> }).ref;

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      assignRef(childRef, node);
    },
    onMouseEnter: compose(childProps.onMouseEnter, show),
    onMouseLeave: compose(childProps.onMouseLeave, hide),
    onFocus: compose(childProps.onFocus, show),
    onBlur: compose(childProps.onBlur, hide),
    onKeyDown: compose(childProps.onKeyDown, (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    }),
    'aria-describedby': visible
      ? cx(childProps['aria-describedby'], tooltipId)
      : childProps['aria-describedby'],
  } as ClassAttributes<HTMLElement>);

  return (
    <>
      {trigger}
      <Popover
        anchor={anchorRef}
        open={visible}
        onClose={hide}
        placement={placement}
        offset={offset}
        role="tooltip"
        id={tooltipId}
        className={cx(styles.tooltip, className)}
      >
        {content}
      </Popover>
    </>
  );
}

Tooltip.displayName = 'Tooltip';
