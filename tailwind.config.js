export default {
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
      },
      animation: {
        float: "var(--animate-float)",
        "pulse-soft": "var(--animate-pulse-soft)",
        "slide-up": "var(--animate-slide-up)",
        "fade-in": "var(--animate-fade-in)",
      },
      backdropBlur: {
        xl: "20px",
      },
    },
  },
  plugins: [],
};
