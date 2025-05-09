import type { Preview } from '@storybook/react'
import '../src/index.css'; // Import your tailwind css

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F8F9FA', // Same as your light-bg color
        },
        {
          name: 'dark',
          value: '#121212', // Your dark mode background color
        },
      ],
    },
    layout: 'centered',
  },
};

export default preview;