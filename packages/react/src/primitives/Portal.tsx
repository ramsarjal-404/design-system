import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  /** Content rendered into the portal target. */
  children: ReactNode;
  /** Portal target element. Defaults to `document.body`. */
  container?: Element | null;
}

/**
 * Portal — Lepidus Design System primitive
 *
 * Renders children into `document.body` (or an explicit `container`) via
 * `createPortal`, so floating layers (Popover, Tooltip, Toast stack) escape
 * any `overflow: hidden` / `transform` ancestor.
 *
 * SSR-safe: nothing is rendered until after the first client effect, so
 * server and first-client render markup always match.
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
}

Portal.displayName = 'Portal';
