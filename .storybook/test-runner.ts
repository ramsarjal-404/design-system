import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/*
 * Storybook test-runner a11y enforcement (SB8 recipe).
 *
 * Every story is rendered in a real browser via Playwright, then audited
 * with axe-core. Violations fail the test run (`npm run test-storybook`
 * against a running Storybook on :6006).
 *
 * Per-story opt-outs use the same `parameters.a11y` contract as
 * @storybook/addon-a11y (already configured in .storybook/preview.tsx):
 *
 *   parameters: {
 *     a11y: {
 *       disable: true,                 // skip axe for this story entirely
 *       config: { rules: [ ... ] },    // forwarded to configureAxe()
 *     },
 *   }
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    // Pull the story's parameters so stories can opt out / tune rules.
    const storyContext = await getStoryContext(page, context);
    const a11yParams = storyContext.parameters?.a11y;

    if (a11yParams?.disable) {
      return;
    }

    if (a11yParams?.config) {
      await configureAxe(page, a11yParams.config);
    }

    // Scope to the story root; fail (skipFailures = false) on violations.
    await checkA11y(
      page,
      '#storybook-root',
      {
        detailedReport: true,
        detailedReportOptions: { html: false },
      },
      false,
    );
  },
};

export default config;
