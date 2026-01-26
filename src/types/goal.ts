export interface Goal {
  id: string;
  title: string;
  target: number;
  saved: number;
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
  locked: boolean;
  progress: number;
  lastUpdated: string;
  category?: string;
  sharedWith?: string[];
  createdAt: string;
}

export interface GoalFormData {
  title: string;
  target: number;
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
  category?: string;
}

export interface GoalStats {
  totalSaved: number;
  totalTarget: number;
  overallProgress: number;
  activeGoals: number;
  completedGoals: number;
  monthlyGrowth: number;
}

export interface GoalActivity {
  id: string;
  goalId: string;
  type: "deposit" | "withdrawal" | "goal_completed" | "auto_save";
  amount: number;
  timestamp: string;
  description: string;
}
