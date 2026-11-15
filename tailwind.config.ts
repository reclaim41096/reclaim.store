import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bricolage)', 'sans-serif'],
        nav: ['var(--font-lilita)', 'sans-serif'],
        shout: ['var(--font-unbounded)', 'sans-serif'],
        wordmark: ['var(--font-pacifico)', 'cursive'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      // ONE palette for the whole site + admin. Do not hard-code hex values in components.
      colors: {
        brand: {
          DEFAULT: '#E31E24', // primary actions, active states, logo red
          dark: '#B5171C', // hover + small text on tinted backgrounds (AA contrast)
          darker: '#8C1419',
          tint: '#FDEEEC', // chips, icon tiles, soft highlights
          border: '#F3DEDC', // every border/divider
          surface: '#FCF6F5', // alternate section / page backgrounds
        },
        gold: {
          DEFAULT: '#F2B705', // accent only (sparkles, underline bars), never a section colour
          dark: '#8A5F00',
          tint: '#FFF4D6',
        },
        ink: {
          DEFAULT: '#221211', // headings, dark sections
          muted: '#5B4440', // body text
          light: '#77605B', // secondary text
          faint: '#856F6A', // hints, placeholders
          tint: '#F4EFEE', // neutral chips (draft, cancelled)
        },
        // Meaning-only colours: use for status, never for decoration
        success: { DEFAULT: '#1E7A4C', tint: '#E8F5EE' },
        danger: { DEFAULT: '#B42318', tint: '#FDECEA' },
        whatsapp: { DEFAULT: '#0E7C6F', dark: '#0A6A5F' },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
