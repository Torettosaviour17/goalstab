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
      // Only include assets actually needed by the installed app. Avoid preloading\n      // hundreds of legacy Windows tile images on every PWA installation.\n      includeAssets: ["mainlogo.png", "GoalTabsSplash.png"],
      manifest: {
        name: "GoalTabs",
        short_name: "GoalTabs",
        description: "Smart savings & goal-tracking platform",
        theme_color: "#080d2c",
        background_color: "#080d2c",
        display: "standalone",
        start_url: "/login",
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
        // Install the complete local UI (JS/CSS/HTML/fonts), but do not force\n        // download every old icon and large image during first installation.\n        globPatterns: ["**/*.{js,css,html,ico,svg,webmanifest,woff2}"],\n        additionalManifestEntries: [{ url: "/mainlogo.png", revision: null }, { url: "/GoalTabsSplash.png", revision: null }],\n        runtimeCaching: [\n          {\n            urlPattern: ({ request, url }) =>\n              url.origin === self.location.origin &&\n              request.destination === "image",\n            handler: "CacheFirst",\n            options: {\n              cacheName: "goaltabs-local-images-v1",\n              expiration: { maxEntries: 90, maxAgeSeconds: 60 * 60 * 24 * 30 },\n              cacheableResponse: { statuses: [0, 200] },\n            },\n          },\n        ],
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
