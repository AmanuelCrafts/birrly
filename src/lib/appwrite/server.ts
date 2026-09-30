import { Client, Account, Databases, Storage } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;

if (!endpoint || !projectId) {
  throw new Error(
    "Missing Appwrite environment variables. Make sure NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID are set."
  );
}

if (!apiKey) {
  throw new Error("Missing APPWRITE_API_KEY environment variable.");
}

/**
 * Appwrite server-side client.
 * Uses the API key — never expose to the browser.
 */
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

// Set API key via header (SDK v28+ compatible)
client.headers["X-Appwrite-Key"] = apiKey;

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client, databaseId };
