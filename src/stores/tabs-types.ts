// src/stores/tabs-types.ts

export interface Goal {
  id: number;
  title: string;
  target: number;
  progress: number;
  autoSavePercent?: number;
  intervalId?: number;
}

export interface Tab {
  id: number;
  name: string;
  goals: Goal[];
}
