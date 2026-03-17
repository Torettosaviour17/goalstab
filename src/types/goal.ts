export interface Goal {
  id: string;
  _id: string;
  title: string;
  userTarget: number; // 👈 new
  fee: number; // 👈 new
  target: number; // total (userTarget + fee)
  saved: number;
  withdrawn: number;
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
  locked: boolean;
  accountId?: string;
  progress: number;
  lastUpdated: string;
  category?: string;
  autoSaveEnabled?: boolean;
  nextAutoSave?: string;
  sharedWith?: SharedUser[];
  createdAt: string;
}

export interface GoalFormData {
  title: string;
  userTarget: number; // 👈 new
  icon: string;
  color: string;
  type: "percentage" | "fixed";
  autoSave: number;
  frequency: "daily" | "weekly" | "monthly";
  deadline?: string;
  category?: string;
  accountId?: string;
  autoSaveEnabled?: boolean;
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

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "contributor" | "viewer";
  avatar?: string;
}
