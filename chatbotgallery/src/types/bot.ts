export interface BotVersion {
  id: string
  botId: string
  version: number
  author: string
  changeSummary: string
  name: string
  description: string
  apiUrl: string
  apiKey?: string
  avatarUrl?: string
  coverUrl?: string
  themeColor?: string
  themeColorDark?: string
  category: string
  initialMessage: string
  initialChips: string[]
  n8nWorkflow?: string
  playCount: number
  createdAt: number
}

export interface Bot {
  id: string
  name: string
  description: string
  author: string
  apiUrl: string
  apiKey?: string
  avatarUrl?: string
  coverUrl?: string
  themeColor?: string
  themeColorDark?: string
  category: string
  initialMessage: string
  initialChips: string[]
  n8nWorkflow?: string
  currentVersion: number
  playCount: number // Total play count across all versions
  versionPlayCount: number // Play count for the active/current version
  isFeatured?: boolean
  createdAt: number
  updatedAt: number
  latestVersionId?: string
}

export interface CreateBotInput {
  name: string
  apiUrl: string
  author: string
  description: string
  apiKey?: string
  avatarUrl?: string
  coverUrl?: string
  themeColor?: string
  themeColorDark?: string
  category?: string
  initialMessage?: string
  initialChips?: string[]
  n8nWorkflow?: string
  changeSummary?: string
}

export interface EditBotInput {
  botId: string
  name: string
  apiUrl: string
  author: string
  description: string
  apiKey?: string
  avatarUrl?: string
  coverUrl?: string
  themeColor?: string
  themeColorDark?: string
  category?: string
  initialMessage?: string
  initialChips?: string[]
  n8nWorkflow?: string
  changeSummary: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: number
  chips?: string[]
}

export interface ChatResponsePayload {
  content: string
  chips?: string[]
  error?: string
}
