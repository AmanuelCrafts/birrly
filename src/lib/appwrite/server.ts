import { Client, Account, Databases, Storage, type Models } from "appwrite";

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
      _client.headers["X-Appwrite-Key"] = apiKey;
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

// Lazily-initialized service proxies with proper typing
class DatabasesProxy {
  listDocuments(databaseId: string, tableId: string, queries?: string[]) {
    return getDatabases().listDocuments(databaseId, tableId, queries);
  }
  getDocument(databaseId: string, tableId: string, documentId: string) {
    return getDatabases().getDocument(databaseId, tableId, documentId);
  }
  createDocument(
    databaseId: string,
    tableId: string,
    documentId: string,
    data: Record<string, unknown>
  ) {
    return getDatabases().createDocument(databaseId, tableId, documentId, data);
  }
  updateDocument(
    databaseId: string,
    tableId: string,
    documentId: string,
    data: Record<string, unknown>
  ) {
    return getDatabases().updateDocument(databaseId, tableId, documentId, data);
  }
  deleteDocument(databaseId: string, tableId: string, documentId: string) {
    return getDatabases().deleteDocument(databaseId, tableId, documentId);
  }
}

class AccountProxy {
  get() {
    return getAccount().get();
  }
  create(userId: string, email: string, password: string, name?: string) {
    return getAccount().create(userId, email, password, name);
  }
}

class StorageProxy {
  getFile(bucketId: string, fileId: string) {
    return getStorage().getFile(bucketId, fileId);
  }
  getFileDownload(bucketId: string, fileId: string) {
    return getStorage().getFileDownload(bucketId, fileId);
  }
  getFilePreview(bucketId: string, fileId: string) {
    return getStorage().getFilePreview(bucketId, fileId);
  }
  getFileView(bucketId: string, fileId: string) {
    return getStorage().getFileView(bucketId, fileId);
  }
}

export const databases = new DatabasesProxy();
export const account = new AccountProxy();
export const storage = new StorageProxy();
export { databaseId };
