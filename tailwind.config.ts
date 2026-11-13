import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bricolage)', 'sans-serif'],
        wordmark: ['var(--font-pacifico)', 'cursive'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#E31E24',
          dark: '#B5171C',
          darker: '#8C1419',
          tint: '#FDEEEC',
          border: '#F3DEDC',
        },
        gold: {
          DEFAULT: '#F2B705',
          dark: '#A6760A',
          tint: '#FFF4D6',
        },
        ink: {
          DEFAULT: '#221211',
          muted: '#5B4440',
          light: '#8A6F6B',
          faint: '#A6908C',
        },
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
