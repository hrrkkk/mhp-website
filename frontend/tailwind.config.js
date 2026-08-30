/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#183A2A',
          dark: '#10271C',
          light: '#23503B',
        },
        cream: {
          DEFAULT: '#FFF7E8',
          dark: '#F5E6CC',
          light: '#FFFCF5',
        },
        orange: {
          DEFAULT: '#F47B20',
          dark: '#D6620C',
          light: '#FF8F3D',
        },
        sage: {
          DEFAULT: '#7D967E',
          dark: '#627A63',
          light: '#98B199',
        },
        charcoal: {
          DEFAULT: '#202522',
          light: '#2F3632',
          muted: '#525B56',
        },
        softwhite: '#FFFFFF',

        mhp: {
          dark: "#183A2A",
          darkSecondary: "#202522",
          cream: "#FFF7E8",
          sand: "#F5E6CC",
          terracotta: "#F47B20",
          terracottaHover: "#D6620C",
          burgundy: "#183A2A",
          sage: "#7D967E",
          warmWhite: "#FFFFFF",
          charcoal: "#202522",
          textMuted: "#7D967E",
          border: "#7D967E",
          borderDark: "#183A2A",

          // Compatibility mapping
          bg: "#FFF7E8",
          bgDark: "#183A2A",
          surface: "#FFFFFF",
          textPrimary: "#202522",
          textSecondary: "#7D967E",
          textLight: "#FFF7E8",
          accent: "#F47B20",
          accentHover: "#D6620C",
          card: "#FFFFFF",
          cardDark: "#183A2A"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"DM Serif Display"', 'serif'],
      }
    },
  },
  plugins: [],
}

