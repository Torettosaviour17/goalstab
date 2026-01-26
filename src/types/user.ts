export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  connectedAccounts: ConnectedAccount[];
  preferences: UserPreferences;
  createdAt: string;
  lastLogin: string;
}

export interface ConnectedAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  lastFour: string;
  isDefault: boolean;
}

export interface UserPreferences {
  theme: "dark" | "light" | "auto";
  currency: string;
  notifications: NotificationSettings;
  autoSaveEnabled: boolean;
  twoFactorEnabled: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  goalCompleted: boolean;
  depositReceived: boolean;
  withdrawalRequested: boolean;
  weeklyReport: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
