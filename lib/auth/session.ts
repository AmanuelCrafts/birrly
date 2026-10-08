import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "../mongodb";
import { Session } from "@/models/Session";
import { User, type IUser } from "@/models/User";

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE = Number(process.env.SESSION_MAX_AGE ?? 604800); // 7 days

/**
 * Generates a cryptographically secure random session token.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Hashes a session token for storage.
 */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new session for a user and sets the HTTP-only cookie.
 */
export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await connectToDatabase();
  await Session.create({ userId, tokenHash, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Gets the current user from the session cookie.
 */
export async function getCurrentUser(): Promise<IUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const tokenHash = hashSessionToken(token);

  await connectToDatabase();
  const session = await Session.findOne({ tokenHash }).lean() as {
    _id: { toString(): string };
    userId: { toString(): string };
    expiresAt: Date;
  } | null;

  if (!session) return null;

  // Check if session is expired
  if (new Date(session.expiresAt) < new Date()) {
    await Session.deleteOne({ _id: session._id });
    return null;
  }

  const user = await User.findById(session.userId).lean() as unknown as IUser | null;
  return user;
}

/**
 * Destroys the current session and clears the cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);
    await connectToDatabase();
    await Session.deleteOne({ tokenHash });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Checks if the user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
