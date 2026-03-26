import Database from 'better-sqlite3';
import * as path from 'path';

export class LabelCache {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(__dirname, '..', '..', 'cache', 'labels.db');
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS image_labels (
        image_hash  TEXT NOT NULL,
        model       TEXT NOT NULL,
        label       TEXT NOT NULL,
        created_at  INTEGER NOT NULL,
        PRIMARY KEY (image_hash, model)
      );
    `);
  }

  get(hash: string, model: string): string | null {
    const row = this.db
      .prepare(
        'SELECT label FROM image_labels WHERE image_hash = ? AND model = ?'
      )
      .get(hash, model) as { label: string } | undefined;
    return row?.label ?? null;
  }

  set(hash: string, label: string, model: string): void {
    this.db
      .prepare(
        `INSERT OR REPLACE INTO image_labels
         (image_hash, model, label, created_at)
         VALUES (?, ?, ?, ?)`
      )
      .run(hash, model, label, Date.now());
  }

  clear(): void {
    this.db.exec('DELETE FROM image_labels;');
  }
}