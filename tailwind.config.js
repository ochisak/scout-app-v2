/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',      // ✅ これOK
    './components/**/*.{ts,tsx,js,jsx}',
    './app/globals.css',               // ✅ 明示的に追加すると確実
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
    },
  },
  plugins: [],
}
