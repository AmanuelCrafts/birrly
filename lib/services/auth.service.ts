import { connectToDatabase } from "../mongodb";
import { User } from "@/models/User";
import { hashPassword, verifyPassword } from "../auth/password";
import { createSession, destroySession } from "../auth/session";

export interface SanitizedUser {
  id: string;
  username: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

function sanitizeUser(user: {
  _id: { toString(): string };
  username: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: Date;
}): SanitizedUser {
  return {
    id: user._id.toString(),
    username: user.username,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function registerUser(
  username: string,
  password: string
): Promise<{ success: true; user: SanitizedUser } | { success: false; error: string }> {
  await connectToDatabase();

  const usernameNormalized = username.toLowerCase();

  const existing = await User.findOne({ usernameNormalized }).lean();
  if (existing) {
    return { success: false, error: "That username is already taken." };
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    username,
    usernameNormalized,
    passwordHash,
  });

  await createSession(user._id.toString());

  return { success: true, user: sanitizeUser(user) };
}

export async function loginUser(
  username: string,
  password: string
): Promise<{ success: true; user: SanitizedUser } | { success: false; error: string }> {
  await connectToDatabase();

  const usernameNormalized = username.toLowerCase();

  const user = await User.findOne({ usernameNormalized }).lean() as {
    _id: { toString(): string };
    username: string;
    status: "ACTIVE" | "SUSPENDED";
    passwordHash: string;
    createdAt: Date;
  } | null;

  // Generic error to prevent username enumeration
  if (!user) {
    return { success: false, error: "Invalid username or password." };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Invalid username or password." };
  }

  if (user.status === "SUSPENDED") {
    return { success: false, error: "Your account has been suspended." };
  }

  await createSession(user._id.toString());

  return { success: true, user: sanitizeUser(user) };
}

export async function logoutUser(): Promise<void> {
  await destroySession();
}
