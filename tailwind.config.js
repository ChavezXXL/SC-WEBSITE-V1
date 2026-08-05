/** @type {import('tailwindcss').Config} */
export default {
  // Scan every source file that can contain class names so the JIT compiler
  // emits exactly the utilities the site uses (and nothing more).
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Makes `font-sans` actually mean Inter (loaded in index.html) and
        // gives `font-space` a real definition instead of silently no-opping.
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        space: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
