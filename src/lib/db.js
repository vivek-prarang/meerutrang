import Database from 'better-sqlite3';
import path from 'path';

let db;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'visitors.db');

    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');

    // Initialize tables
    initializeTables();
  }

  return db;
}

function initializeTables() {
  const createVisitorsTable = `
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT NOT NULL,
      date TEXT NOT NULL,
      visit_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(page, date)
    )
  `;

  const createVisitsTable = `
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT NOT NULL,
      date TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createVisitorsTable);
  db.exec(createVisitsTable);
}

export function recordVisit(page, ipAddress = null, userAgent = null) {
  const db = getDatabase();
  const today = getToday();

  try {
    // Insert into visits log
    const insertVisit = db.prepare(`
      INSERT INTO visits (page, date, ip_address, user_agent)
      VALUES (?, ?, ?, ?)
    `);
    insertVisit.run(page, today, ipAddress, userAgent);

    // Update or insert daily count
    const updateVisitor = db.prepare(`
      INSERT INTO visitors (page, date, visit_count, updated_at)
      VALUES (?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(page, date) DO UPDATE SET
        visit_count = visit_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `);
    updateVisitor.run(page, today);

    return true;
  } catch (error) {
    console.error('Error recording visit:', error);
    return false;
  }
}

export function getTodayVisitors(page = null) {
  const db = getDatabase();
  const today = getToday();

  try {
    let query = `
      SELECT page, visit_count, updated_at
      FROM visitors
      WHERE date = ?
    `;

    let params = [today];

    if (page) {
      query += ` AND page = ?`;
      params.push(page);
    }

    query += ` ORDER BY page ASC`;

    const stmt = db.prepare(query);
    const results = stmt.all(...params);

    return results;
  } catch (error) {
    console.error('Error fetching today visitors:', error);
    return [];
  }
}

export function getTotalTodayVisitors() {
  const db = getDatabase();
  const today = getToday();

  try {
    const stmt = db.prepare(`
      SELECT SUM(visit_count) as total
      FROM visitors
      WHERE date = ?
    `);

    const result = stmt.get(today);
    return result?.total || 0;
  } catch (error) {
    console.error('Error fetching total today visitors:', error);
    return 0;
  }
}

export function getAllVisitorsHistory(limit = 30) {
  const db = getDatabase();
  try {
    const stmt = db.prepare(`
      SELECT page, date, visit_count, updated_at
      FROM visitors
      ORDER BY date DESC, page ASC
      LIMIT ?
    `);

    return stmt.all(limit);
  } catch (error) {
    console.error('Error fetching visitors history:', error);
    return [];
  }
}

export function getVisitorStats(page, days = 7) {
  const db = getDatabase();
  try {
    const stmt = db.prepare(`
      SELECT date, visit_count
      FROM visitors
      WHERE page = ?
      ORDER BY date DESC
      LIMIT ?
    `);

    return stmt.all(page, days);
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return [];
  }
}

export function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
