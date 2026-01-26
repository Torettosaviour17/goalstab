import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    title?: string;
    icon?: string;
    showInNav?: boolean;
    transition?: string;
  }
}

export type RouteName =
  | "dashboard"
  | "goals"
  | "analytics"
  | "settings"
  | "login"
  | "register"
  | "forgot-password"
  | "not-found";
