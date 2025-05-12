const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',

      },
    },
    extend: {
      colors: {
        'background': 'var(--background)',
        'background-dark': '#121212',
        'background-card': '#1E1E1E',
        'background-sidebar': '#0F0F0F',
        'accent': {
          primary: '#3B82F6',
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
          neutral: '#6B7280',
          blue: '#1A73E8',
          green: '#34A853',
          red: '#EA4335',
        },
        foreground: 'var(--foreground)', // Maps to --foreground (#171717 in light, #ededed in dark)
        'card-background': 'var(--card-background)', // Maps to --card-background (#E1E1DA in light, #26282B in dark)
        'card-foreground': 'var(--card-foreground)', // Maps to --card-foreground (#171717 in light, #ededed in dark)
        'primary-500': '#BA0C2F',
        'primary-600': '#CD0300',
        'secondary-500': '#FFB620',
        'off-white': '#D0DFFF',
        'text-color': '#FAEBD7',
        'light-1': '#FFFFFF',
        'light-2': '#FAEBD7',
        'light-3': '#7878A3',
        'light-4': '#5C5C7B',
        'highlight-dark': 'rgba(0, 0, 0, .5)',
        'dark': {
          1: '#000000',
          2: '#121417',
          3: '#101012',
          4: '#1F1F22',
          900: '#121212',
          800: '#1E1E1E',
          700: '#2D2D2D',
          600: '#3D3D3D',
        },
        'gold': {
          500: '#FFD700',
          400: '#FFDF33',
          300: '#FFE666',
        },
      },
      screens: {
        'xs': '480px',

      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],

      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        aurora: "aurora 60s linear infinite",
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
      },
    },
  },
  plugins: [require('tailwindcss-animate'), addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}