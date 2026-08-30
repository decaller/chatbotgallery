import { createClient } from "@libsql/client"

// Use DATABASE_URL from environment or fallback to local SQLite file
const dbUrl = process.env.DATABASE_URL || "file:./local.db"
const dbAuthToken = process.env.DATABASE_AUTH_TOKEN

export const db = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
})

let isInitialized = false

export async function ensureDbInitialized() {
  if (isInitialized) return

  // 1. Bots main table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bots (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      author TEXT NOT NULL,
      api_url TEXT NOT NULL,
      api_key TEXT,
      avatar_url TEXT,
      cover_url TEXT,
      theme_color TEXT DEFAULT '#4f46e5',
      theme_color_dark TEXT DEFAULT '#818cf8',
      category TEXT DEFAULT 'General',
      initial_message TEXT DEFAULT 'Hello! How can I assist you today?',
      initial_chips TEXT DEFAULT '[]',
      n8n_workflow TEXT,
      current_version INTEGER DEFAULT 1,
      play_count INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `)

  // 2. Bot Versions (Timeline history table with separate play counts)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bot_versions (
      id TEXT PRIMARY KEY,
      bot_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      author TEXT NOT NULL,
      change_summary TEXT DEFAULT 'Update',
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      api_url TEXT NOT NULL,
      api_key TEXT,
      avatar_url TEXT,
      cover_url TEXT,
      theme_color TEXT DEFAULT '#4f46e5',
      theme_color_dark TEXT DEFAULT '#818cf8',
      category TEXT DEFAULT 'General',
      initial_message TEXT DEFAULT 'Hello! How can I assist you today?',
      initial_chips TEXT DEFAULT '[]',
      n8n_workflow TEXT,
      play_count INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `)

  // Safe migration for columns if table already existed
  const columnsToAdd = [
    { name: "cover_url", type: "TEXT" },
    { name: "theme_color", type: "TEXT DEFAULT '#4f46e5'" },
    { name: "theme_color_dark", type: "TEXT DEFAULT '#818cf8'" },
    { name: "n8n_workflow", type: "TEXT" },
    { name: "current_version", type: "INTEGER DEFAULT 1" },
  ]

  for (const col of columnsToAdd) {
    try {
      await db.execute(`ALTER TABLE bots ADD COLUMN ${col.name} ${col.type}`)
    } catch {
      // Column already exists
    }
  }

  // Seed any existing bots without versions into bot_versions as version 1
  try {
    const existingBots = await db.execute(`SELECT * FROM bots`)
    for (const row of existingBots.rows) {
      const botId = String(row.id)
      const versionsCount = await db.execute({
        sql: `SELECT COUNT(*) as count FROM bot_versions WHERE bot_id = ?`,
        args: [botId],
      })
      const count = Number(versionsCount.rows[0]?.count || 0)
      if (count === 0) {
        await db.execute({
          sql: `
            INSERT INTO bot_versions (
              id, bot_id, version, author, change_summary, name, description, api_url, api_key, avatar_url, cover_url, theme_color, theme_color_dark, category, initial_message, initial_chips, n8n_workflow, play_count, created_at
            ) VALUES (
              ?, ?, 1, ?, 'Initial release', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
          `,
          args: [
            `ver_${botId}_1`,
            botId,
            String(row.author || "Community"),
            String(row.name || "Bot"),
            String(row.description || ""),
            String(row.api_url || ""),
            row.api_key ? String(row.api_key) : null,
            row.avatar_url ? String(row.avatar_url) : null,
            row.cover_url ? String(row.cover_url) : null,
            row.theme_color ? String(row.theme_color) : "#4f46e5",
            row.theme_color_dark ? String(row.theme_color_dark) : "#818cf8",
            String(row.category || "General"),
            String(row.initial_message || "Hello!"),
            String(row.initial_chips || "[]"),
            row.n8n_workflow ? String(row.n8n_workflow) : null,
            Number(row.play_count || 0),
            Number(row.created_at || Date.now()),
          ],
        })
      }
    }
  } catch (err) {
    console.error("Failed to seed initial bot versions:", err)
  }

  isInitialized = true
}
