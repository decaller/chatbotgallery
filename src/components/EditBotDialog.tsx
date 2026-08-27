import { useState, useRef, useEffect } from "react"
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
import { editBotFn } from "@/lib/server-fns"
import { compressImageToBase64 } from "@/lib/image-utils"
import type { Bot, EditBotInput } from "@/types/bot"
import {
  Loader2,
  Edit3,
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
  GitCommit,
} from "lucide-react"

interface EditBotDialogProps {
  bot: Bot | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onBotUpdated: (updatedBot: Bot) => void
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

export function EditBotDialog({
  bot,
  open,
  onOpenChange,
  onBotUpdated,
}: EditBotDialogProps) {
  const [name, setName] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [changeSummary, setChangeSummary] = useState("")

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

  useEffect(() => {
    if (bot && open) {
      setName(bot.name)
      setApiUrl(bot.apiUrl)
      setAuthor(bot.author)
      setDescription(bot.description)
      setCoverUrl(bot.coverUrl)
      setAvatarUrl(bot.avatarUrl)
      setThemeColor(bot.themeColor || "#4f46e5")
      setThemeColorDark(bot.themeColorDark || "#818cf8")
      setCategory(bot.category || "General")
      setApiKey(bot.apiKey || "")
      setInitialMessage(bot.initialMessage || "")
      setInitialChipsText((bot.initialChips || []).join(", "))
      setN8nWorkflow(bot.n8nWorkflow || "")
      setChangeSummary(`Updated configuration for v${(bot.currentVersion || 1) + 1}`)
    }
  }, [bot, open])

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
    if (!bot) return
    setError(null)

    if (!name.trim() || !apiUrl.trim() || !author.trim() || !description.trim()) {
      setError("Please fill in all required fields.")
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

      const payload: EditBotInput = {
        botId: bot.id,
        name: name.trim(),
        apiUrl: apiUrl.trim(),
        author: author.trim(),
        description: description.trim(),
        changeSummary: changeSummary.trim() || `Revision v${(bot.currentVersion || 1) + 1}`,
        avatarUrl,
        coverUrl,
        themeColor,
        themeColorDark,
        category: category.trim() || "General",
        apiKey: apiKey.trim() || undefined,
        initialMessage: initialMessage.trim() || undefined,
        initialChips: chips.length > 0 ? chips : undefined,
        n8nWorkflow: n8nWorkflow.trim() || undefined,
      }

      const updated = await editBotFn({ data: payload })
      onBotUpdated(updated)
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save revision."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (!bot) return null

  const nextVer = (bot.currentVersion || 1) + 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="size-5 text-primary" />
              Edit Bot — Publish Revision (v{nextVer})
            </DialogTitle>
            <DialogDescription>
              Publishing an edit creates a new revision on the timeline. Previous versions and their play counts remain intact!
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            {/* Change Summary / Revision Note */}
            <div className="grid gap-1.5 rounded-xl border border-primary/30 bg-primary/5 p-3">
              <label htmlFor="changeSummary" className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <GitCommit className="size-3.5 text-primary" />
                Change Summary / Revision Note <span className="text-destructive">*</span>
              </label>
              <Input
                id="changeSummary"
                placeholder={`e.g. Switched to production n8n webhook, tweaked prompt...`}
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                required
              />
            </div>

            {/* Visual Customization: Cover Image Preview / Upload */}
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="size-3.5" />
                  Bot Cover Banner
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
                  className="flex flex-col items-center justify-center h-20 rounded-xl border border-dashed hover:border-primary/50 bg-muted/30 cursor-pointer transition-colors px-4 text-center"
                >
                  <Upload className="size-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">
                    {isCompressingCover ? "Compressing image..." : "Upload New Cover"}
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

            {/* Avatar & Colors */}
            <div className="grid grid-cols-1 gap-4">
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
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-dashed hover:border-primary/50 bg-muted/40 cursor-pointer overflow-hidden"
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
                    {isCompressingAvatar ? "Processing..." : "Change Avatar"}
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

              {/* Theme Colors */}
              <div className="grid gap-2 border rounded-xl p-3 bg-muted/20">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Palette className="size-3.5 text-primary" />
                  Color Customization (Light & Dark)
                </label>

                <div className="flex items-center gap-2 flex-wrap pb-1">
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
                      title={pair.name}
                    >
                      <span
                        className="size-3.5 rounded-l-full"
                        style={{ backgroundColor: pair.light }}
                      />
                      <span
                        className="size-3.5 rounded-r-full"
                        style={{ backgroundColor: pair.dark }}
                      />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
                    <Sun className="size-4 text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-muted-foreground">Light Color</div>
                      <div className="text-xs font-mono truncate">{themeColor}</div>
                    </div>
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="size-6 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
                    <Moon className="size-4 text-indigo-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-muted-foreground">Dark Color</div>
                      <div className="text-xs font-mono truncate">{themeColorDark}</div>
                    </div>
                    <input
                      type="color"
                      value={themeColorDark}
                      onChange={(e) => setThemeColorDark(e.target.value)}
                      className="size-6 rounded cursor-pointer border-0 bg-transparent p-0"
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
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="author" className="text-sm font-medium">
                Editor / Author Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="author"
                placeholder="Your name / handle for this revision"
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                required
              />
            </div>

            {/* n8n Workflow JSON Section */}
            <div className="grid gap-2 border rounded-xl p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Code2 className="size-4 text-primary" />
                  n8n Workflow JSON (Optional)
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
                placeholder="Paste updated n8n workflow JSON..."
                value={n8nWorkflow}
                onChange={(e) => setN8nWorkflow(e.target.value)}
                rows={2}
                className="font-mono text-xs"
              />
            </div>

            {/* Advanced Settings */}
            <div className="border-t pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground hover:text-foreground py-1"
              >
                <span>Category, API Key & Initial Prompts</span>
                {showAdvanced ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>

              {showAdvanced && (
                <div className="grid gap-3 pt-3">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
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
                      API Key / Bearer Token
                    </label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Optional Authorization token"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <label htmlFor="initialMessage" className="text-xs font-medium text-muted-foreground">
                      Initial Greeting Message
                    </label>
                    <Input
                      id="initialMessage"
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
              Publish Revision (v{nextVer})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
