/* calendarIcons.tsx — Lepidus Calendar/Schedule glyphs. currentColor-driven. */

export const CalendarGlyph = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x={3} y={5} width={18} height={16} rx={2.5} stroke="currentColor" strokeWidth={1.8} />
    <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    <rect x={6.5} y={12} width={3} height={3} rx={0.6} fill="currentColor" />
  </svg>
);

export const ChevronDown = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClockGlyph = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.8} />
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
