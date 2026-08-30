import { createServerFn } from "@tanstack/react-start"
import { db, ensureDbInitialized } from "./db"
import type {
  Bot,
  BotVersion,
  CreateBotInput,
  EditBotInput,
  ChatResponsePayload,
} from "@/types/bot"

export const getBotsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Bot[]> => {
    await ensureDbInitialized()
    const result = await db.execute(`
      SELECT * FROM bots ORDER BY is_featured DESC, play_count DESC, updated_at DESC
    `)

    const bots: Bot[] = []

    for (const row of result.rows) {
      const botId = String(row.id)
      const currentVersionNum = Number(row.current_version || 1)

      // Fetch the latest version row for accurate per-version fields
      const versionResult = await db.execute({
        sql: `SELECT * FROM bot_versions WHERE bot_id = ? AND version = ?`,
        args: [botId, currentVersionNum],
      })

      const verRow = versionResult.rows[0] || row

      bots.push({
        id: botId,
        name: String(verRow.name || row.name),
        description: String(verRow.description || row.description),
        author: String(verRow.author || row.author),
        apiUrl: String(verRow.api_url || row.api_url),
        apiKey: verRow.api_key ? String(verRow.api_key) : undefined,
        avatarUrl: verRow.avatar_url ? String(verRow.avatar_url) : undefined,
        coverUrl: verRow.cover_url ? String(verRow.cover_url) : undefined,
        themeColor: verRow.theme_color ? String(verRow.theme_color) : "#4f46e5",
        themeColorDark: verRow.theme_color_dark ? String(verRow.theme_color_dark) : "#818cf8",
        category: String(verRow.category || row.category || "General"),
        initialMessage: String(
          verRow.initial_message || row.initial_message || "Hello! How can I assist you today?"
        ),
        initialChips: verRow.initial_chips
          ? (JSON.parse(String(verRow.initial_chips)) as string[])
          : [],
        n8nWorkflow: verRow.n8n_workflow ? String(verRow.n8n_workflow) : undefined,
        currentVersion: currentVersionNum,
        playCount: Number(row.play_count || 0),
        versionPlayCount: Number(verRow.play_count || 0),
        isFeatured: Boolean(row.is_featured),
        createdAt: Number(row.created_at),
        updatedAt: Number(row.updated_at),
        latestVersionId: verRow.id ? String(verRow.id) : undefined,
      })
    }

    return bots
  }
)

export const getBotVersionsFn = createServerFn({ method: "POST" })
  .validator((input: { botId: string }) => input)
  .handler(async ({ data }): Promise<BotVersion[]> => {
    await ensureDbInitialized()

    const result = await db.execute({
      sql: `SELECT * FROM bot_versions WHERE bot_id = ? ORDER BY version DESC`,
      args: [data.botId],
    })

    return result.rows.map((row) => ({
      id: String(row.id),
      botId: String(row.bot_id),
      version: Number(row.version),
      author: String(row.author),
      changeSummary: String(row.change_summary || "Update"),
      name: String(row.name),
      description: String(row.description),
      apiUrl: String(row.api_url),
      apiKey: row.api_key ? String(row.api_key) : undefined,
      avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
      coverUrl: row.cover_url ? String(row.cover_url) : undefined,
      themeColor: row.theme_color ? String(row.theme_color) : "#4f46e5",
      themeColorDark: row.theme_color_dark ? String(row.theme_color_dark) : "#818cf8",
      category: String(row.category || "General"),
      initialMessage: String(row.initial_message || "Hello!"),
      initialChips: row.initial_chips
        ? (JSON.parse(String(row.initial_chips)) as string[])
        : [],
      n8nWorkflow: row.n8n_workflow ? String(row.n8n_workflow) : undefined,
      playCount: Number(row.play_count || 0),
      createdAt: Number(row.created_at),
    }))
  })

