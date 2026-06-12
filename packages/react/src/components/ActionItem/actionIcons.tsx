/* actionIcons.tsx — Lepidus "Action Item" toolbar glyphs.
   24px icons matching Figma node 813:4213 (delete / upload / edit / share).
   All strokes/fills use currentColor so the button controls tone
   (brand blue or danger red) via the CSS token bound on the parent. */

export const DeleteIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 7h16M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7m3 0-.7 11.1A2 2 0 0 1 14.8 20H9.2a2 2 0 0 1-2-1.9L6.5 7"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 10.5v5M14 10.5v5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const UploadIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 15V4m0 0L8 8m4-4 4 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 14v3.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V14" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EditIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 16.5 15 5.5a2.12 2.12 0 0 1 3 3L7 19.5l-4 1 1-4Z"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m13 7.5 3 3" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShareIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx={6} cy={12} r={2.4} stroke="currentColor" strokeWidth={1.6} />
    <circle cx={17.5} cy={6} r={2.4} stroke="currentColor" strokeWidth={1.6} />
    <circle cx={17.5} cy={18} r={2.4} stroke="currentColor" strokeWidth={1.6} />
    <path d="m8.1 10.9 7.3-3.8M8.1 13.1l7.3 3.8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);
