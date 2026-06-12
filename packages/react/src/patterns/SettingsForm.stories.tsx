import { useState, type CSSProperties, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Textarea } from '../components/Textarea';
import { Stepper } from '../components/Stepper';
import { Button } from '../components/Button';

const patternDescription = `
A realistic settings card composed entirely from existing Lepidus components — no new primitives.

## Overview

The Settings Form pattern shows how the form family (**Input**, **Dropdown**, **Textarea**,
**Stepper**) sits inside a **Card** with a **Button** footer to make a complete, working settings
panel. Every field is controlled with \`useState\`, the Cancel button resets the draft, and Save
echoes the captured values — so the story demonstrates real wiring, not just visual layout.

Fields share a single label treatment: \`Input\` renders its own label
(\`labelPosition="left"\`, 171px column, \`component/input/label\` → #555766), and the Dropdown /
Textarea / Stepper rows reuse the identical label styling through a small \`FieldRow\` helper so
the left rail of labels stays perfectly aligned.

## Composition

- **Card** — surface, title row ("Workspace Settings") and \`footer\` slot for the actions.
- **Input** — workspace name + notification email, inline labels, helper and error text.
- **Dropdown** — single-select timezone picker.
- **Textarea** — free-form description, labelled consistently with the Inputs.
- **Stepper** — numeric "Retention period (days)" setting, clamped 1–365.
- **Button** — \`secondary\` Cancel + \`primary\` Save in the Card footer.

## Design tokens

| Part | Token | Note |
| --- | --- | --- |
| Field labels | \`--component-input-label\` | #555766 — shared by Input and the FieldRow helper |
| Section gap | inline \`gap: 20\` | space-9 scale step used between rows |
| Footer gap | inline \`gap: 16\` | space-8 scale step between the two buttons |
| Helper text | \`--color-text-secondary\` | secondary gray for the saved-values echo |
| Card surface | \`--component-card-bg\` / \`--component-card-border\` | via the Card component |

## Usage

- **Do** keep all field labels in the shared 171px left column so the form scans as one unit.
- **Do** wire Cancel to restore the last saved snapshot, not to clear the form.
- **Don't** mix \`labelPosition="top"\` and \`"left"\` fields inside one settings card.
- **Don't** validate on every keystroke — surface \`status="error"\` on submit (see *WithValidation*).
`;

/** Mirrors Input's labelPosition="left" styling (component/input/label, 171px column)
 *  so Dropdown / Textarea / Stepper rows align with the Inputs. */
const labelStyle: CSSProperties = {
  flex: '0 0 auto',
  width: 'var(--component-input-label-width, 171px)',
  fontSize: 'var(--component-input-fontSize, 14px)',
  lineHeight: 'var(--component-input-lineHeight, 19px)',
  fontWeight: 600,
  color: 'var(--component-input-label, #555766)',
  userSelect: 'none',
};

const FieldRow = ({
  label,
  alignTop = false,
  children,
}: {
  label: ReactNode;
  alignTop?: boolean;
  children: ReactNode;
}) => (
  <div style={{ display: 'flex', alignItems: alignTop ? 'flex-start' : 'center', gap: 8 }}>
    <span style={{ ...labelStyle, paddingTop: alignTop ? 10 : 0 }}>{label}</span>
    <div style={{ flex: '1 1 auto', minWidth: 0 }}>{children}</div>
  </div>
);

const TIMEZONES = [
  { value: 'utc', label: 'UTC (GMT+0)' },
  { value: 'london', label: 'Europe/London (GMT+1)' },
  { value: 'delhi', label: 'Asia/Kolkata (GMT+5:30)' },
  { value: 'new-york', label: 'America/New_York (GMT-4)' },
];

interface SettingsDraft {
  name: string;
  email: string;
  timezone: string;
  description: string;
  retentionDays: number;
}

const INITIAL: SettingsDraft = {
  name: 'Lepide Production',
  email: 'alerts@lepide.com',
  timezone: 'london',
  description: 'Primary workspace for production auditing and restore jobs.',
  retentionDays: 30,
};

const SettingsForm = ({ validate = false }: { validate?: boolean }) => {
  const [draft, setDraft] = useState<SettingsDraft>(
    validate ? { ...INITIAL, email: 'alerts@lepide' } : INITIAL
  );
  const [saved, setSaved] = useState<SettingsDraft>(INITIAL);
  const [submitted, setSubmitted] = useState(validate);

  const emailInvalid = submitted && !/^\S+@\S+\.\S+$/.test(draft.email);

  const set = <K extends keyof SettingsDraft>(key: K, value: SettingsDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div style={{ maxWidth: 720 }}>
      <Card
        title="Workspace Settings"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, width: '100%' }}>
            <Button variant="secondary" onClick={() => setDraft(saved)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSubmitted(true);
                if (/^\S+@\S+\.\S+$/.test(draft.email)) setSaved(draft);
              }}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Input
            label="Workspace name"
            labelPosition="left"
            fullWidth
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
            helperText="Shown in the header and on all exported reports."
          />
          <Input
            label="Notification email"
            labelPosition="left"
            fullWidth
            type="email"
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
            status={emailInvalid ? 'error' : 'default'}
            errorMessage="Enter a valid email address (e.g. alerts@lepide.com)."
          />
          <FieldRow label="Timezone">
            <Dropdown
              options={TIMEZONES}
              value={draft.timezone}
              placeholder="Select a timezone"
              onChange={(v) => {
                if (typeof v === 'string') set('timezone', v);
              }}
            />
          </FieldRow>
          <FieldRow label="Description" alignTop>
            <Textarea
              fullWidth
              rows={3}
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What is this workspace used for?"
            />
          </FieldRow>
          <FieldRow label="Retention period (days)">
            <Stepper
              min={1}
              max={365}
              value={draft.retentionDays}
              onChange={(v) => set('retentionDays', v)}
            />
          </FieldRow>
          <div
            style={{
              fontSize: 12,
              lineHeight: '16px',
              color: 'var(--color-text-secondary, #555766)',
            }}
          >
            Saved: {saved.name} · {saved.email} ·{' '}
            {TIMEZONES.find((t) => t.value === saved.timezone)?.label} · {saved.retentionDays} days
          </div>
        </div>
      </Card>
    </div>
  );
};

const meta: Meta = {
  title: 'Patterns/Settings Form',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: patternDescription } },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <SettingsForm />,
  parameters: {
    docs: {
      description: {
        story:
          'The complete controlled form. Edit any field, then Save to snapshot the values (echoed below the form) or Cancel to revert the draft to the last saved state.',
      },
    },
  },
};

export const WithValidation: Story = {
  render: () => <SettingsForm validate />,
  parameters: {
    docs: {
      description: {
        story:
          'The notification email starts invalid and submitted, so Input shows `status="error"` with its `errorMessage` (danger tokens). Fixing the email and pressing Save clears the error and persists the draft.',
      },
    },
  },
};
