import { forwardRef, useRef, useState } from 'react';
import type { ElementType, KeyboardEvent } from 'react';
import type { AccordionProps } from './Accordion.types';
import styles from './Accordion.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function ChevronIcon() {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3.5 6 4.5 4.5L12.5 6" />
    </svg>
  );
}

/**
 * Accordion — Lepidus Design System
 *
 * Vertically stacked disclosure list following the WAI-ARIA accordion
 * pattern: each trigger is a real `<button aria-expanded aria-controls>`
 * inside a heading (`headingLevel`, default h3); panels are labelled
 * `role="region"` landmarks. `single` mode (default) keeps one item open,
 * `multiple` any number. Controlled via `value`/`onValueChange` or
 * uncontrolled via `defaultValue`. Enter/Space toggle (native button);
 * ArrowUp/ArrowDown/Home/End move focus between triggers. Panel height
 * animates via the grid-template-rows 0fr→1fr trick (instant under
 * prefers-reduced-motion).
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      mode = 'single',
      value,
      defaultValue,
      onValueChange,
      headingLevel = 3,
      idPrefix = 'lds-accordion',
      className,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
    const open = value ?? internalValue;
    const listRef = useRef<HTMLDivElement | null>(null);
    const Heading = `h${headingLevel}` as ElementType;

    const setOpen = (next: string[]) => {
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    };

    const toggle = (id: string) => {
      const isOpen = open.includes(id);
      if (mode === 'single') {
        setOpen(isOpen ? [] : [id]);
      } else {
        setOpen(isOpen ? open.filter((v) => v !== id) : [...open, id]);
      }
    };

    // Roving focus across enabled triggers: Up/Down/Home/End.
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      const root = listRef.current;
      if (!root) return;
      const triggers = Array.from(
        root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]:not(:disabled)')
      );
      const current = triggers.indexOf(document.activeElement as HTMLButtonElement);
      if (current === -1 || triggers.length === 0) return;

      event.preventDefault();
      let next = current;
      if (event.key === 'ArrowDown') next = (current + 1) % triggers.length;
      else if (event.key === 'ArrowUp') next = (current - 1 + triggers.length) % triggers.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = triggers.length - 1;
      triggers[next]?.focus();
    };

    return (
      <div
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cx(styles.accordion, className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {items.map((item) => {
          const isOpen = open.includes(item.id);
          const triggerId = `${idPrefix}-trigger-${item.id}`;
          const panelId = `${idPrefix}-panel-${item.id}`;
          return (
            <div key={item.id} className={styles.item}>
              <Heading className={styles.heading}>
                <button
                  type="button"
                  data-accordion-trigger
                  id={triggerId}
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  onClick={() => toggle(item.id)}
                >
                  <span className={styles.title}>{item.title}</span>
                  <ChevronIcon />
                </button>
              </Heading>
              <div
                role="region"
                id={panelId}
                aria-labelledby={triggerId}
                className={cx(styles.panel, isOpen && styles.open)}
              >
                <div className={styles.panelInner}>
                  <div className={styles.panelContent}>{item.content}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
