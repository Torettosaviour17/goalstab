import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useAuthStore } from "@/stores/auth";

export const useOnboardingTour = () => {
  const authStore = useAuthStore();

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: ".new-goal-button",
          popover: {
            title: "Create Your First Goal",
            description:
              "Click here to start a new savings goal. Choose between a product (e.g., laptop) or a service (e.g., vacation).",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: ".stats-card:first-child",
          popover: {
            title: "Your Savings Overview",
            description:
              "Track your total saved amount, active goals, progress, and monthly growth at a glance.",
            side: "bottom",
          },
        },
        {
          element: ".goal-card:first-child",
          popover: {
            title: "Goal Cards",
            description:
              'Each goal shows its progress, saved amount, target, and auto‑save settings. Click "Add Funds" to contribute.',
            side: "top",
          },
        },
        {
          element: ".sidebar",
          popover: {
            title: "Quick Navigation",
            description:
              "Use the sidebar to access your goals, analytics, settings, and admin panel (if you have admin rights).",
            side: "right",
          },
        },
        {
          element: ".quick-actions",
          popover: {
            title: "Quick Actions",
            description:
              "Add funds, create a new goal, or view analytics with these handy shortcuts.",
            side: "top",
          },
        },
        {
          element: ".recent-activity",
          popover: {
            title: "Recent Activity",
            description:
              "See your latest deposits, withdrawals, and goal completions here.",
            side: "top",
          },
        },
      ],
      onDestroyed: () => {
        // Mark onboarding as completed
        authStore.updatePreferences({ onboardingCompleted: true });
      },
    });
    driverObj.drive();
  };

  const shouldShowTour = () => {
    return !authStore.user?.preferences?.onboardingCompleted;
  };

  return {
    startTour,
    shouldShowTour,
  };
};