export const createBotFn = createServerFn({ method: "POST" })
  .validator((input: CreateBotInput) => input)
  .handler(async ({ data }): Promise<Bot> => {
    await ensureDbInitialized()

    const id = `bot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const versionId = `ver_${id}_1`
    const now = Date.now()
    const chipsJson = JSON.stringify(data.initialChips || [])

    // 1. Insert into bots
    await db.execute({
      sql: `
        INSERT INTO bots (
          id, name, description, author, api_url, api_key, avatar_url, cover_url, theme_color, theme_color_dark, category, initial_message, initial_chips, n8n_workflow, current_version, play_count, is_featured, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, ?, ?
        )
      `,
      args: [
        id,
        data.name.trim(),
        data.description.trim(),
        data.author.trim(),
        data.apiUrl.trim(),
        data.apiKey ? data.apiKey.trim() : null,
        data.avatarUrl || null,
        data.coverUrl || null,
        data.themeColor || "#4f46e5",
        data.themeColorDark || "#818cf8",
        data.category ? data.category.trim() : "General",
        data.initialMessage ? data.initialMessage.trim() : "Hello! How can I assist you today?",
        chipsJson,
        data.n8nWorkflow ? data.n8nWorkflow.trim() : null,
        now,
        now,
      ],
    })

    // 2. Insert into bot_versions as v1
    await db.execute({
      sql: `
        INSERT INTO bot_versions (
          id, bot_id, version, author, change_summary, name, description, api_url, api_key, avatar_url, cover_url, theme_color, theme_color_dark, category, initial_message, initial_chips, n8n_workflow, play_count, created_at
        ) VALUES (
          ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?
        )
      `,
      args: [
        versionId,
        id,
        data.author.trim(),
        data.changeSummary?.trim() || "Initial Release (v1)",
        data.name.trim(),
        data.description.trim(),
        data.apiUrl.trim(),
        data.apiKey ? data.apiKey.trim() : null,
        data.avatarUrl || null,
        data.coverUrl || null,
        data.themeColor || "#4f46e5",
        data.themeColorDark || "#818cf8",
        data.category ? data.category.trim() : "General",
        data.initialMessage ? data.initialMessage.trim() : "Hello! How can I assist you today?",
        chipsJson,
        data.n8nWorkflow ? data.n8nWorkflow.trim() : null,
        now,
      ],
    })

    return {
      id,
      name: data.name.trim(),
      description: data.description.trim(),
      author: data.author.trim(),
      apiUrl: data.apiUrl.trim(),
      apiKey: data.apiKey?.trim(),
      avatarUrl: data.avatarUrl,
      coverUrl: data.coverUrl,
      themeColor: data.themeColor || "#4f46e5",
      themeColorDark: data.themeColorDark || "#818cf8",
      category: data.category?.trim() || "General",
      initialMessage: data.initialMessage?.trim() || "Hello! How can I assist you today?",
      initialChips: data.initialChips || [],
      n8nWorkflow: data.n8nWorkflow?.trim(),
      currentVersion: 1,
      playCount: 0,
      versionPlayCount: 0,
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
      latestVersionId: versionId,
    }
  })

export const editBotFn = createServerFn({ method: "POST" })
  .validator((input: EditBotInput) => input)
  .handler(async ({ data }): Promise<Bot> => {
    await ensureDbInitialized()

    const botResult = await db.execute({
      sql: "SELECT * FROM bots WHERE id = ?",
      args: [data.botId],
    })

    if (botResult.rows.length === 0) {
      throw new Error("Bot not found.")
    }

    const currentBot = botResult.rows[0]
    const nextVersion = Number(currentBot.current_version || 1) + 1
    const versionId = `ver_${data.botId}_${nextVersion}`
    const now = Date.now()
    const chipsJson = JSON.stringify(data.initialChips || [])

    // 1. Insert new version record into bot_versions with initial play_count = 0
    await db.execute({
      sql: `
        INSERT INTO bot_versions (
          id, bot_id, version, author, change_summary, name, description, api_url, api_key, avatar_url, cover_url, theme_color, theme_color_dark, category, initial_message, initial_chips, n8n_workflow, play_count, created_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?
        )
      `,
      args: [
        versionId,
        data.botId,
        nextVersion,
        data.author.trim(),
        data.changeSummary?.trim() || `Revision v${nextVersion}`,
        data.name.trim(),
        data.description.trim(),
        data.apiUrl.trim(),
        data.apiKey ? data.apiKey.trim() : null,
        data.avatarUrl || null,
        data.coverUrl || null,
        data.themeColor || "#4f46e5",
        data.themeColorDark || "#818cf8",
        data.category ? data.category.trim() : "General",
        data.initialMessage ? data.initialMessage.trim() : "Hello!",
        chipsJson,
        data.n8nWorkflow ? data.n8nWorkflow.trim() : null,
        now,
      ],
    })

    // 2. Update master bot record
    await db.execute({
      sql: `
        UPDATE bots SET
          name = ?,
          description = ?,
          author = ?,
          api_url = ?,
          api_key = ?,
          avatar_url = ?,
          cover_url = ?,
          theme_color = ?,
          theme_color_dark = ?,
          category = ?,
          initial_message = ?,
          initial_chips = ?,
          n8n_workflow = ?,
          current_version = ?,
          updated_at = ?
        WHERE id = ?
      `,
      args: [
        data.name.trim(),
        data.description.trim(),
        data.author.trim(),
        data.apiUrl.trim(),
        data.apiKey ? data.apiKey.trim() : null,
        data.avatarUrl || null,
        data.coverUrl || null,
        data.themeColor || "#4f46e5",
        data.themeColorDark || "#818cf8",
        data.category ? data.category.trim() : "General",
        data.initialMessage ? data.initialMessage.trim() : "Hello!",
        chipsJson,
        data.n8nWorkflow ? data.n8nWorkflow.trim() : null,
        nextVersion,
        now,
        data.botId,
      ],
    })

    return {
      id: data.botId,
      name: data.name.trim(),
      description: data.description.trim(),
      author: data.author.trim(),
      apiUrl: data.apiUrl.trim(),
      apiKey: data.apiKey?.trim(),
      avatarUrl: data.avatarUrl,
      coverUrl: data.coverUrl,
      themeColor: data.themeColor || "#4f46e5",
      themeColorDark: data.themeColorDark || "#818cf8",
      category: data.category?.trim() || "General",
      initialMessage: data.initialMessage?.trim() || "Hello!",
      initialChips: data.initialChips || [],
      n8nWorkflow: data.n8nWorkflow?.trim(),
      currentVersion: nextVersion,
      playCount: Number(currentBot.play_count || 0),
      versionPlayCount: 0,
      isFeatured: Boolean(currentBot.is_featured),
      createdAt: Number(currentBot.created_at),
      updatedAt: now,
      latestVersionId: versionId,
    }
  })

export const deleteBotFn = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    await ensureDbInitialized()
    await db.execute({
      sql: "DELETE FROM bot_versions WHERE bot_id = ?",
      args: [data.id],
    })
    await db.execute({
      sql: "DELETE FROM bots WHERE id = ?",
      args: [data.id],
    })
    return { success: true }
  })

export const sendChatMessageFn = createServerFn({ method: "POST" })
  .validator(
    (input: {
      botId: string
      version?: number
      message: string
      sessionId: string
      chatHistory: Array<{ role: string; content: string }>
    }) => input
  )
  .handler(async ({ data }): Promise<ChatResponsePayload> => {
    await ensureDbInitialized()

    let targetVersion = data.version

    if (!targetVersion) {
      const botCheck = await db.execute({
        sql: "SELECT current_version FROM bots WHERE id = ?",
        args: [data.botId],
      })
      if (botCheck.rows.length === 0) {
        return { content: "Error: Bot not found in gallery.", error: "Bot not found" }
      }
      targetVersion = Number(botCheck.rows[0].current_version || 1)
    }

    // Lookup specific version
    const versionResult = await db.execute({
      sql: "SELECT * FROM bot_versions WHERE bot_id = ? AND version = ?",
      args: [data.botId, targetVersion],
    })

    if (versionResult.rows.length === 0) {
      return {
        content: `Error: Version v${targetVersion} of this bot was not found.`,
        error: "Version not found",
      }
    }

    const botVersion = versionResult.rows[0]
    const apiUrl = String(botVersion.api_url)
    const apiKey = botVersion.api_key ? String(botVersion.api_key) : null

    // Increment play count on BOTH the specific version AND the master bot
    db.execute({
      sql: "UPDATE bot_versions SET play_count = play_count + 1 WHERE bot_id = ? AND version = ?",
      args: [data.botId, targetVersion],
    }).catch(console.error)

    db.execute({
      sql: "UPDATE bots SET play_count = play_count + 1 WHERE id = ?",
      args: [data.botId],
    }).catch(console.error)

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      }

      if (apiKey) {
        if (apiKey.toLowerCase().startsWith("bearer ")) {
          headers["Authorization"] = apiKey
        } else {
          headers["Authorization"] = `Bearer ${apiKey}`
        }
      }

      const requestBody = {
        message: data.message,
        sessionId: data.sessionId,
        botId: data.botId,
        version: targetVersion,
        chatHistory: data.chatHistory,
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text().catch(() => "")
        return {
          content: `Server returned error (${response.status}): ${errorText || response.statusText}`,
          error: `HTTP ${response.status}`,
        }
      }

      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        const json = await response.json()

        let textContent = ""
        let suggestedChips: string[] | undefined

        let dataObj = json
        if (typeof dataObj === "string") {
          try {
            const parsed = JSON.parse(dataObj)
            if (parsed && typeof parsed === "object") {
              dataObj = parsed
            } else {
              textContent = dataObj
            }
          } catch {
            textContent = dataObj
          }
        }

        if (typeof dataObj === "object" && dataObj !== null) {
          if (dataObj.content && typeof dataObj.content === "string") {
            textContent = dataObj.content
          } else if (dataObj.response && typeof dataObj.response === "string") {
            textContent = dataObj.response
          } else if (dataObj.output && typeof dataObj.output === "string") {
            textContent = dataObj.output
          } else if (dataObj.text && typeof dataObj.text === "string") {
            textContent = dataObj.text
          } else if (dataObj.message) {
            if (typeof dataObj.message === "string") {
              textContent = dataObj.message
            } else if (typeof dataObj.message.content === "string") {
              textContent = dataObj.message.content
            }
          } else if (Array.isArray(dataObj) && dataObj[0]) {
            const first = dataObj[0]
            textContent =
              first.content ||
              first.output ||
              first.response ||
              first.text ||
              first.message ||
              JSON.stringify(first)
            if (Array.isArray(first.chips)) {
              suggestedChips = first.chips.map(String)
            }
          } else if (dataObj.data && typeof dataObj.data === "string") {
            textContent = dataObj.data
          } else {
            textContent = JSON.stringify(dataObj, null, 2)
          }

          if (Array.isArray(dataObj.chips)) {
            suggestedChips = dataObj.chips.map(String)
          } else if (Array.isArray(dataObj.suggestions)) {
            suggestedChips = dataObj.suggestions.map(String)
          } else if (Array.isArray(dataObj.quickReplies)) {
            suggestedChips = dataObj.quickReplies.map(String)
          }
        }

        // Safety fallback: If textContent is a JSON-serialized string with { content, chips }
        if (
          typeof textContent === "string" &&
          textContent.trim().startsWith("{") &&
          textContent.trim().endsWith("}")
        ) {
          try {
            const parsedInner = JSON.parse(textContent)
            if (parsedInner && typeof parsedInner === "object" && parsedInner.content) {
              textContent = parsedInner.content
              if (Array.isArray(parsedInner.chips) && !suggestedChips) {
                suggestedChips = parsedInner.chips.map(String)
              }
            }
          } catch {
            // Keep textContent as raw string
          }
        }

        return {
          content: textContent || "No response text received from bot.",
          chips: suggestedChips,
        }
      } else {
        const rawText = await response.text()
        return {
          content: rawText || "Empty response from bot.",
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      return {
        content: `Failed to connect to bot endpoint (v${targetVersion}): ${errorMsg}. Please verify the webhook URL and server status.`,
        error: errorMsg,
      }
    }
  })
