import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  // Load saved theme or default to dark
  const theme = ref<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark",
  );

  // Apply theme to <html>
  const applyTheme = (newTheme: "light" | "dark") => {
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }
  };

  // Initialize theme on load
  applyTheme(theme.value);

  // Watch for changes and persist
  watch(theme, (newTheme) => {
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  const setTheme = (newTheme: "light" | "dark") => {
    theme.value = newTheme;
  };

  return { theme, setTheme };
});
