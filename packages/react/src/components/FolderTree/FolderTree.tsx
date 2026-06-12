import { useState } from 'react';
import type { FolderTreeProps } from './FolderTree.types';
import { FolderGlyph, MinusGlyph, PlusGlyph, ReportFileGlyph } from './folderTreeIcons';
import styles from './FolderTree.module.css';

function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * FolderTree — Lepidus Design System
 *
 * Expandable report folders matching the Figma "Report Sidebar" frame (node
 * 186:4535): each row is a brand-blue plus, the yellow folder and a 16px
 * label; clicking the row (or its plus) flips the plus to a minus and reveals
 * the folder's reports underneath, each with the scroll/file icon from the
 * Figma "Inside menu" variant. Expansion works uncontrolled
 * (defaultExpandedIds) or controlled (expandedIds + onExpandedChange);
 * `filter` hides non-matching folders/reports and auto-expands folders with
 * matching reports.
 */
export function FolderTree({
  folders,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  selectedItemId,
  onItemSelect,
  filter,
  className,
  ...props
}: FolderTreeProps) {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpandedIds);
  const expanded = expandedIds ?? internalExpanded;

  const toggle = (folderId: string) => {
    const next = expanded.includes(folderId)
      ? expanded.filter((id) => id !== folderId)
      : [...expanded, folderId];
    if (expandedIds === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const query = filter?.trim().toLowerCase() ?? '';
  const visible = folders
    .map((folder) => {
      if (!query) return { folder, items: folder.items, forceExpanded: false };
      const folderMatches = folder.label.toLowerCase().includes(query);
      const items = folder.items.filter((item) => item.label.toLowerCase().includes(query));
      if (!folderMatches && items.length === 0) return null;
      return {
        folder,
        items: items.length > 0 ? items : folder.items,
        forceExpanded: items.length > 0,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return (
    <div className={cx(styles.tree, className)} {...props}>
      <ul className={styles.folderList}>
        {visible.map(({ folder, items, forceExpanded }) => {
          const isExpanded = forceExpanded || expanded.includes(folder.id);
          return (
            <li key={folder.id}>
              <button
                type="button"
                className={styles.folderRow}
                aria-expanded={isExpanded}
                onClick={() => toggle(folder.id)}
              >
                <span className={styles.toggleGlyph}>
                  {isExpanded ? <MinusGlyph /> : <PlusGlyph />}
                </span>
                <span className={styles.folderGlyph}>
                  <FolderGlyph />
                </span>
                <span className={styles.folderLabel}>{folder.label}</span>
              </button>

              {isExpanded && items.length > 0 && (
                <ul className={styles.itemList}>
                  {items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={cx(styles.itemRow, item.id === selectedItemId && styles.itemSelected)}
                        aria-current={item.id === selectedItemId || undefined}
                        onClick={() => onItemSelect?.(item.id, folder.id)}
                      >
                        <span className={styles.itemGlyph}>{item.icon ?? <ReportFileGlyph />}</span>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {isExpanded && items.length === 0 && (
                <p className={styles.emptyFolder}>No reports in this folder</p>
              )}
            </li>
          );
        })}
      </ul>

      {query && visible.length === 0 && (
        <p className={styles.emptyFolder}>No folders or reports match "{filter}"</p>
      )}
    </div>
  );
}

FolderTree.displayName = 'FolderTree';
