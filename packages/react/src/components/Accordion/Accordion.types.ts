import { type HTMLAttributes, type ReactNode } from 'react';

export interface AccordionItem {
  /** Unique id for the item — used in `value`/`defaultValue` and the generated DOM ids. */
  id: string;
  /** Trigger label, rendered inside the heading button. */
  title: ReactNode;
  /** Panel content revealed when the item is expanded. */
  content: ReactNode;
  /** Disables the trigger — the item can't be toggled or focused. */
  disabled?: boolean;
}

export type AccordionMode = 'single' | 'multiple';
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Items to render, in order. */
  items: AccordionItem[];
  /**
   * Expand mode — `single` (default) keeps at most one item open and closes the
   * previous one; `multiple` lets any number of items stay open independently.
   */
  mode?: AccordionMode;
  /**
   * Controlled list of open item ids. Pair with `onValueChange`; in `single`
   * mode the array holds at most one id.
   */
  value?: string[];
  /** Uncontrolled initial open item ids. */
  defaultValue?: string[];
  /** Called with the next open-id array whenever a trigger is toggled. */
  onValueChange?: (value: string[]) => void;
  /**
   * Heading level (2–6) wrapping each trigger button, so the accordion slots
   * into the page outline. Defaults to 3.
   */
  headingLevel?: AccordionHeadingLevel;
  /** Prefix for the generated trigger/panel ids (must be unique per page). */
  idPrefix?: string;
}
