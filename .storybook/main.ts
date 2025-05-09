import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        postCss: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  "docs": {
    "autodocs": true,
  },
  "typescript": {
    "check": true,
    "reactDocgen": 'react-docgen-typescript',
  },
  "staticDirs": [
    "../public"
  ]
};
export default config;