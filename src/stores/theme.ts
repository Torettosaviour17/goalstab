import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type ThemePreference = "system" | "light" | "dark";
const storageKey = "goaltabs-theme-preference";
const legacyKey = "theme";
const readPreference = (): ThemePreference => {
  const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyKey);
  return saved === "dark" || saved === "light" || saved === "system" ? saved : "system";
};
const systemIsDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

export const useThemeStore = defineStore("theme", () => {
  const preference = ref<ThemePreference>(readPreference());
  const theme = ref<"light" | "dark">(preference.value === "system" ? (systemIsDark() ? "dark" : "light") : preference.value);
  const applyTheme = () => {
    const resolved = preference.value === "system" ? (systemIsDark() ? "dark" : "light") : preference.value;
    theme.value = resolved;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.classList.toggle("light", resolved === "light");
    document.documentElement.style.colorScheme = resolved;
    const color = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (color) color.content = resolved === "dark" ? "#080d2c" : "#f8fafc";
  };
  const setPreference = (value: ThemePreference) => { preference.value = value; };
  const setTheme = (value: "light" | "dark") => { setPreference(value); };
  watch(preference, value => {
    localStorage.setItem(storageKey, value);
    applyTheme();
  });
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", () => { if (preference.value === "system") applyTheme(); });
  applyTheme();
  return { theme, preference, setTheme, setPreference };
});
