export const telegramAuthSchema = {
  body: {
    initData: { type: "string", minLength: 1 },
  },
} as const;

export type TelegramAuthBody = {
  initData: string;
};

export interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
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
}
