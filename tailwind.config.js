export default {
  darkMode: "class", // Add this for dark mode support
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
        "light-bg": "#f9f9f9",
        "light-card": "#ffffff",
        "light-text": "#111827",
        "light-border": "#d1d5db",
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
      addVariant("light", ":not(.dark) &");
    },
  ],
};
