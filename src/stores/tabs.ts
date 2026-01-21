import { defineStore } from "pinia";

export interface Tab {
  id: number;
  name: string;
  goals: Goal[];
}

export interface Goal {
  id: number;
  name: string;
  progress: number;
  target: number;
}

export const useTabsStore = defineStore("tabs", {
  state: () => ({
    tabs: [] as Tab[],
    activeTabId: 0,
  }),
  actions: {
    addTab(name: string) {
      const id = this.tabs.length + 1;
      this.tabs.push({ id, name, goals: [] });
      this.activeTabId = id;
    },
    removeTab(id: number) {
      this.tabs = this.tabs.filter((t) => t.id !== id);
      if (this.activeTabId === id) this.activeTabId = this.tabs[0]?.id || 0;
    },
    addGoal(tabId: number, name: string, target: number) {
      const tab = this.tabs.find((t) => t.id === tabId);
      if (!tab) return;
      const id = tab.goals.length + 1;
      tab.goals.push({ id, name, progress: 0, target });
    },
    updateGoalProgress(tabId: number, goalId: number, amount: number) {
      const tab = this.tabs.find((t) => t.id === tabId);
      const goal = tab?.goals.find((g) => g.id === goalId);
      if (goal) {
        goal.progress = Math.min(goal.progress + amount, goal.target);
      }
    },
  },
});
