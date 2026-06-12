/* Lepidus shared primitives — building blocks for overlay components.
   Not themselves design-system components: no Figma node, no stories.
   Consumed by Modal (FocusTrap), Tooltip (Popover), ToastProvider (Portal). */

export { Portal } from './Portal';
export type { PortalProps } from './Portal';

export { VisuallyHidden } from './VisuallyHidden';
export type { VisuallyHiddenProps } from './VisuallyHidden';

export { FocusTrap } from './FocusTrap';
export type { FocusTrapProps } from './FocusTrap';

export { Popover } from './Popover';
export type { PopoverProps, PopoverPlacement } from './Popover';
