import {
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'size'> {
  /** The value this option submits / reports when selected. */
  value?: string;
  /** Controlled selected state. Inside a `RadioGroup` this is wired for you. */
  checked?: boolean;
  /** Uncontrolled initial state (default false). */
  defaultChecked?: boolean;
  /**
   * Called when the user selects this option. Receives the option's `value`
   * and the raw change event.
   */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Radio group name — shared by every option in the group. `RadioGroup` sets it. */
  name?: string;
  /** Disabled state — gray circle and label, interaction blocked. */
  disabled?: boolean;
  /**
   * Visible label rendered inside a real `<label>` wrapper, so clicking the
   * text selects the option. Without it, name the control with `aria-label`.
   */
  label?: ReactNode;
  /** Error state — the circle border uses the status-error token. */
  error?: boolean;
  /** Extra class on the root `<label>` wrapper. */
  className?: string;
}

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Shared `name` applied to every `Radio` inside, wiring native arrow-key behavior. */
  name: string;
  /** Controlled selected value. Pair with `onChange`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the newly selected option's value. */
  onChange?: (value: string) => void;
  /** Visible group label, rendered above the options and wired via `aria-labelledby`. */
  label?: ReactNode;
  /** Stacking direction of the options (default vertical). */
  orientation?: RadioGroupOrientation;
  /** Disables every option in the group. */
  disabled?: boolean;
  /** `Radio` options (other nodes are allowed and rendered as-is). */
  children: ReactNode;
}
