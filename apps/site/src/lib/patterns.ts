/**
 * Curated page-level patterns — how Lepidus components compose into real Lepide
 * screens. Each maps to a Storybook story (the live preview) and lists the
 * components it's built from. Story ids match the VRT baselines / Storybook.
 */
export interface Pattern {
  slug: string;
  title: string;
  /** Storybook story id for the live embed + thumbnail baseline */
  story: string;
  height: number;
  /** one-line summary on the index card */
  blurb: string;
  /** what it's for, on the detail page */
  purpose: string;
  /** component display names — must resolve to /components/<slug>/ */
  components: string[];
}

export const patterns: Pattern[] = [
  {
    slug: 'app-shell',
    title: 'App Shell',
    story: 'patterns-app-shell--default',
    height: 560,
    blurb: 'The frame every Lepide screen sits in — sidebar nav, top bar, content region.',
    purpose:
      'The App Shell is the outermost frame of a Lepide product: a collapsible sidebar for primary navigation, a top bar for context and account actions, and the scrollable content region every other pattern drops into. Start here — get the shell right and every screen inherits consistent navigation and spacing.',
    components: ['Sidebar', 'Card', 'Button', 'Toast'],
  },
  {
    slug: 'dashboard',
    title: 'Dashboard',
    story: 'patterns-dashboard--default',
    height: 600,
    blurb: 'An at-a-glance overview — charts, KPIs, and recent activity inside the shell.',
    purpose:
      'A landing surface that answers "what needs my attention?" at a glance: trend charts, headline numbers, and recent activity, arranged in a responsive card grid inside the App Shell. Keep it scannable — lead with the few metrics that drive a decision, link out for the detail.',
    components: ['Sidebar', 'Breadcrumb', 'Charts', 'Dropdown'],
  },
  {
    slug: 'audit-report',
    title: 'Audit Report',
    story: 'patterns-audit-report--default',
    height: 600,
    blurb: 'The security alert workflow — a severity panel over the evidence and actions.',
    purpose:
      'Lepide\'s signature surface: a severity Alert Panel that states the finding in plain language, over the supporting evidence — a folder tree, the change table, and the actions to investigate or resolve. Lead with the verdict and the "what happened," then let the user drill into the evidence.',
    components: ['Sidebar', 'Table', 'FolderTree', 'ActionItem', 'Toggle', 'Pagination', 'Button'],
  },
  {
    slug: 'data-table',
    title: 'Data Table',
    story: 'patterns-data-table--default',
    height: 560,
    blurb: 'A dense records view — status badges, inline progress, and pagination.',
    purpose:
      'The workhorse of any monitoring product: a scannable table of records with status badges, inline progress, and pagination, framed in a card with a clear title and primary action. Keep rows dense but legible, put the most decision-relevant column first, and never paginate away the row count.',
    components: ['Card', 'Badge', 'Progress', 'Pagination', 'Button'],
  },
  {
    slug: 'settings-form',
    title: 'Settings Form',
    story: 'patterns-settings-form--default',
    height: 560,
    blurb: 'A configuration page — labeled fields, validation, and grouped sections.',
    purpose:
      'A configuration surface: labeled fields grouped into sections inside a card, with inline validation and a single primary "Save". Group related settings, write verb-first field labels, and keep the save action visible — never make the user hunt for how to commit a change.',
    components: ['Card', 'Input', 'Textarea', 'Dropdown', 'Stepper', 'Button'],
  },
  {
    slug: 'report-view',
    title: 'Report View',
    story: 'patterns-report-view--default',
    height: 600,
    blurb: 'A read-only report — filters, a date range, the table, and an empty state.',
    purpose:
      'A read-only reporting surface: a filter bar and date range above the results table, with a considered empty state for when a query returns nothing. The empty state matters most — tell the user why there are no results and what to change, never just "No data".',
    components: ['Sidebar', 'Breadcrumb', 'Filter', 'Calendar', 'Table', 'EmptyState', 'Pagination', 'Button'],
  },
  {
    slug: 'team-management',
    title: 'Team Management',
    story: 'patterns-team-management--default',
    height: 520,
    blurb: 'Users and roles — a table with inline role assignment.',
    purpose:
      'Administering people and access: a table of users with inline role dropdowns, so an admin can reassign permissions without leaving the row. Make the current role obvious, confirm destructive changes (removing access), and keep the table sortable by role.',
    components: ['Table', 'Dropdown'],
  },
  {
    slug: 'ddc-modal',
    title: 'Guided Workflow',
    story: 'patterns-ddc-modal--default',
    height: 560,
    blurb: 'A multi-step task in a modal — stepper, fields, and a review.',
    purpose:
      'A focused, multi-step task captured in a modal: a Steps indicator across the top, one decision per step, and a final review before commit. Use it for self-contained workflows (configuring a scan, adding a data source) — show progress, allow back, and summarize before the user confirms.',
    components: ['Breadcrumb', 'Steps', 'Input', 'Table', 'Tag', 'Button'],
  },
];

export const patternBySlug = new Map(patterns.map((p) => [p.slug, p]));

/** display name → component page slug (a few names don't kebab cleanly) */
const COMPONENT_SLUG: Record<string, string> = {
  Charts: 'line-chart',
};
export const componentSlug = (name: string) =>
  COMPONENT_SLUG[name] ??
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
