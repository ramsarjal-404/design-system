import { type HTMLAttributes, type ReactNode } from 'react';

/** Tone of a single action glyph.
 *  - `brand`  → component icon foreground (color/text/brand, #1c4599)
 *  - `danger` → destructive action (color/text/danger), e.g. delete */
export type ActionTone = 'brand' | 'danger';

export interface ActionItemAction {
  /** Stable id for React keys / event handling */
  id: string;
  /** Accessible label — used for aria-label and the native tooltip */
  label: string;
  /** 24px glyph (use currentColor so tone controls the fill) */
  icon: ReactNode;
  /** Visual tone — defaults to `brand` */
  tone?: ActionTone;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

export interface ActionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Ordered list of icon actions. Defaults to delete / upload / edit / share
   *  (the Figma "Action Item" set). */
  actions?: ActionItemAction[];
  /** Accessible label for the toolbar group */
  'aria-label'?: string;
}
