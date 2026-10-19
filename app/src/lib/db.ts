// Module 1: IndexedDB 数据库封装（使用 idb 包简化异步 API）
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { MistakeItem } from '../types';

interface MistakeDB extends DBSchema {
  mistakes: {
    key: string;
    value: MistakeItem;
    indexes: { subject: string; status: string; createdAt: number };
  };
}

const DB_NAME = 'ChildMistakeBookDB';
const DB_VERSION = 1;
const STORE_NAME = 'mistakes';

let dbPromise: Promise<IDBPDatabase<MistakeDB>> | null = null;

function getDB(): Promise<IDBPDatabase<MistakeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MistakeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('subject', 'subject');
          store.createIndex('status', 'status');
          store.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function dbGetAllMistakes(): Promise<MistakeItem[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function dbSaveMistake(item: MistakeItem): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, item);
}

export async function dbDeleteMistake(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function dbClearAll(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
