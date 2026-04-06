import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<"light" | "dark">(
    (localStorage.getItem("theme") as any) || "dark",
  );

  const setTheme = (newTheme: "light" | "dark") => {
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }
  };

  // Initialize on store creation
  const html = document.documentElement;
  if (theme.value === "dark") {
    html.classList.add("dark");
    html.classList.remove("light");
  } else {
    html.classList.add("light");
    html.classList.remove("dark");
  }

  return { theme, setTheme };
});
