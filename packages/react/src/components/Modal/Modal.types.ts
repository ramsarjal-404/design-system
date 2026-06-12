import { type HTMLAttributes, type ReactNode } from 'react';
import type { InputProps } from '../Input/Input.types';

export type ModalSize = 'sm' | 'md' | 'lg';
export type ModalHeaderAlign = 'center' | 'left';

/** One input row in a Modal body — every Input prop is supported. */
export interface ModalField extends InputProps {
  /** Stable key for the field list. */
  key?: string;
}

export interface ModalAction {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visibility — when false the modal renders nothing. Default true. */
  open?: boolean;
  /** Header title (brand-colored bar). Omit to hide the header. */
  title?: ReactNode;
  /** Title alignment — `center` (Figma default) or `left`. */
  headerAlign?: ModalHeaderAlign;
  /** Width preset — sm (520) · md (680) · lg (743, Figma). Default md. */
  size?: ModalSize;
  /** Render the dimmed backdrop + center on screen. Set false to embed inline. Default true. */
  overlay?: boolean;
  /** Close handler — fired by the backdrop, Esc and the secondary/Cancel action. */
  onClose?: () => void;
  /** Close when the backdrop is clicked. Default true. */
  closeOnOverlayClick?: boolean;
  /** Close on the Escape key. Default true. */
  closeOnEsc?: boolean;
  /** Declarative list of inputs rendered in the body (supports multiple). */
  fields?: ModalField[];
  /** Custom body content — rendered after any `fields`. */
  children?: ReactNode;
  /** Primary (filled) footer action. */
  primaryAction?: ModalAction;
  /** Secondary (outline) footer action — defaults to firing `onClose`. */
  secondaryAction?: ModalAction;
}
