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
    extend: {},
  },
  plugins: [],
};
