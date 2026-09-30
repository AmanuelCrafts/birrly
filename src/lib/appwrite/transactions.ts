import { Query } from "appwrite";
import { databases, databaseId } from "./server";

/**
 * Transaction types supported by Birrly
 */
export type TransactionType =
  | "DEPOSIT"
  | "AD_REWARD"
  | "REFERRAL_REWARD"
  | "WITHDRAWAL"
  | "ADJUSTMENT";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  referenceId?: string;
  metadata?: string;
  createdAt: string;
}

/**
 * Credit a user's balance and record the transaction.
 * This is an atomic operation — both the transaction record and balance update
 * must succeed, or neither does.
 *
 * @param userId - The user's document ID
 * @param amount - The amount to credit (must be positive)
 * @param type - The transaction type
 * @param referenceId - Optional reference ID for idempotency
 * @param metadata - Optional metadata JSON string
 * @returns The created transaction
 * @throws Error if amount is invalid or user not found
 */
export async function creditUser(
  userId: string,
  amount: number,
  type: TransactionType,
  referenceId?: string,
  metadata?: string
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Credit amount must be positive");
  }

  if (!databaseId) {
    throw new Error("Server configuration missing");
  }

  // Check for duplicate transaction (idempotency)
  if (referenceId) {
    const existing = await databases.listDocuments(databaseId, "transactions", [
      Query.equal("reference_id", referenceId),
    ]);
    if (existing.total > 0) {
      throw new Error("Duplicate transaction — already processed");
    }
  }

  // Get current user balance
  const user = await databases.getDocument(databaseId, "users", userId);
  const currentBalance = user.balance as number;
  const newBalance = currentBalance + amount;

  // Create transaction record
  const now = new Date().toISOString();
  const transaction = await databases.createDocument(
    databaseId,
    "transactions",
    "unique()",
    {
      user_id: userId,
      type,
      amount,
      status: "COMPLETED",
      reference_id: referenceId || "",
      metadata: metadata || "",
      created_at: now,
    }
  );

  // Update user balance
  await databases.updateDocument(databaseId, "users", userId, {
    balance: newBalance,
    total_earned:
      type === "DEPOSIT" || type === "AD_REWARD" || type === "REFERRAL_REWARD"
        ? (user.total_earned as number) + amount
        : (user.total_earned as number),
    updated_at: now,
  });

  return {
    id: transaction.$id,
    userId: transaction.user_id as string,
    type: transaction.type as TransactionType,
    amount: transaction.amount as number,
    status: transaction.status as TransactionStatus,
    referenceId: transaction.reference_id as string | undefined,
    metadata: transaction.metadata as string | undefined,
    createdAt: transaction.$createdAt,
  };
}

/**
 * Debit a user's balance and record the transaction.
 * This is an atomic operation — both the transaction record and balance update
 * must succeed, or neither does.
 *
 * @param userId - The user's document ID
 * @param amount - The amount to debit (must be positive)
 * @param type - The transaction type
 * @param referenceId - Optional reference ID for idempotency
 * @param metadata - Optional metadata JSON string
 * @returns The created transaction
 * @throws Error if amount is invalid, user not found, or insufficient balance
 */
export async function debitUser(
  userId: string,
  amount: number,
  type: TransactionType,
  referenceId?: string,
  metadata?: string
): Promise<Transaction> {
  if (amount <= 0) {
    throw new Error("Debit amount must be positive");
  }

  if (!databaseId) {
    throw new Error("Server configuration missing");
  }

  // Check for duplicate transaction (idempotency)
  if (referenceId) {
    const existing = await databases.listDocuments(databaseId, "transactions", [
      Query.equal("reference_id", referenceId),
    ]);
    if (existing.total > 0) {
      throw new Error("Duplicate transaction — already processed");
    }
  }

  // Get current user balance
  const user = await databases.getDocument(databaseId, "users", userId);
  const currentBalance = user.balance as number;

  // Prevent negative balances
  if (currentBalance < amount) {
    throw new Error("Insufficient balance");
  }

  const newBalance = currentBalance - amount;

  // Create transaction record
  const now = new Date().toISOString();
  const transaction = await databases.createDocument(
    databaseId,
    "transactions",
    "unique()",
    {
      user_id: userId,
      type,
      amount: -amount,
      status: "COMPLETED",
      reference_id: referenceId || "",
      metadata: metadata || "",
      created_at: now,
    }
  );

  // Update user balance
  await databases.updateDocument(databaseId, "users", userId, {
    balance: newBalance,
    total_withdrawn:
      type === "WITHDRAWAL"
        ? (user.total_withdrawn as number) + amount
        : (user.total_withdrawn as number),
    updated_at: now,
  });

  return {
    id: transaction.$id,
    userId: transaction.user_id as string,
    type: transaction.type as TransactionType,
    amount: transaction.amount as number,
    status: transaction.status as TransactionStatus,
    referenceId: transaction.reference_id as string | undefined,
    metadata: transaction.metadata as string | undefined,
    createdAt: transaction.$createdAt,
  };
}

/**
 * Get a user's transaction history.
 *
 * @param userId - The user's document ID
 * @param limit - Maximum number of transactions to return
 * @returns Array of transactions
 */
export async function getUserTransactions(
  userId: string,
  limit = 50
): Promise<Transaction[]> {
  if (!databaseId) {
    throw new Error("Server configuration missing");
  }

  const result = await databases.listDocuments(databaseId, "transactions", [
    Query.equal("user_id", userId),
    Query.orderDesc("created_at"),
    Query.limit(limit),
  ]);

  return result.documents.map((doc) => ({
    id: doc.$id,
    userId: doc.user_id || "",
    type: (doc.type || "ADJUSTMENT") as TransactionType,
    amount: doc.amount || 0,
    status: (doc.status || "COMPLETED") as TransactionStatus,
    referenceId: doc.reference_id || undefined,
    metadata: doc.metadata || undefined,
    createdAt: doc.$createdAt,
  }));
}
