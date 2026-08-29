/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#F9F2E6',
          200: '#F2E2C4',
          300: '#E4C994',
          400: '#D9AF60',
          500: '#D4AF37', // True Metallic Institutional Gold
          600: '#C59B27',
          700: '#B8860B',
          800: '#8C6608',
          900: '#5E4405'
        },
        royal: {
          950: '#06142E', // Deep Royal Dark
          900: '#081D3D',
          800: '#0D2D5E',
          700: '#153E7E',
          600: '#1E529E'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'Cambria', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        '2xs': ['clamp(0.75rem, 0.72rem + 0.1vw, 0.8125rem)', { lineHeight: '1.35' }],      // 12px - 13px (fine labels, timestamps)
        'xs': ['clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)', { lineHeight: '1.45' }],    // 13px - 14px (metadata, tags, small badges)
        'sm': ['clamp(0.9375rem, 0.91rem + 0.15vw, 1rem)', { lineHeight: '1.5' }],         // 15px - 16px (navigation, buttons, secondary text)
        'base': ['clamp(1.03125rem, 1.0rem + 0.2vw, 1.09375rem)', { lineHeight: '1.65' }], // 16.5px - 17.5px (~17px readable body)
        'lg': ['clamp(1.125rem, 1.08rem + 0.3vw, 1.25rem)', { lineHeight: '1.5' }],        // 18px - 20px (subheadings, lead intro)
        'xl': ['clamp(1.25rem, 1.18rem + 0.45vw, 1.45rem)', { lineHeight: '1.35' }],       // 20px - 23.2px (H4, card titles)
        '2xl': ['clamp(1.45rem, 1.35rem + 0.6vw, 1.75rem)', { lineHeight: '1.25' }],       // 23.2px - 28px (H3 section headers)
        '3xl': ['clamp(1.75rem, 1.6rem + 0.9vw, 2.25rem)', { lineHeight: '1.2' }],         // 28px - 36px (H2 section titles)
        '4xl': ['clamp(2.15rem, 1.95rem + 1.4vw, 2.75rem)', { lineHeight: '1.15' }],       // 34.4px - 44px (Major H2 / banner titles)
        '5xl': ['clamp(2.625rem, 2.25rem + 2vw, 3.5rem)', { lineHeight: '1.1' }],          // 42px - 56px (H1 Hero page headings)
        '6xl': ['clamp(3.125rem, 2.6rem + 2.5vw, 4.5rem)', { lineHeight: '1.05' }]         // 50px - 72px (Display titles)
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
