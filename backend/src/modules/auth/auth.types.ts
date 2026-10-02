export interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface TelegramAuthBody {
  initData: string;
}

export interface VipInfo {
  level: number;
  name: string;
  depositAmount: string;
  dailyIncome: string;
  dailyTasksRequired: number;
}

export interface AuthenticatedUser {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  currentVip: VipInfo | null;
}
