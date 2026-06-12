import { type HTMLAttributes, type ReactNode } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional title rendered with the component/card/title-text token */
  title?: ReactNode;
  /** Optional actions shown on the right of the title row (e.g. a Button or Badge) */
  actions?: ReactNode;
  /** Optional footer row */
  footer?: ReactNode;
  /** Raise the card with the shadow-card tokens */
  elevated?: boolean;
  /** Hide the 1px border (useful when elevated) */
  borderless?: boolean;
  /** Card body */
  children?: ReactNode;
}
