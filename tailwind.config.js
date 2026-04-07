/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        secondary: "var(--color-secondary)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",

        // ✅ Light theme tokens
        light: {
          bg: "#f9fafb",
          card: "#ffffff",
          text: "#111827",
          border: "#e5e7eb",
        },
      },

      animation: {
        float: "var(--animate-float)",
        "pulse-soft": "var(--animate-pulse-soft)",
        "slide-up": "var(--animate-slide-up)",
        "fade-in": "var(--animate-fade-in)",
      },

      transitionProperty: {
        height: "height",
      },

      backdropBlur: {
        xl: "20px",
      },
    },
  },

  plugins: [
    function ({ addVariant }) {
      // ✅ FIXED light variant (this was your main bug)
      addVariant("light", ".light &");
    },
  ],
};
