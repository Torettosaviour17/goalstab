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
      injectRegister: false,
      // Only include assets actually needed by the installed app. Avoid preloading
      // hundreds of legacy Windows tile images on every PWA installation.
      includeAssets: ["mainlogo.png", "GoalTabsSplash.png"],
      manifest: {
        name: "GoalTabs",
        short_name: "GoalTabs",
        description: "Smart savings & goal-tracking platform",
        theme_color: "#080d2c",
        background_color: "#080d2c",
        display: "standalone",
        start_url: "/login",
        icons: [
          { src: "/mainlogo.png", sizes: "any", type: "image/png", purpose: "any" },
        ],
      },
      workbox: {
        // Install the complete local UI (JS/CSS/HTML/fonts), but do not force
        // download every old icon and large image during first installation.
        globPatterns: ["**/*.{js,css,html,ico,svg,webmanifest,woff2}"],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              url.origin === self.location.origin &&
              request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "goaltabs-local-images-v1",
              expiration: { maxEntries: 90, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        // Cache larger dashboard chunks as part of the installed UI.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Cache the complete built app shell so installed GoalTabs can open offline.
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [
          /^\/$/,
          /^\/(dashboard|login|register|forgot-password|reset-password|goals|analytics|transactions|settings|accounts|help|payment-success|admin|terms|privacy)(?:\/|$)/,
        ],
        // API requests must never receive the SPA HTML fallback.
        navigateFallbackDenylist: [/^\/api(?:\/|$)/],
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
