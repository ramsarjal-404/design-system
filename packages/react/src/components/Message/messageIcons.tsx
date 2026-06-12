/* messageIcons.tsx — Lepidus "Alert Message" status glyphs.
   A 45px rounded-square badge filled with `currentColor` (the variant accent,
   set by the parent) holding a white glyph. Matches Figma node 1212:18. */

import type { MessageVariant } from './Message.types';

const Square = ({ children }: { children: React.ReactNode }) => (
  <svg width={45} height={45} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width={45} height={45} rx={11} fill="currentColor" />
    <g stroke="#ffffff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {children}
    </g>
  </svg>
);

/** error / warning → triangle-exclamation (matches the Figma mock). */
const TriangleExclamation = () => (
  <Square>
    <path d="M22.5 13 33 31.5H12L22.5 13Z" />
    <path d="M22.5 21v5" />
    <circle cx={22.5} cy={29.2} r={0.4} fill="#ffffff" stroke="#ffffff" strokeWidth={1.6} />
  </Square>
);

/** success → check. */
const Check = () => (
  <Square>
    <path d="M14 23.5 20 29.5 31 16.5" />
  </Square>
);

/** info → lowercase i. */
const Info = () => (
  <Square>
    <path d="M22.5 21v9" />
    <circle cx={22.5} cy={15.5} r={0.4} fill="#ffffff" stroke="#ffffff" strokeWidth={1.8} />
  </Square>
);

export function StatusGlyph({ variant }: { variant: MessageVariant }) {
  switch (variant) {
    case 'success':
      return <Check />;
    case 'info':
      return <Info />;
    case 'warning':
    case 'error':
    default:
      return <TriangleExclamation />;
  }
}

export const CloseIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);
