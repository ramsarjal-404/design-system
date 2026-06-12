import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';
// version badge in the sidebar brand — kept in step with the release version
import { version } from '../package.json';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: `Lepidus Design System <span style="font-size:11px;opacity:.65">v${version}</span>`,
    brandUrl: 'https://www.figma.com/design/Ck7BIRlRw2bwHRk8PL5IfC/Lepidus',
    brandTarget: '_blank',

    colorPrimary: '#1c4599',
    colorSecondary: '#1c4599',

    appBg: '#f5f7fd',
    appContentBg: '#ffffff',
    appBorderColor: '#e4edff',
    appBorderRadius: 10,

    fontBase: "'Open Sans', system-ui, sans-serif",

    textColor: '#364765',
    textMutedColor: '#555766',

    barTextColor: '#555766',
    barSelectedColor: '#1c4599',
    barHoverColor: '#1c4599',
    barBg: '#ffffff',

    inputBg: '#ffffff',
    inputBorder: '#c7c7c7',
    inputTextColor: '#364765',
    inputBorderRadius: 8,
  }),
});
