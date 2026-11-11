/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        stphilos: {
          50: '#eef3fb',
          100: '#dae6f6',
          200: '#b5ceec',
          300: '#81acdf',
          400: '#4885cc',
          500: '#2364b4',
          600: '#174e96',
          700: '#133e79',
          800: '#0B1F4E',
          900: '#071536',
          950: '#040b1e',
          DEFAULT: '#0B1F4E'
        },
        navy: {
          50: '#eef3fb',
          100: '#dae6f6',
          200: '#b5ceec',
          300: '#81acdf',
          400: '#4885cc',
          500: '#2364b4',
          600: '#174e96',
          700: '#133e79',
          800: '#0B1F4E',
          900: '#071536',
          950: '#040b1e',
          DEFAULT: '#0B1F4E',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#F0D98C',
          400: '#e2be5a',
          500: '#C9A84C',
          600: '#a88530',
          700: '#876520',
          800: '#664a18',
          900: '#483410',
          DEFAULT: '#C9A84C',
        },
        royal: {
          950: '#0a1733',
          900: '#10244c',
          800: '#193974',
          700: '#1f458c',
          600: '#274C97'
        }
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['"Source Sans 3"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Source Sans 3"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Source Sans 3"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Source Sans 3"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        classical: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1.3' }],       // 12px (badges, micro tags)
        'xs': ['0.8125rem', { lineHeight: '1.4' }],     // 13px (breadcrumbs, meta tags, dates)
        'sm': ['0.875rem', { lineHeight: '1.5' }],      // 14px (table data, document lists)
        'nav': ['0.9375rem', { lineHeight: '1.4' }],    // 15px (primary navigation, controls)
        'base': ['1rem', { lineHeight: '1.65' }],       // 16px (standard institutional body copy)
        'card': ['1.0625rem', { lineHeight: '1.35' }],  // 17px (card titles, lead item titles)
        'lg': ['1.125rem', { lineHeight: '1.35' }],     // 18px (H4 smaller headings, lead text)
        'xl': ['1.3125rem', { lineHeight: '1.3' }],     // 21px (H3 subsection titles)
        '2xl': ['1.625rem', { lineHeight: '1.25' }],    // 26px (H2 section titles)
        '3xl': ['2rem', { lineHeight: '1.2' }],         // 32px (H1 main page titles)
        '4xl': ['2.25rem', { lineHeight: '1.18' }],     // 36px (large page headings)
        '5xl': ['2.75rem', { lineHeight: '1.12' }],     // 44px (hero headlines)
        '6xl': ['3.25rem', { lineHeight: '1.08' }]      // 52px (display banners)
      },
      lineHeight: {
        'heading': '1.25',
        'body': '1.65',
        'nav': '1.4'
      }
    },
  },
  plugins: [],
}
