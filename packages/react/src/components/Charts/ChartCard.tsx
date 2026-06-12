import { forwardRef } from 'react';
import type { ChartCardProps } from './Charts.types';
import styles from './Charts.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * ChartCard — Lepidus Design System
 *
 * Surface for every chart, matching the Figma chart frame (node 760:1291):
 * 25px-radius white card with a header row of brand-blue title, optional
 * "Last Updated" stamp and an actions slot for icon controls. Capped at the
 * frame's 1160px width by default — set `fullWidth` to fill the container.
 */
export const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, lastUpdated, actions, fullWidth = false, headingLevel = 'h3', children, className, ...props }, ref) => {
    const Heading = headingLevel;
    return (
    <div
      ref={ref}
      className={cx(styles.card, fullWidth && styles.fullWidthCard, className)}
      {...props}
    >
      <div className={styles.cardHeader}>
        <Heading className={styles.cardTitle}>{title}</Heading>
        {lastUpdated && <span className={styles.cardUpdated}>{lastUpdated}</span>}
        {actions && <div className={styles.cardActions}>{actions}</div>}
      </div>
      {children}
    </div>
    );
  }
);

ChartCard.displayName = 'ChartCard';
