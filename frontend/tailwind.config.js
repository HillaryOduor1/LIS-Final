/*import lineClamp from "@tailwindcss/line-clamp";
/** @type {import('tailwindcss').Config} /
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src//*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    "opacity-0",
    "opacity-100",
    "translate-y-0",
    "translate-y-4"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        // Map to CSS variables for dynamic overrides
        accent: "var(--accent)",
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        primary: "var(--accent)",
        "muted-foreground": "var(--muted)",

        // Brand palette
        pink: {
          50: "#fdf2f8",
          100: "#fce7f3",
          300: "#fbb6ce",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
          950: "#500724",
        },
        zinc: {
          950: "#09090b",
        }
      },
      keyframes: {
        movegradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        }
      },
      animation: {
        "move-gradient": "movegradient 5s infinite",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};*/
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#11d473",
        "background-light": "#f6f8f7",
        "background-dark": "#102219",
      },
      fontFamily: {
        "display": ["Public Sans", "sans-serif"],
        "sans": ["Public Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
