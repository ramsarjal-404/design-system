import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Lepidus Design System',
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
