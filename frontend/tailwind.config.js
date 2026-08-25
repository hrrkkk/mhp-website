/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mhp: {
          dark: "#1D1D1B",
          darkSecondary: "#262523",
          cream: "#F6F0E6",
          sand: "#E9DED0",
          terracotta: "#B96548",
          terracottaHover: "#A4553B",
          burgundy: "#6F3F38",
          sage: "#7C8470",
          warmWhite: "#FCFAF6",
          charcoal: "#242321",
          textMuted: "#736E67",
          border: "#DDD5C7",
          borderDark: "#33312E",

          // Compatibility mapping
          bg: "#F6F0E6",
          bgDark: "#1D1D1B",
          surface: "#FCFAF6",
          textPrimary: "#242321",
          textSecondary: "#736E67",
          textLight: "#F6F0E6",
          accent: "#B96548",
          accentHover: "#A4553B",
          card: "#FCFAF6",
          cardDark: "#262523"
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
