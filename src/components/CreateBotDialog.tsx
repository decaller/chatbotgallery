import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createBotFn } from "@/lib/server-fns"
import { compressImageToBase64 } from "@/lib/image-utils"
import type { Bot, CreateBotInput } from "@/types/bot"
import {
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Palette,
  Code2,
  Upload,
  X,
  FileJson,
  Sun,
  Moon,
} from "lucide-react"

interface CreateBotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBotCreated: (newBot: Bot) => void
}

const CATEGORY_PRESETS = [
  "General",
  "Assistant",
  "RPG & Gaming",
  "Coding & Dev",
  "Productivity",
  "Education",
  "Customer Support",
]

const COLOR_PAIRS = [
  { name: "Indigo", light: "#4f46e5", dark: "#818cf8" },
  { name: "Violet", light: "#7c3aed", dark: "#a78bfa" },
  { name: "Blue", light: "#2563eb", dark: "#60a5fa" },
  { name: "Cyan", light: "#0891b2", dark: "#22d3ee" },
  { name: "Emerald", light: "#059669", dark: "#34d399" },
  { name: "Rose", light: "#e11d48", dark: "#fb7185" },
  { name: "Amber", light: "#d97706", dark: "#fbbf24" },
  { name: "Slate", light: "#475569", dark: "#94a3b8" },
]

