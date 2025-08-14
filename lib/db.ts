import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPath = path.resolve(process.cwd(), "data", "accounts.db");

export async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER,
      gender TEXT,
      description TEXT,
      password TEXT NOT NULL,
      token TEXT
    )
  `);

  // Seed users if none exist
  const row = await db.get("SELECT COUNT(*) as count FROM accounts");
  if (row.count === 0) {
    await db.run(
      `INSERT INTO accounts (role, name, email, age, gender, description, password, token) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "patient",
        "John Doe",
        "john@example.com",
        30,
        "male",
        "Just a test patient",
        "password123",
        null,
      ]
    );
    await db.run(
      `INSERT INTO accounts (role, name, email, password, token) VALUES
      (?, ?, ?, ?, ?)`,
      ["doctor", "Dr. Smith", "smith@hospital.com", "docpass", "hXL5iocF99"]
    );
    await db.run(
      `INSERT INTO accounts (role, name, email, password, token) VALUES
      (?, ?, ?, ?, ?)`,
      ["nurse", "Nurse Nancy", "nancy@hospital.com", "nursepass", "hXL5iocF99"]
    );
  }
  return db;
}
