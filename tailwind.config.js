/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D100E',
          'bg-secondary': '#131814',
          surface: '#1A211B',
          'surface-elevated': '#222B23',
          'surface-hover': '#242F26',
          border: '#303A31',
          text: '#F4F7F1',
          muted: '#A0ACA1',
        },
        light: {
          bg: '#F6F8F4',
          'bg-secondary': '#EEF2EC',
          surface: '#FFFFFF',
          'surface-elevated': '#F8FAF7',
          'surface-hover': '#F0F4EE',
          border: '#E1E8DF',
          text: '#192219',
          muted: '#687568',
        },
        brand: {
          primary: '#C0F477',
          'primary-light': '#477C27',
          secondary: '#63D5A1',
          accent: '#B5F36D',
          mint: '#58C99B',
          danger: '#FF5C5C',
          warning: '#F5A623',
          info: '#4EA5FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
