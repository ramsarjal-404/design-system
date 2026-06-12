import { type HTMLAttributes, type ReactNode } from 'react';

/** A report (or any leaf) shown underneath its folder when expanded. */
export interface FolderTreeItem {
  id: string;
  label: string;
  /** Replace the default report/file icon for this item */
  icon?: ReactNode;
}

export interface FolderTreeFolder {
  id: string;
  label: string;
  /** Reports revealed underneath the folder when the plus is clicked */
  items: FolderTreeItem[];
}

export interface FolderTreeProps extends HTMLAttributes<HTMLDivElement> {
  folders: FolderTreeFolder[];
  /** Controlled expanded folder ids */
  expandedIds?: string[];
  /** Uncontrolled initial expanded folder ids */
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Highlight one item as active */
  selectedItemId?: string;
  onItemSelect?: (itemId: string, folderId: string) => void;
  /** Filter text — hides non-matching folders/items and auto-expands folders with matching reports */
  filter?: string;
}
