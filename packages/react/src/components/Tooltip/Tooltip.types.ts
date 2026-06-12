import { type ReactElement, type ReactNode } from 'react';
import type { PopoverPlacement } from '../../primitives';

/** Placement of the bubble relative to the trigger (top/bottom × start/end). */
export type TooltipPlacement = PopoverPlacement;

export interface TooltipProps {
  /**
   * The tooltip text. Keep it short and **never interactive** — a tooltip
   * disappears on blur/leave, so links or buttons inside it are unreachable
   * by keyboard and screen readers. Plain text (or text-level markup) only.
   */
  content: ReactNode;
  /**
   * A single focusable/hoverable trigger element. Tooltip clones it
   * (`cloneElement`) to attach hover/focus handlers and `aria-describedby`,
   * merging with any handlers, ref and describedby the child already has —
   * no wrapper element is added.
   */
  children: ReactElement;
  /**
   * Preferred placement; flips to the opposite vertical side automatically
   * when there is not enough viewport space. Default `'bottom-start'`.
   */
  placement?: TooltipPlacement;
  /** Delay in ms before the bubble shows on hover/focus. Default 300. */
  delay?: number;
  /** Gap in px between the trigger and the bubble. Default 4. */
  offset?: number;
  /** id of the bubble (defaults to a generated id) — wired to `aria-describedby`. */
  id?: string;
  /** Extra class on the bubble element. */
  className?: string;
}
