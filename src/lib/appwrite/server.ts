import { Client, Account, Databases, Storage } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID;

/**
 * Appwrite server-side client.
 * Uses the API key — never expose to the browser.
 *
 * NOTE: This is a lazy singleton. It throws when actually used
 * if env vars are missing, not at import time.
 */
let _client: Client | null = null;
let _databases: Databases | null = null;
let _account: Account | null = null;
let _storage: Storage | null = null;

function getClient(): Client {
  if (!_client) {
    if (!endpoint || !projectId) {
      throw new Error(
        "Missing Appwrite environment variables. Make sure NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID are set."
      );
    }
    _client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId);
    if (apiKey) {
      _client.setKey(apiKey);
    }
  }
  return _client;
}

function getDatabases(): Databases {
  if (!_databases) {
    _databases = new Databases(getClient());
  }
  return _databases;
}

function getAccount(): Account {
  if (!_account) {
    _account = new Account(getClient());
  }
  return _account;
}

function getStorage(): Storage {
  if (!_storage) {
    _storage = new Storage(getClient());
  }
  return _storage;
}

// Proxy objects that lazily initialize on first use
export const databases = {
  listDocuments: (...args: Parameters<Databases["listDocuments"]>) =>
    getDatabases().listDocuments(...args),
  getDocument: (...args: Parameters<Databases["getDocument"]>) =>
    getDatabases().getDocument(...args),
  createDocument: (...args: Parameters<Databases["createDocument"]>) =>
    getDatabases().createDocument(...args),
  updateDocument: (...args: Parameters<Databases["updateDocument"]>) =>
    getDatabases().updateDocument(...args),
  deleteDocument: (...args: Parameters<Databases["deleteDocument"]>) =>
    getDatabases().deleteDocument(...args),
};

export const account = getAccount;
export const storage = getStorage;
export { databaseId };
