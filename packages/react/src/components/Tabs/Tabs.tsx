import { useRef, useState, type KeyboardEvent } from 'react';
import type { TabsProps } from './Tabs.types';
import styles from './Tabs.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Tabs — Lepidus Design System
 *
 * Pill tabs matching the Figma "Tabs-Style1" component (node 643:6378): the
 * active tab is a brand pill (component/tabs/active-indicator, 50px radius)
 * with white text; the rest are semibold brand-blue labels. Implements the
 * ARIA tabs pattern — role="tablist"/"tab", aria-selected, roving tabindex
 * and Arrow/Home/End keyboard navigation. Pair each panel with
 * role="tabpanel" and id={`${idPrefix}-panel-${tab.id}`}.
 */
export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  idPrefix = 'lds-tabs',
  hasPanels = false,
  className,
  ...props
}: TabsProps) {
  const firstEnabled = tabs.find((t) => !t.disabled)?.id;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const active = value ?? internalValue;
  const listRef = useRef<HTMLDivElement>(null);

  const select = (id: string) => {
    if (value === undefined) setInternalValue(id);
    onChange?.(id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = tabs.filter((t) => !t.disabled);
    const currentIndex = enabled.findIndex((t) => t.id === active);
    let next: string | undefined;

    if (event.key === 'ArrowRight') next = enabled[(currentIndex + 1) % enabled.length]?.id;
    else if (event.key === 'ArrowLeft')
      next = enabled[(currentIndex - 1 + enabled.length) % enabled.length]?.id;
    else if (event.key === 'Home') next = enabled[0]?.id;
    else if (event.key === 'End') next = enabled[enabled.length - 1]?.id;
    if (!next) return;

    event.preventDefault();
    select(next);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#${idPrefix}-tab-${CSS.escape(next)}`)
      ?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cx(styles.tabs, className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={hasPanels ? `${idPrefix}-panel-${tab.id}` : undefined}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            className={cx(styles.tab, isActive && styles.active)}
            onClick={() => select(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

Tabs.displayName = 'Tabs';
