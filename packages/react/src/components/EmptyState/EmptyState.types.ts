import { type HTMLAttributes, type ReactNode } from 'react';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** The statement under the illustration (e.g. "Sorry, No exported file to download!") */
  message: ReactNode;
  /** Replace the default sleeping-server illustration */
  illustration?: ReactNode;
  /** Illustration width/height in px when using the default art (default 221) */
  illustrationSize?: number;
  /** Optional call-to-action under the message (e.g. a Button) */
  action?: ReactNode;
}
