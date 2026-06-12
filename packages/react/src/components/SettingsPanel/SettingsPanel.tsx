import { useState } from 'react';
import type { SettingsPanelProps } from './SettingsPanel.types';
import styles from './SettingsPanel.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * SettingsPanel — Lepidus Design System
 *
 * Settings category menu matching the Figma "side bar pannel" frame (node
 * 797:3469): a bordered surface with a 20px rounded top-left corner, a bold
 * "Categories" heading on a divider, and category rows of a 30px icon plus
 * body-lg label. Selection works uncontrolled (defaultSelectedId) or
 * controlled (selectedId + onSelect); the active row gets the brand-light
 * treatment shared with FolderTree.
 */
export function SettingsPanel({
  title = 'Categories',
  items,
  selectedId,
  defaultSelectedId,
  onSelect,
  className,
  ...props
}: SettingsPanelProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelectedId);
  const selected = selectedId ?? internalSelected;

  const select = (id: string) => {
    if (selectedId === undefined) setInternalSelected(id);
    onSelect?.(id);
  };

  return (
    <div className={cx(styles.panel, className)} {...props}>
      <div className={styles.heading}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <ul className={styles.list}>
        {items.map((item) => {
          const isSelected = item.id === selected;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={cx(styles.item, isSelected && styles.selected)}
                aria-current={isSelected || undefined}
                onClick={() => select(item.id)}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

SettingsPanel.displayName = 'SettingsPanel';
