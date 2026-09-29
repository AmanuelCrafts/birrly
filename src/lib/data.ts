import type { LeaderboardEntry, Task, Transaction, User } from "./types";

/**
 * Birrly — Mock data
 *
 * This data simulates what will eventually come from Supabase.
 * Replace these with real API calls when the backend is connected.
 *
 * SECURITY NOTE: Balance is display-only. The frontend must never
 * determine or modify a user's balance. All balance changes will
 * be handled by a verified backend (Telegram → backend → Supabase).
 */

// ─── Mock User ───────────────────────────────────────────────────────────────

export const mockUser: User = {
  id: "mock-user-001",
  firstName: "Amanuel",
  username: "amanuel",
  balance: 1250,
  streak: 3,
  createdAt: "2025-06-15T10:30:00Z",
  isMock: true,
};

// ─── Mock Tasks ───────────────────────────────────────────────────────────────

export const mockTasks: Task[] = [
  {
    id: "watch-ad",
    title: "Watch & Earn",
    description: "Watch an ad and earn BRL",
    reward: 10,
    icon: "Play",
    status: "coming_soon",
    category: "watch",
  },
  {
    id: "daily-bonus",
    title: "Daily Bonus",
    description: "Come back every day",
    reward: 25,
    icon: "Gift",
    status: "coming_soon",
    category: "daily",
  },
  {
    id: "sponsored-task",
    title: "Sponsored Task",
    description: "Complete a partner offer",
    reward: 50,
    icon: "Briefcase",
    status: "coming_soon",
    category: "sponsored",
  },
  {
    id: "invite-friends",
    title: "Invite Friends",
    description: "Share Birrly with friends",
    reward: 100,
    icon: "Users",
    status: "coming_soon",
    category: "invite",
  },
  {
    id: "special-offer",
    title: "Special Offer",
    description: "Limited-time reward",
    reward: 75,
    icon: "Sparkles",
    status: "coming_soon",
    category: "offer",
  },
];

// ─── Mock Leaderboard ────────────────────────────────────────────────────────

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: { id: "u1", firstName: "UserOne", username: "userone" },
    balance: 12450,
  },
  {
    rank: 2,
    user: { id: "u2", firstName: "UserTwo", username: "usertwo" },
    balance: 10820,
  },
  {
    rank: 3,
    user: { id: "u3", firstName: "UserThree", username: "userthree" },
    balance: 9640,
  },
  {
    rank: 4,
    user: { id: "u4", firstName: "UserFour", username: "userfour" },
    balance: 8210,
  },
  {
    rank: 5,
    user: { id: "u5", firstName: "UserFive", username: "userfive" },
    balance: 7950,
  },
  {
    rank: 6,
    user: { id: "u6", firstName: "UserSix", username: "usersix" },
    balance: 6800,
  },
  {
    rank: 7,
    user: { id: "u7", firstName: "UserSeven", username: "userseven" },
    balance: 5450,
  },
  {
    rank: 8,
    user: { id: "u8", firstName: "UserEight", username: "usereight" },
    balance: 4300,
  },
  {
    rank: 9,
    user: { id: "u9", firstName: "UserNine", username: "usernine" },
    balance: 3150,
  },
  {
    rank: 10,
    user: { id: "u10", firstName: "UserTen", username: "userten" },
    balance: 2100,
  },
];

// ─── Mock Transactions ───────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "earn",
    amount: 25,
    description: "Daily Bonus",
    createdAt: "2025-09-28T08:00:00Z",
    status: "completed",
  },
  {
    id: "tx2",
    type: "earn",
    amount: 10,
    description: "Watch & Earn",
    createdAt: "2025-09-27T14:30:00Z",
    status: "completed",
  },
  {
    id: "tx3",
    type: "earn",
    amount: 50,
    description: "Sponsored Task",
    createdAt: "2025-09-26T11:15:00Z",
    status: "completed",
  },
  {
    id: "tx4",
    type: "earn",
    amount: 100,
    description: "Invite Friends",
    createdAt: "2025-09-25T09:45:00Z",
    status: "completed",
  },
  {
    id: "tx5",
    type: "earn",
    amount: 75,
    description: "Special Offer",
    createdAt: "2025-09-24T16:20:00Z",
    status: "completed",
  },
];
