import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // Register the service worker from the authenticated app only. The public website remains a normal website.
      injectRegister: null,
      includeAssets: ["icons/*.png", "vite.svg"],
      manifest: {
        name: "GoalTabs",
        short_name: "GoalTabs",
        description: "Smart savings & goal-tracking platform",
        theme_color: "#3b82f6",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          {
            src: "/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Cache the complete built app shell so installed GoalTabs can open offline.
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [
          /^\\/(dashboard|goals|analytics|transactions|settings|accounts|help|payment-success|admin)(?:\\/|$)/,
        ],
        // Never cache authenticated API responses in the service worker.
        // They can contain user-specific financial data and should always come from the network.
      },
      devOptions: {
        enabled: false,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