export function CreateBotDialog({
  open,
  onOpenChange,
  onBotCreated,
}: CreateBotDialogProps) {
  const [name, setName] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")

  // Visual Customization: Cover, Avatar, and Dual Theme Colors (Light & Dark)
  const [coverUrl, setCoverUrl] = useState<string | undefined>()
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [themeColor, setThemeColor] = useState<string>("#4f46e5")
  const [themeColorDark, setThemeColorDark] = useState<string>("#818cf8")
  const [isCompressingCover, setIsCompressingCover] = useState(false)
  const [isCompressingAvatar, setIsCompressingAvatar] = useState(false)

  // n8n Workflow JSON
  const [n8nWorkflow, setN8nWorkflow] = useState<string>("")
  const [n8nFileName, setN8nFileName] = useState<string | null>(null)

  // Optional Advanced Fields
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [category, setCategory] = useState("General")
  const [apiKey, setApiKey] = useState("")
  const [initialMessage, setInitialMessage] = useState("")
  const [initialChipsText, setInitialChipsText] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const n8nFileInputRef = useRef<HTMLInputElement>(null)

  // Handle Cover File Upload & Compression
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompressingCover(true)
    try {
      const compressedBase64 = await compressImageToBase64(file, 1200, 400, 0.8)
      setCoverUrl(compressedBase64)
    } catch (err) {
      console.error("Cover compression failed:", err)
      setError("Failed to process cover image.")
    } finally {
      setIsCompressingCover(false)
    }
  }

  // Handle Avatar File Upload & Compression
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompressingAvatar(true)
    try {
      const compressedBase64 = await compressImageToBase64(file, 256, 256, 0.85)
      setAvatarUrl(compressedBase64)
    } catch (err) {
      console.error("Avatar compression failed:", err)
      setError("Failed to process avatar image.")
    } finally {
      setIsCompressingAvatar(false)
    }
  }

  // Handle n8n Workflow JSON file upload
  const handleN8nFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        JSON.parse(text)
        setN8nWorkflow(text)
        setN8nFileName(file.name)
      } catch {
        setError("The uploaded file is not a valid JSON.")
      }
    }
    reader.readAsText(file)
  }

  const applyColorPair = (pair: { light: string; dark: string }) => {
    setThemeColor(pair.light)
    setThemeColorDark(pair.dark)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !apiUrl.trim() || !author.trim() || !description.trim()) {
      setError("Please fill in all required fields (Name, API URL, Author, Description).")
      return
    }

    try {
      new URL(apiUrl.trim())
    } catch {
      setError("Please provide a valid REST API URL (including http:// or https://).")
      return
    }

    setIsLoading(true)

    try {
      const chips = initialChipsText
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)

      const payload: CreateBotInput = {
        name: name.trim(),
        apiUrl: apiUrl.trim(),
        author: author.trim(),
        description: description.trim(),
        avatarUrl,
        coverUrl,
        themeColor,
        themeColorDark,
        category: category.trim() || "General",
        apiKey: apiKey.trim() || undefined,
        initialMessage:
          initialMessage.trim() ||
          `Hello! I am ${name.trim()}. How can I assist you today?`,
        initialChips: chips.length > 0 ? chips : undefined,
        n8nWorkflow: n8nWorkflow.trim() || undefined,
      }

      const created = await createBotFn({ data: payload })
      onBotCreated(created)

      // Reset form
      setName("")
      setApiUrl("")
      setAuthor("")
      setDescription("")
      setAvatarUrl(undefined)
      setCoverUrl(undefined)
      setThemeColor("#4f46e5")
      setThemeColorDark("#818cf8")
      setApiKey("")
      setInitialMessage("")
      setInitialChipsText("")
      setN8nWorkflow("")
      setN8nFileName(null)
      setShowAdvanced(false)
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create bot."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              Add New ChatBot
            </DialogTitle>
            <DialogDescription>
              Connect an external bot hosted on n8n, Flowise, FastAPI, or any REST API endpoint.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            {/* Visual Customization: Cover Image Preview / Upload */}
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="size-3.5" />
                  Bot Cover Banner (Optional)
                </span>
                {coverUrl && (
                  <button
                    type="button"
                    onClick={() => setCoverUrl(undefined)}
                    className="text-destructive hover:underline text-[11px] flex items-center gap-0.5"
                  >
                    <X className="size-3" /> Remove Cover
                  </button>
                )}
              </label>

              {coverUrl ? (
                <div className="relative h-28 w-full overflow-hidden rounded-xl border group">
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => coverInputRef.current?.click()}
                      className="text-xs h-7"
                    >
                      Change Cover
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="flex flex-col items-center justify-center h-24 rounded-xl border border-dashed hover:border-primary/50 bg-muted/30 cursor-pointer transition-colors px-4 text-center"
                >
                  <Upload className="size-5 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">
                    {isCompressingCover ? "Compressing image..." : "Upload Cover Image"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Auto-resized & compressed (PNG, JPG, WebP)
                  </span>
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </div>

            {/* Avatar & Dual Color Theme Customization */}
            <div className="grid grid-cols-1 gap-4">
              {/* Avatar Uploader */}
              <div className="grid gap-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span>Avatar Icon</span>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(undefined)}
                      className="text-destructive text-[11px]"
                    >
                      Remove
                    </button>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-dashed hover:border-primary/50 bg-muted/40 cursor-pointer overflow-hidden"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => avatarInputRef.current?.click()}
                    className="text-xs h-8"
                  >
                    {isCompressingAvatar ? "Processing..." : "Upload Avatar"}
                  </Button>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              {/* Theme Color (Light & Dark) */}
              <div className="grid gap-2 border rounded-xl p-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold flex items-center gap-1.5">
                    <Palette className="size-3.5 text-primary" />
                    Color Customization (Light & Dark Mode)
                  </label>
                </div>

                {/* Quick Preset Pairs */}
                <div className="space-y-1">
                  <span className="text-[11px] text-muted-foreground">Quick Palette Pairs:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {COLOR_PAIRS.map((pair) => (
                      <button
                        key={pair.name}
                        type="button"
                        onClick={() => applyColorPair(pair)}
                        className={`flex items-center rounded-full p-0.5 border shadow-xs transition-transform ${
                          themeColor === pair.light && themeColorDark === pair.dark
                            ? "ring-2 ring-primary scale-105"
                            : "hover:scale-105"
                        }`}
                        title={`${pair.name} (Light: ${pair.light}, Dark: ${pair.dark})`}
                      >
                        <span
                          className="size-4 rounded-l-full"
                          style={{ backgroundColor: pair.light }}
                        />
                        <span
                          className="size-4 rounded-r-full"
                          style={{ backgroundColor: pair.dark }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Individual Color Pickers */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
                    <Sun className="size-4 text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-muted-foreground font-medium">Light Mode</div>
                      <div className="text-xs font-mono truncate">{themeColor}</div>
                    </div>
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="size-7 rounded cursor-pointer border-0 bg-transparent p-0"
                      title="Light Mode Color"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
                    <Moon className="size-4 text-indigo-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-muted-foreground font-medium">Dark Mode</div>
                      <div className="text-xs font-mono truncate">{themeColorDark}</div>
                    </div>
                    <input
                      type="color"
                      value={themeColorDark}
                      onChange={(e) => setThemeColorDark(e.target.value)}
                      className="size-7 rounded cursor-pointer border-0 bg-transparent p-0"
                      title="Dark Mode Color"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Fields */}
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Bot Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                placeholder="e.g. Code Reviewer Bot, Dungeon Master AI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="apiUrl" className="text-sm font-medium">
                REST API / Webhook URL <span className="text-destructive">*</span>
              </label>
              <Input
                id="apiUrl"
                placeholder="https://n8n.yourserver.com/webhook/chat-endpoint"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Payload sent via POST: <code className="rounded bg-muted px-1">{"{ message, sessionId, chatHistory }"}</code>
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="author" className="text-sm font-medium">
                Maker / Author Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="author"
                placeholder="e.g. Alex, @devguru"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Bot Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="What does this bot do? Describe its features or persona..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
              />
            </div>

            {/* Optional n8n Workflow JSON Section */}
            <div className="grid gap-2 border rounded-xl p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Code2 className="size-4 text-primary" />
                  Share n8n Workflow JSON (Optional)
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => n8nFileInputRef.current?.click()}
                  className="text-xs h-7 gap-1"
                >
                  <FileJson className="size-3.5" />
                  Upload .json
                </Button>
                <input
                  ref={n8nFileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleN8nFileUpload}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Allow other makers and learners to view and download your n8n workflow template.
              </p>
              {n8nFileName && (
                <div className="flex items-center justify-between rounded bg-muted px-2 py-1 text-xs">
                  <span>File: {n8nFileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setN8nFileName(null)
                      setN8nWorkflow("")
                    }}
                    className="text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
              <Textarea
                placeholder="Or paste exported n8n workflow JSON directly here..."
                value={n8nWorkflow}
                onChange={(e) => setN8nWorkflow(e.target.value)}
                rows={2}
                className="font-mono text-xs"
              />
            </div>

            {/* Advanced / Optional Settings Toggle */}
            <div className="border-t pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground hover:text-foreground py-1"
              >
                <span>More Advanced Settings (API Keys, Categories, Greetings)</span>
                {showAdvanced ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>

              {showAdvanced && (
                <div className="grid gap-3 pt-3">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      {CATEGORY_PRESETS.map((cat) => (
                        <Badge
                          key={cat}
                          variant={category === cat ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => setCategory(cat)}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <label htmlFor="apiKey" className="text-xs font-medium text-muted-foreground">
                      API Key / Bearer Token (Optional)
                    </label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Optional Authorization token for your webhook"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label htmlFor="initialMessage" className="text-xs font-medium text-muted-foreground">
                      Initial Greeting Message (Optional)
                    </label>
                    <Input
                      id="initialMessage"
                      placeholder="e.g. Welcome! Ask me any question to get started."
                      value={initialMessage}
                      onChange={(e) => setInitialMessage(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label htmlFor="initialChips" className="text-xs font-medium text-muted-foreground">
                      Suggested Starting Prompts (Comma-separated)
                    </label>
                    <Input
                      id="initialChips"
                      placeholder="e.g. How does this work?, Tell me a joke, Give me examples"
                      value={initialChipsText}
                      onChange={(e) => setInitialChipsText(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isCompressingCover || isCompressingAvatar}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Bot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
