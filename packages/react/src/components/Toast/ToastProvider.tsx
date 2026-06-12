import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Portal } from '../../primitives';
import { Toast } from './Toast';
import type { ToastVariant } from './Toast.types';
import styles from './ToastProvider.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Options accepted by `toast(...)` from the `useToast()` hook. */
export interface ToastOptions {
  /** Status variant — forwarded to the Toast pill. Default `'info'`. */
  variant?: ToastVariant;
  /** Bold heading line (e.g. "Saved !"). */
  title?: ReactNode;
  /** Supporting message line. */
  message?: ReactNode;
  /** Badge icon — forwarded to the Toast pill (`false` hides, node replaces). */
  icon?: boolean | ReactNode;
  /**
   * Auto-dismiss timeout in ms for this toast. Overrides the provider
   * default (6000). Pass `0` to keep the toast until dismissed manually.
   */
  duration?: number;
}

export interface ToastContextValue {
  /** Enqueue a toast; returns its id (usable with `dismiss`). */
  toast: (options: ToastOptions) => string;
  /** Dismiss a toast by id (runs its exit animation, then removes it). */
  dismiss: (id: string) => void;
}

export interface ToastProviderProps {
  /** Application subtree that gains access to `useToast()`. */
  children?: ReactNode;
  /**
   * Default auto-dismiss timeout in ms (overridable per toast via
   * `toast({ duration })`; `0` persists). Default 6000.
   */
  duration?: number;
  /**
   * Maximum number of toasts visible at once; further toasts queue and
   * surface as earlier ones leave. Default 5.
   */
  max?: number;
}

interface ToastEntry {
  id: string;
  options: ToastOptions;
  exiting: boolean;
}

/** Must match the exit transition length in ToastProvider.module.css. */
const EXIT_MS = 180;

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * useToast — access the imperative toast API from any descendant of
 * `<ToastProvider>`: `const { toast, dismiss } = useToast()`.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
  return ctx;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** One stacked row: owns its auto-dismiss timer (paused while hovered). */
function ToastSlot({
  entry,
  defaultDuration,
  onDismiss,
}: {
  entry: ToastEntry;
  defaultDuration: number;
  onDismiss: () => void;
}) {
  const { variant, title, message, icon, duration } = entry.options;
  const remainingRef = useRef(duration ?? defaultDuration);
  const startedRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);

  const clear = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const resume = useCallback(() => {
    if (remainingRef.current <= 0) return; // duration 0 → persistent
    clear();
    startedRef.current = Date.now();
    timerRef.current = window.setTimeout(onDismiss, remainingRef.current);
  }, [clear, onDismiss]);

  const pause = useCallback(() => {
    if (timerRef.current === undefined) return;
    clear();
    remainingRef.current -= Date.now() - startedRef.current;
  }, [clear]);

  // the timer starts when the toast becomes visible (i.e. leaves the queue)
  useEffect(() => {
    resume();
    return clear;
  }, [resume, clear]);

  return (
    <div
      className={cx(styles.item, entry.exiting && styles.exiting)}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <Toast variant={variant} title={title} icon={icon} onClose={onDismiss}>
        {message}
      </Toast>
    </div>
  );
}

/**
 * ToastProvider — Lepidus Design System
 *
 * App-level manager for the existing `Toast` pill (whose API is unchanged):
 * wrap your app once, then fire notifications imperatively from anywhere via
 * `useToast()`.
 *
 * - Renders a fixed **top-right stack** (gap `space/4`, layer `z/toast`)
 *   through the `Portal` primitive, inside a single polite live region.
 * - **Auto-dismisses** after 6000ms by default (per-toast override; `0`
 *   persists), pausing the countdown while the toast is hovered.
 * - Shows at most **5 toasts** at once (`max`); the rest queue in FIFO order
 *   and surface as earlier ones leave.
 * - Enter/exit animations use the motion tokens and respect
 *   `prefers-reduced-motion: reduce` (exit then removes immediately).
 */
export function ToastProvider({ children, duration = 6000, max = 5 }: ToastProviderProps) {
  const [entries, setEntries] = useState<ToastEntry[]>([]);
  const counterRef = useRef(0);

  const remove = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      if (prefersReducedMotion()) {
        remove(id);
        return;
      }
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id && !entry.exiting ? { ...entry, exiting: true } : entry
        )
      );
      // remove after the exit transition completes (idempotent)
      window.setTimeout(() => remove(id), EXIT_MS);
    },
    [remove]
  );

  const toast = useCallback((options: ToastOptions) => {
    const id = `lepidus-toast-${++counterRef.current}`;
    setEntries((prev) => [...prev, { id, options, exiting: false }]);
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  // first `max` entries are visible; the rest wait in the FIFO queue
  const visible = entries.slice(0, max);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <div
          className={styles.viewport}
          role="region"
          aria-live="polite"
          aria-label="Notifications"
        >
          {visible.map((entry) => (
            <ToastSlot
              key={entry.id}
              entry={entry}
              defaultDuration={duration}
              onDismiss={() => dismiss(entry.id)}
            />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';
