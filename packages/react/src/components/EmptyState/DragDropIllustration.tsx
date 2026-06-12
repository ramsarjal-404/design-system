import { type ImgHTMLAttributes } from 'react';
import dragDropSrc from './assets/drag-and-drop.png';

export interface DragDropIllustrationProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Rendered height in px (default 212, the source size; width keeps the 237:212 ratio) */
  size?: number;
}

/**
 * Drag-and-drop illustration from the Figma "Drag-and-Drop" frame (node
 * 631:3498) — a hand dragging a card toward a dashed drop target. Unlike the
 * other empty-state illustrations this one is a raster in Figma (237×212
 * PNG), so it ships as an image asset; avoid rendering it above its native
 * size or it will soften. Decorative (aria-hidden) — the EmptyState message
 * carries the meaning.
 */
export const DragDropIllustration = ({ size = 212, ...props }: DragDropIllustrationProps) => (
  <img
    src={dragDropSrc}
    alt=""
    aria-hidden="true"
    width={(size * 237) / 212}
    height={size}
    {...props}
  />
);
