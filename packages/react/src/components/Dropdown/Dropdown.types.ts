import { type ReactNode } from 'react';

export interface DropdownOption {
  /** Stable value for the option */
  value: string;
  /** Visible label (defaults to value) */
  label?: ReactNode;
  /** Disable just this option */
  disabled?: boolean;
}

export interface DropdownProps {
  /** Selectable options */
  options: DropdownOption[];
  /** Selected value(s). Array in `multiple` mode, string otherwise (controlled) */
  value?: string | string[];
  /** Initial selection (uncontrolled) */
  defaultValue?: string | string[];
  /** Multi-select with leading checkboxes (Figma "with buttons" / "Without checkbox" toggles this) */
  multiple?: boolean;
  /** Show the Cancel / Apply footer (only meaningful with `multiple`) */
  showButtons?: boolean;
  /** Trigger placeholder when nothing is selected */
  placeholder?: string;
  /** Disabled state — uses component/dropdown/disabled-* tokens */
  disabled?: boolean;
  /** Stretch to fill the container (default fixed 320px from Figma) */
  fullWidth?: boolean;
  /** Fired whenever the selection changes (on click, or on Apply when showButtons) */
  onChange?: (value: string | string[]) => void;
  /** Fired when Apply is pressed (showButtons mode) */
  onApply?: (value: string[]) => void;
  /** Fired when Cancel is pressed (showButtons mode) */
  onCancel?: () => void;
  /** Class applied to the outer wrapper */
  className?: string;
}
