import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const defaultDbPath = resolve(__dirname, "chatbotgallery", "local.db")
const dbUrl = process.env.DATABASE_URL || `file:${defaultDbPath}`
const sampleBotsPath = resolve(__dirname, "sample_bots.json")

// Load createClient robustly
let createClient
try {
  const mod = await import("@libsql/client")
  createClient = mod.createClient
} catch {
  const mod = await import("./chatbotgallery/node_modules/@libsql/client/lib-esm/node.js")
  createClient = mod.createClient
}

const db = createClient({
  url: dbUrl,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function seed() {
  console.log(`📡 Connecting to database at ${dbUrl}...`)

  // 1. Ensure tables exist
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

  // 2. Read sample bots
  const data = JSON.parse(readFileSync(sampleBotsPath, "utf-8"))
  const bots = data.bots || []
  console.log(`🤖 Found ${bots.length} sample bots in ${sampleBotsPath}`)

  const now = Date.now()

  for (const bot of bots) {
    const chipsJson = JSON.stringify(bot.initialChips || [])
    const versionId = `ver_${bot.id}_1`

    // Check if bot already exists
    const existing = await db.execute({
      sql: `SELECT id FROM bots WHERE id = ?`,
      args: [bot.id],
    })

    if (existing.rows.length === 0) {
      console.log(`➕ Inserting bot: ${bot.name} (${bot.id})`)
      await db.execute({
        sql: `
          INSERT INTO bots (
            id, name, description, author, api_url, api_key, avatar_url, cover_url,
            theme_color, theme_color_dark, category, initial_message, initial_chips,
            n8n_workflow, current_version, play_count, is_featured, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?, ?
          )
        `,
        args: [
          bot.id,
          bot.name,
          bot.description,
          bot.author,
          bot.apiUrl,
          bot.apiKey || null,
          bot.avatarUrl || null,
          bot.coverUrl || null,
          bot.themeColor || "#4f46e5",
          bot.themeColorDark || "#818cf8",
          bot.category || "General",
          bot.initialMessage || "Hello!",
          chipsJson,
          bot.n8nWorkflow || null,
          bot.isFeatured ? 1 : 0,
          now,
          now,
        ],
      })

      await db.execute({
        sql: `
          INSERT INTO bot_versions (
            id, bot_id, version, author, change_summary, name, description,
            api_url, api_key, avatar_url, cover_url, theme_color, theme_color_dark,
            category, initial_message, initial_chips, n8n_workflow, play_count, created_at
          ) VALUES (
            ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?
          )
        `,
        args: [
          versionId,
          bot.id,
          bot.author,
          bot.changeSummary || "Initial release",
          bot.name,
          bot.description,
          bot.apiUrl,
          bot.apiKey || null,
          bot.avatarUrl || null,
          bot.coverUrl || null,
          bot.themeColor || "#4f46e5",
          bot.themeColorDark || "#818cf8",
          bot.category || "General",
          bot.initialMessage || "Hello!",
          chipsJson,
          bot.n8nWorkflow || null,
          now,
        ],
      })
    } else {
      console.log(`🔄 Bot ${bot.name} (${bot.id}) already exists, updating...`)
      await db.execute({
        sql: `
          UPDATE bots SET
            name = ?, description = ?, author = ?, api_url = ?, api_key = ?,
            avatar_url = ?, cover_url = ?, theme_color = ?, theme_color_dark = ?,
            category = ?, initial_message = ?, initial_chips = ?, n8n_workflow = ?,
            is_featured = ?, updated_at = ?
          WHERE id = ?
        `,
        args: [
          bot.name,
          bot.description,
          bot.author,
          bot.apiUrl,
          bot.apiKey || null,
          bot.avatarUrl || null,
          bot.coverUrl || null,
          bot.themeColor || "#4f46e5",
          bot.themeColorDark || "#818cf8",
          bot.category || "General",
          bot.initialMessage || "Hello!",
          chipsJson,
          bot.n8nWorkflow || null,
          bot.isFeatured ? 1 : 0,
          now,
          bot.id,
        ],
      })
    }
  }

  console.log("✅ Seed completed successfully!")
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
