import type { Config } from 'tailwindcss';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const theme = require('./src/data/theme.json');

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Load design tokens from external JSON
      colors: theme.colors,
      borderRadius: theme.borderRadius,
      boxShadow: theme.boxShadow,
      height: {
        'map': theme.map.height,
      },
    },
  },
  plugins: [],
} satisfies Config;
