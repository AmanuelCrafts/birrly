"use client";

import { useCallback, useEffect, useState } from "react";
import { Query } from "appwrite";
import { databases, databaseId } from "@/lib/appwrite/server";
import { useTelegram } from "./useTelegram";

const DAILY_AD_LIMIT = 10;

export function useAdCounter() {
  const telegram = useTelegram();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCount = useCallback(async () => {
    if (!telegram.isInsideTelegram || !telegram.user || !databaseId) return;

    setIsLoading(true);
    try {
      const users = await databases.listDocuments(databaseId, "users", [
        Query.equal("telegram_id", String(telegram.user.id)),
      ]);

      if (users.total === 0) return;

      const userId = users.documents[0].$id;
      const today = new Date().toISOString().split("T")[0];
      const startOfDay = `${today}T00:00:00.000Z`;
      const endOfDay = `${today}T23:59:59.999Z`;

      const result = await databases.listDocuments(databaseId, "transactions", [
        Query.equal("user_id", userId),
        Query.equal("type", "AD_REWARD"),
        Query.greaterThanEqual("created_at", startOfDay),
        Query.lessThanEqual("created_at", endOfDay),
      ]);

      setCount(result.total);
    } catch (err) {
      console.error("[AdCounter] Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [telegram.isInsideTelegram, telegram.user]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + 1, DAILY_AD_LIMIT));
  }, []);

  const remaining = DAILY_AD_LIMIT - count;
  const isLimitReached = count >= DAILY_AD_LIMIT;

  return {
    count,
    limit: DAILY_AD_LIMIT,
    remaining,
    isLimitReached,
    isLoading,
    refresh: fetchCount,
    increment,
  };
}
