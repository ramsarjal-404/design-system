/* Component-local icons for FolderTree, traced from the Figma "Report Sidebar"
   frame (node 186:4535). Plus/minus and the report scroll are monochrome
   (currentColor); the folder keeps its illustrative #FFCA28 yellow, which has
   no token by design. */

export const PlusGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 1v14M1 8h14" />
  </svg>
);

export const MinusGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 8h14" />
  </svg>
);

export const FolderGlyph = () => (
  <svg viewBox="0 0 32.5 29.1667" aria-hidden="true">
    <path
      fill="#FFCA28"
      d="M4.58333 0C3.36776 0 2.20197 0.482885 1.34243 1.34243C0.482886 2.20197 0 3.36776 0 4.58333V24.5833C0 25.7989 0.482886 26.9647 1.34243 27.8242C2.20197 28.6838 3.36776 29.1667 4.58333 29.1667H27.9167C29.1322 29.1667 30.298 28.6838 31.1576 27.8242C32.0171 26.9647 32.5 25.7989 32.5 24.5833V9.58333C32.5 8.36776 32.0171 7.20197 31.1576 6.34243C30.298 5.48289 29.1322 5 27.9167 5H15.6833C15.1765 4.99991 14.687 4.81503 14.3067 4.48L10.52 1.14333C9.68321 0.406583 8.60657 0.000102078 7.49167 0H4.58333Z"
    />
  </svg>
);

/* Document/file icon from the Lepidus icon set (icons/svg/Report.svg),
   retraced with currentColor so it follows the row's text color. */
export const ReportFileGlyph = () => (
  <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.5 3.75V8.75C17.5 9.08152 17.6317 9.39946 17.8661 9.63388C18.1005 9.8683 18.4185 10 18.75 10H23.75M23.75 10L17.5 3.75H8.75C8.08696 3.75 7.45107 4.01339 6.98223 4.48223C6.51339 4.95107 6.25 5.58696 6.25 6.25V23.75C6.25 24.413 6.51339 25.0489 6.98223 25.5178C7.45107 25.9866 8.08696 26.25 8.75 26.25H21.25C21.913 26.25 22.5489 25.9866 23.0178 25.5178C23.4866 25.0489 23.75 24.413 23.75 23.75V10ZM11.25 21.25H18.75M11.25 16.25H18.75" />
  </svg>
);
