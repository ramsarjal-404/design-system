/**
 * ai-drift.mjs — mistakes observed when real assistants built UI from the
 * contract. Shared by build-design-md.mjs and build-llms-full.mjs so each
 * component's contract carries its own warnings (large files are *searched*
 * by chat tools, not read — a global list at the end is never retrieved).
 *
 * `components` are doc slugs; `check` is the one-line hard-fail wording,
 * `why` the observed consequence. The validator (scripts/validate-lp-html.mjs)
 * fails every one of these.
 */
export const DRIFT = [
  {
    components: ['dropdown'],
    check: 'The list element is `lp-dropdown__list` — never `lp-dropdown__options` or any other name.',
    why: 'an invented class is unstyled; the listbox collapsed into bare buttons.',
  },
  {
    components: ['dropdown'],
    check: 'Every option wraps its text in `<span class="lp-dropdown__option-label">`; the open-panel header contains `lp-dropdown__header-label` and the `--open` chevron.',
    why: '`lepidus.js` copies the option label into the trigger — without the span the trigger never updates after a pick.',
  },
  {
    components: ['dropdown', 'input', 'text-field'],
    check: 'No native `<select>` anywhere on the page — a theme switcher, a page-size control or a filter are all `lp-dropdown` (`data-lp-dropdown="single"`). Adding `class="lp-input"` to a `<select>` does not make it on-system.',
    why: 'three consecutive runs shipped a `<select>` for the theme control.',
  },
  {
    components: ['modal'],
    check: 'Every `lp-modal` on a real page carries `hidden` and is opened by `data-lp-modal-open="<id>"` or `Lepidus.openModal(id)`. Never place an un-hidden modal in a page.',
    why: 'a copied example without `hidden` is a fixed overlay that covers the whole screen on load.',
  },
  {
    components: ['input'],
    check: 'Exactly one label per field: `lp-input__label` inside `lp-input__row--label-left|top`. No external `<label for>` next to the component.',
    why: 'two runs rendered two captions ("Configuration name" and "Name") for one field.',
  },
  {
    components: ['input', 'text-field', 'textarea'],
    check: 'Do not wrap the component in a custom `.field` block that re-implements the label, help and error rows — Input already has `lp-input__message` (+ `--error`, `--indent`) for helper and error text.',
    why: 'custom wrappers drift from token spacing and skip `aria-describedby` wiring.',
  },
  {
    components: ['dropdown', 'accordion', 'stepper', 'tabs', 'modal'],
    check: 'Do not write click/keyboard handlers for `.lp-dropdown__trigger`, `.lp-dropdown__option`, `.lp-accordion__trigger`, `.lp-stepper__control`, `.lp-tabs__tab` or `[data-lp-modal-open]` — `lepidus.js` already owns open/close, selection, ARIA sync and Escape. Listen to `lp-dropdown-change` on the wrapper (or `change` on the stepper input) to read values.',
    why: 'a composed form added its own dropdown controller; both handlers fired per click and the panel toggled closed again — the dropdown never opened.',
  },
  {
    components: ['input', 'dropdown', 'stepper', 'textarea', 'text-field', 'radio', 'modal', 'button'],
    check: 'Page CSS never targets `.lp-*` selectors — no `.lp-dropdown { width: 100% }`, no `.lp-stepper { max-width }`, no `.footer-actions .lp-button { flex: 1 }`, no media-query overrides of `.lp-input__row--label-left`. The width you want already exists as a modifier: `lp-dropdown--full-width`, `lp-stepper--full-width`, `lp-input--full-width`, `lp-textarea--full-width`, `lp-text-field--full-width`, `lp-button--full-width`. For narrow containers choose `lp-input__row--label-top` instead of overriding `--label-left`.',
    why: 'a composed form shipped 8 such rules; they bypass the token geometry and drift from Storybook in every theme.',
  },
  {
    components: ['card', 'input', 'button'],
    check: 'Only use token names that exist: surfaces are `--color-background-{page|surface|raised|subtle|cards}`, borders `--color-border-{default|strong|brand|danger}`. Never guess a name and add a hex fallback — `var(--color-border-primary, #dce3ed)` is a hardcoded color with extra steps.',
    why: 'three invented tokens with hex fallbacks rendered off-system colors that do not re-theme in dark or hc.',
  },
  {
    components: ['message'],
    check: 'Anatomy is `__icon` + `__content` > `__text` > `__title` / `__body` (+ `__actions`, `__close`) — never bare text directly inside `lp-message__content`.',
    why: 'bare text loses the title/body typography and the icon column.',
  },
];

export const driftFor = (slug) => DRIFT.filter((d) => d.components.includes(slug));

export const driftMarkdown = () =>
  DRIFT.map((d, i) => `${i + 1}. **${d.check}** — observed: ${d.why}`).join('\n');
