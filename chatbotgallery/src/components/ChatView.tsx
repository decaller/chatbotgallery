import { useState, useEffect } from "react"
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container"
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
} from "@/components/ui/message"
import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ScrollButton } from "@/components/ui/scroll-button"
import { PromptSuggestion } from "@/components/ui/prompt-suggestion"
import { SystemMessage } from "@/components/ui/system-message"
import { Loader } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VersionTimelineDialog } from "./VersionTimelineDialog"
import { EditBotDialog } from "./EditBotDialog"
import { useTheme } from "@/lib/theme"
import { sendChatMessageFn } from "@/lib/server-fns"
import type { Bot, BotVersion, ChatMessage } from "@/types/bot"
import {
  ArrowLeft,
  RotateCcw,
  ArrowUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Bot as BotIcon,
  Check,
  Download,
  Workflow,
  Code2,
  History,
  Edit3,
} from "lucide-react"

interface ChatViewProps {
  bot: Bot
  onBack: () => void
  onBotUpdated?: (updated: Bot) => void
}

export function ChatView({ bot, onBack, onBotUpdated }: ChatViewProps) {
  const { resolvedTheme } = useTheme()
  const [currentBot, setCurrentBot] = useState<Bot>(bot)
  const [activeVersion, setActiveVersion] = useState<number>(bot.currentVersion || 1)
  const [activeVersionData, setActiveVersionData] = useState<BotVersion | null>(null)

  const [sessionId] = useState(() => `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorNotice, setErrorNotice] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Dialogs
  const [isN8nDialogOpen, setIsN8nDialogOpen] = useState(false)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [copiedWorkflow, setCopiedWorkflow] = useState(false)

  // Dynamically resolve theme color based on active version & light/dark mode
  const effectiveBot = activeVersionData || currentBot
  const accentColor =
    resolvedTheme === "dark"
      ? effectiveBot.themeColorDark || effectiveBot.themeColor || "#818cf8"
      : effectiveBot.themeColor || "#4f46e5"

  // Initialize chat messages with bot's initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg_init",
      role: "assistant",
      content: effectiveBot.initialMessage || `Hello! I am ${effectiveBot.name}. How can I help you?`,
      createdAt: Date.now(),
      chips: effectiveBot.initialChips || [],
    },
  ])

  useEffect(() => {
    setCurrentBot(bot)
    setActiveVersion(bot.currentVersion || 1)
  }, [bot])

  const handleSelectVersion = (version: BotVersion) => {
    setActiveVersion(version.version)
    setActiveVersionData(version)
    setMessages([
      {
        id: `msg_ver_${version.version}_${Date.now()}`,
        role: "assistant",
        content: version.initialMessage || `Switched to version v${version.version}.`,
        createdAt: Date.now(),
        chips: version.initialChips || [],
      },
    ])
    setErrorNotice(null)
  }

  const handleBotUpdated = (updated: Bot) => {
    setCurrentBot(updated)
    setActiveVersion(updated.currentVersion)
    setActiveVersionData(null)
    onBotUpdated?.(updated)
    setMessages([
      {
        id: `msg_updated_${Date.now()}`,
        role: "assistant",
        content: updated.initialMessage || `Published new revision v${updated.currentVersion}.`,
        createdAt: Date.now(),
        chips: updated.initialChips || [],
      },
    ])
  }

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant")
  const activeChips = lastAssistantMessage?.chips || []

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg_reset_${Date.now()}`,
        role: "assistant",
        content: effectiveBot.initialMessage || `Hello! I am ${effectiveBot.name}. How can I help you?`,
        createdAt: Date.now(),
        chips: effectiveBot.initialChips || [],
      },
    ])
    setErrorNotice(null)
  }

  const handleDownloadN8n = () => {
    const wf = effectiveBot.n8nWorkflow
    if (!wf) return
    const blob = new Blob([wf], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${effectiveBot.name.toLowerCase().replace(/\s+/g, "-")}-v${activeVersion}-n8n-workflow.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyN8n = () => {
    const wf = effectiveBot.n8nWorkflow
    if (!wf) return
    navigator.clipboard.writeText(wf)
    setCopiedWorkflow(true)
    setTimeout(() => setCopiedWorkflow(false), 2000)
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? prompt).trim()
    if (!text || isLoading) return

    setPrompt("")
    setErrorNotice(null)

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await sendChatMessageFn({
        data: {
          botId: currentBot.id,
          version: activeVersion,
          message: text,
          sessionId,
          chatHistory: historyPayload,
        },
      })

      if (response.error) {
        setErrorNotice(response.error)
      }

      const assistantMessage: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        role: "assistant",
        content: response.content,
        createdAt: Date.now(),
        chips: response.chips,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error connecting to bot."
      setErrorNotice(errorMsg)

      const fallbackMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: `Sorry, there was a problem connecting to ${effectiveBot.name} (v${activeVersion}): ${errorMsg}`,
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const botInitials = effectiveBot.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Cover Banner at Top */}
      {effectiveBot.coverUrl && (
        <div className="relative h-20 sm:h-24 w-full overflow-hidden shrink-0">
          <img
            src={effectiveBot.coverUrl}
            alt={`${effectiveBot.name} cover`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        </div>
      )}

      {/* Chat Header Bar */}
      <div className="flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-8 rounded-lg"
            title="Back to Gallery"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <Avatar className="size-9 rounded-xl border bg-muted shrink-0">
            {effectiveBot.avatarUrl ? (
              <AvatarImage src={effectiveBot.avatarUrl} alt={effectiveBot.name} className="object-cover" />
            ) : null}
            <AvatarFallback
              className="rounded-xl font-semibold text-xs text-white"
              style={{ backgroundColor: accentColor }}
            >
              {botInitials || <BotIcon className="size-4" />}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-sm leading-none">{effectiveBot.name}</h2>

              {/* Version Timeline Trigger Badge */}
              <Badge
                variant="outline"
                className="cursor-pointer text-[10px] gap-1 px-1.5 hover:bg-muted font-mono"
                style={{ borderColor: accentColor }}
                onClick={() => setIsTimelineOpen(true)}
                title="View version history & timeline"
              >
                <History className="size-2.5 text-primary" />
                v{activeVersion}
                {activeVersion !== (currentBot.currentVersion || 1) && " (Historical)"}
              </Badge>

              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {effectiveBot.category || "General"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              by {effectiveBot.author} • {effectiveBot.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Edit Bot Revision Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="h-8 gap-1.5 text-xs"
            title="Publish new bot revision"
          >
            <Edit3 className="size-3.5" />
            <span className="hidden md:inline">Edit Bot</span>
          </Button>

          {effectiveBot.n8nWorkflow && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsN8nDialogOpen(true)}
              className="h-8 gap-1.5 text-xs text-primary"
              title="View n8n workflow code"
            >
              <Workflow className="size-3.5" />
              <span className="hidden sm:inline">n8n Template</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChat}
            className="h-8 gap-1.5 text-xs"
            title="Reset conversation"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="relative flex-1 overflow-hidden">
        <ChatContainerRoot className="h-full overflow-y-auto">
          <ChatContainerContent className="space-y-6 px-4 py-8 md:px-8 max-w-4xl mx-auto">
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant"
              const isLastMessage = index === messages.length - 1

              return (
                <Message
                  key={message.id}
                  className={`mx-auto flex w-full max-w-3xl flex-col gap-2 ${
                    isAssistant ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`flex w-full items-start gap-3 ${
                      isAssistant ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {isAssistant ? (
                      <Avatar className="size-7 rounded-lg border shrink-0 mt-0.5">
                        {effectiveBot.avatarUrl ? (
                          <AvatarImage src={effectiveBot.avatarUrl} alt={effectiveBot.name} className="object-cover" />
                        ) : null}
                        <AvatarFallback
                          className="rounded-lg text-[10px] font-bold text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          {botInitials || <BotIcon className="size-3.5" />}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="size-7 rounded-lg border shrink-0 mt-0.5 bg-muted">
                        <AvatarFallback className="rounded-lg text-[10px] font-medium">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`group flex flex-col ${isAssistant ? "items-start" : "items-end"} max-w-[85%] sm:max-w-[78%]`}>
                      {isAssistant ? (
                        <MessageContent
                          className="prose prose-sm dark:prose-invert text-foreground rounded-2xl bg-muted/60 p-4 w-full shadow-xs"
                          markdown
                        >
                          {message.content}
                        </MessageContent>
                      ) : (
                        <MessageContent
                          className="text-white rounded-2xl p-3.5 shadow-xs font-normal"
                          style={{ backgroundColor: accentColor }}
                        >
                          {message.content}
                        </MessageContent>
                      )}

                      {/* Actions */}
                      <MessageActions
                        className={`mt-1 flex gap-1 transition-opacity duration-150 ${
                          isLastMessage ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <MessageAction tooltip="Copy message">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 rounded-md text-muted-foreground hover:text-foreground"
                            onClick={() => handleCopy(message.content, message.id)}
                          >
                            {copiedId === message.id ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </Button>
                        </MessageAction>
                        {isAssistant && (
                          <>
                            <MessageAction tooltip="Helpful">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 rounded-md text-muted-foreground hover:text-foreground"
                              >
                                <ThumbsUp className="size-3" />
                              </Button>
                            </MessageAction>
                            <MessageAction tooltip="Not helpful">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 rounded-md text-muted-foreground hover:text-foreground"
                              >
                                <ThumbsDown className="size-3" />
                              </Button>
                            </MessageAction>
                          </>
                        )}
                      </MessageActions>
                    </div>
                  </div>
                </Message>
              )
            })}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2">
                <div className="flex w-full items-start gap-3 flex-row">
                  <Avatar className="size-7 rounded-lg border shrink-0 mt-0.5">
                    <AvatarFallback
                      className="rounded-lg text-[10px] font-bold text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {botInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl bg-muted/60 px-4 py-3 flex items-center gap-2">
                    <Loader variant="typing" size="sm" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </Message>
            )}

            {/* Error Notification */}
            {errorNotice && (
              <div className="max-w-3xl mx-auto w-full pt-2">
                <SystemMessage variant="error" fill>
                  {errorNotice}
                </SystemMessage>
              </div>
            )}

            <ChatContainerScrollAnchor />
          </ChatContainerContent>

          {/* Stick to bottom button */}
          <div className="absolute bottom-4 right-4 md:right-8 z-20">
            <ScrollButton variant="default" size="icon" className="shadow-md" />
          </div>
        </ChatContainerRoot>
      </div>

      {/* Input Area & Prompt Suggestions */}
      <div className="border-t bg-background/95 p-3 md:p-4 shrink-0 backdrop-blur">
        <div className="mx-auto max-w-3xl space-y-3">
          {/* Quick Suggestions / Action Chips */}
          {activeChips && activeChips.length > 0 && !isLoading && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {activeChips.map((chip, i) => (
                <PromptSuggestion
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs shrink-0 rounded-full h-7 px-3 bg-background hover:bg-muted font-normal"
                  onClick={() => handleSendMessage(chip)}
                >
                  {chip}
                </PromptSuggestion>
              ))}
            </div>
          )}

          {/* Prompt Input Box */}
          <PromptInput
            isLoading={isLoading}
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={() => handleSendMessage()}
            className="border bg-background relative z-10 w-full rounded-2xl p-1.5 shadow-sm focus-within:ring-1"
            style={{ borderColor: prompt ? accentColor : undefined }}
          >
            <div className="flex flex-col">
              <PromptInputTextarea
                placeholder={`Message ${effectiveBot.name} (v${activeVersion})...`}
                className="min-h-[44px] max-h-32 px-3 pt-2 text-sm leading-relaxed"
                disabled={isLoading}
              />

              <PromptInputActions className="flex w-full items-center justify-between gap-2 px-2 pb-1 pt-1">
                <div className="text-[11px] text-muted-foreground pl-1">
                  Press <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    disabled={!prompt.trim() || isLoading}
                    onClick={() => handleSendMessage()}
                    className="size-8 rounded-xl text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {!isLoading ? (
                      <ArrowUp className="size-4" />
                    ) : (
                      <Loader variant="circular" size="sm" className="text-white" />
                    )}
                  </Button>
                </div>
              </PromptInputActions>
            </div>
          </PromptInput>
        </div>
      </div>

      {/* Dialog: n8n Workflow JSON */}
      {effectiveBot.n8nWorkflow && (
        <Dialog open={isN8nDialogOpen} onOpenChange={setIsN8nDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Workflow className="size-5 text-primary" />
                n8n Workflow Template (v{activeVersion})
              </DialogTitle>
              <DialogDescription>
                Workflow JSON for <span className="font-semibold text-foreground">{effectiveBot.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="relative flex-1 overflow-hidden my-2 rounded-xl border bg-muted/40 p-3">
              <pre className="h-64 overflow-auto text-xs font-mono text-foreground/90 whitespace-pre">
                {effectiveBot.n8nWorkflow}
              </pre>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyN8n}
                className="gap-1.5 text-xs"
              >
                {copiedWorkflow ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Code2 className="size-3.5" />
                    Copy JSON
                  </>
                )}
              </Button>

              <Button
                size="sm"
                onClick={handleDownloadN8n}
                className="gap-1.5 text-xs text-white"
                style={{ backgroundColor: accentColor }}
              >
                <Download className="size-3.5" />
                Download .json
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog: Version Timeline History */}
      <VersionTimelineDialog
        bot={currentBot}
        open={isTimelineOpen}
        onOpenChange={setIsTimelineOpen}
        activeVersionNumber={activeVersion}
        onSelectVersion={handleSelectVersion}
      />

      {/* Dialog: Edit Bot / New Revision */}
      <EditBotDialog
        bot={currentBot}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onBotUpdated={handleBotUpdated}
      />
    </div>
  )
}
