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
          50: '#f0f5fd',
          100: '#e1ecfb',
          200: '#c3daf7',
          300: '#94bef0',
          400: '#5e9de6',
          500: '#274C97',
          600: '#1e3f84',
          700: '#1a336b',
          800: '#192d58',
          900: '#19284a',
          950: '#101a30',
          DEFAULT: '#274C97'
        },
        navy: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#1a3470',
          800: '#0B1F4E',
          900: '#08183e',
          950: '#183878',
          DEFAULT: '#274C97',
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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
        heading: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1.3' }],       // 12px (badges, micro tags)
        'xs': ['0.8125rem', { lineHeight: '1.4' }],     // 13px (meta tags, dates)
        'sm': ['0.875rem', { lineHeight: '1.5' }],      // 14px (navigation, buttons)
        'base': ['0.9375rem', { lineHeight: '1.65' }],  // 15px (standard body copy)
        'lg': ['1.0625rem', { lineHeight: '1.5' }],     // 17px (lead text, item titles)
        'xl': ['1.25rem', { lineHeight: '1.35' }],      // 20px (card titles, H4)
        '2xl': ['1.5rem', { lineHeight: '1.25' }],      // 24px (H3 subsection titles)
        '3xl': ['1.875rem', { lineHeight: '1.2' }],     // 30px (H2 section titles)
        '4xl': ['2.25rem', { lineHeight: '1.15' }],     // 36px (Page titles)
        '5xl': ['2.75rem', { lineHeight: '1.1' }],      // 44px (Hero headlines)
        '6xl': ['3.5rem', { lineHeight: '1.05' }]       // 56px (Display banners)
      },
      lineHeight: {
        'heading': '1.15',
        'body': '1.65',
        'nav': '1.35'
      }
    },
  },
  plugins: [],
}
