import { forwardRef } from 'react';
import type { ActionItemAction, ActionItemProps } from './ActionItem.types';
import { DeleteIcon, UploadIcon, EditIcon, ShareIcon } from './actionIcons';
import styles from './ActionItem.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** The Figma "Action Item" default set: delete (danger) · upload · edit · share. */
export const defaultActions: ActionItemAction[] = [
  { id: 'delete', label: 'Delete', icon: <DeleteIcon />, tone: 'danger' },
  { id: 'upload', label: 'Upload', icon: <UploadIcon /> },
  { id: 'edit', label: 'Edit', icon: <EditIcon /> },
  { id: 'share', label: 'Share', icon: <ShareIcon /> },
];

/**
 * ActionItem — Lepidus Design System
 *
 * Floating icon-action toolbar (Figma node 813:4213). A white surface with
 * `--shadow-low` elevation holding a row of 24px icon buttons.
 *
 * Token bindings (see ActionItem.module.css):
 *   surface → color/background/surface · gap → space/11 · padding → space/17·space/2
 *   radius  → radius/s · shadow → shadow/low · glyph tone → color/text/{brand,danger}
 */
export const ActionItem = forwardRef<HTMLDivElement, ActionItemProps>(
  ({ actions = defaultActions, className, 'aria-label': ariaLabel = 'Item actions', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="toolbar"
        aria-label={ariaLabel}
        className={cx(styles.toolbar, className)}
        {...props}
      >
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={cx(styles.action, styles[action.tone ?? 'brand'])}
            aria-label={action.label}
            title={action.label}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  }
);

ActionItem.displayName = 'ActionItem';
