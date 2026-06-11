/**
 * Local persistence — expo-sqlite. Schema per docs/rfid-jukebox-architektura.md:
 * sounds (library of imported audio files) and cards (UID → sound mapping).
 * file_path is relative to <documentDirectory>/sounds/ because the absolute
 * documentDirectory URI changes on iOS app updates.
 */
import * as SQLite from 'expo-sqlite';

import type { CardRow, Sound } from '../types';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = openAndMigrate();
  return dbPromise;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('jukeble.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS sounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT '',
      duration REAL NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cards (
      uid TEXT PRIMARY KEY,
      name TEXT,
      sound_id INTEGER REFERENCES sounds(id) ON DELETE SET NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

/* ── Sounds ───────────────────────────────────────────────── */

interface SoundDbRow {
  id: number;
  name: string;
  file_path: string;
  type: string;
  duration: number;
  created_at: string;
}

function mapSound(row: SoundDbRow): Sound {
  return {
    id: row.id,
    name: row.name,
    filePath: row.file_path,
    type: row.type,
    duration: row.duration,
    createdAt: row.created_at,
  };
}

export async function listSounds(): Promise<Sound[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<SoundDbRow>(
    'SELECT id, name, file_path, type, duration, created_at FROM sounds ORDER BY created_at DESC, id DESC'
  );
  return rows.map(mapSound);
}

export async function insertSound(name: string, filePath: string, type: string, duration: number): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    'INSERT INTO sounds (name, file_path, type, duration) VALUES (?, ?, ?, ?)',
    name,
    filePath,
    type,
    duration
  );
  return result.lastInsertRowId;
}

export async function deleteSoundRow(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM sounds WHERE id = ?', id);
}

/* ── Cards ────────────────────────────────────────────────── */

interface CardDbRow {
  uid: string;
  name: string | null;
  sound_id: number | null;
  created_at: string;
}

function mapCard(row: CardDbRow): CardRow {
  return {
    uid: row.uid,
    name: row.name ?? '',
    soundId: row.sound_id,
    createdAt: row.created_at,
  };
}

export async function listCards(): Promise<CardRow[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<CardDbRow>(
    'SELECT uid, name, sound_id, created_at FROM cards ORDER BY created_at DESC, uid DESC'
  );
  return rows.map(mapCard);
}

export async function upsertCard(uid: string, name: string, soundId: number | null): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO cards (uid, name, sound_id) VALUES (?, ?, ?)
     ON CONFLICT(uid) DO UPDATE SET name = excluded.name, sound_id = excluded.sound_id`,
    uid,
    name,
    soundId
  );
}

export async function renameCard(uid: string, name: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE cards SET name = ? WHERE uid = ?', name, uid);
}

export async function deleteCardRow(uid: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM cards WHERE uid = ?', uid);
}
