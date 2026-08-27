import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBotVersionsFn } from "@/lib/server-fns"
import type { Bot, BotVersion } from "@/types/bot"
import {
  History,
  MessageSquare,
  GitCommit,
  User,
  Clock,
  ArrowRight,
  Loader2,
  Workflow,
  CheckCircle2,
} from "lucide-react"

interface VersionTimelineDialogProps {
  bot: Bot | null
  open: boolean
  onOpenChange: (open: boolean) => void
  activeVersionNumber?: number
  onSelectVersion: (version: BotVersion) => void
}

export function VersionTimelineDialog({
  bot,
  open,
  onOpenChange,
  activeVersionNumber,
  onSelectVersion,
}: VersionTimelineDialogProps) {
  const [versions, setVersions] = useState<BotVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (bot && open) {
      setIsLoading(true)
      getBotVersionsFn({ data: { botId: bot.id } })
        .then((res) => setVersions(res))
        .catch((err) => console.error("Failed to load bot versions:", err))
        .finally(() => setIsLoading(false))
    }
  }, [bot, open])

  if (!bot) return null

  const currentSelectedVersion = activeVersionNumber || bot.currentVersion || 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            Revision Timeline — {bot.name}
          </DialogTitle>
          <DialogDescription>
            Browse all historical versions, changelogs, and independent play counts. You can switch to chat with any previous version.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs">Loading revision timeline...</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No version history found.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
              {versions.map((ver, idx) => {
                const isSelected = ver.version === currentSelectedVersion
                const isLatest = idx === 0
                const dateFormatted = new Date(ver.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })

                return (
                  <div key={ver.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute -left-6 top-1.5 flex size-5 items-center justify-center rounded-full border bg-background text-[10px] font-bold ${
                        isSelected
                          ? "border-primary text-primary ring-2 ring-primary/20"
                          : "border-muted-foreground/40 text-muted-foreground"
                      }`}
                    >
                      {ver.version}
                    </div>

                    {/* Timeline Card */}
                    <div
                      className={`rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "bg-card hover:border-muted-foreground/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">v{ver.version}</span>
                            {isLatest && (
                              <Badge variant="default" className="text-[10px] px-1.5 py-0 font-medium">
                                Latest
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary text-primary font-medium gap-1">
                                <CheckCircle2 className="size-3" />
                                Active Chat Session
                              </Badge>
                            )}
                            {ver.n8nWorkflow && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1 text-muted-foreground">
                                <Workflow className="size-2.5" />
                                n8n
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="size-3" />
                              {ver.author}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {dateFormatted}
                            </span>
                          </div>
                        </div>

                        {/* Separate Play Count for this Version */}
                        <div className="flex items-center gap-1.5 rounded-lg border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground shadow-2xs">
                          <MessageSquare className="size-3.5 text-primary" />
                          <span className="font-semibold text-foreground">{ver.playCount}</span>
                          <span>{ver.playCount === 1 ? "chat" : "chats"}</span>
                        </div>
                      </div>

                      {/* Change Note */}
                      <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/40 p-2.5 text-xs text-foreground/90">
                        <GitCommit className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{ver.changeSummary || "No changelog provided"}</span>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 pt-2 border-t flex items-center justify-between text-xs">
                        <span className="text-muted-foreground text-[11px] font-mono truncate max-w-xs">
                          {ver.apiUrl}
                        </span>

                        {!isSelected ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            onClick={() => {
                              onSelectVersion(ver)
                              onOpenChange(false)
                            }}
                          >
                            <span>Switch to v{ver.version}</span>
                            <ArrowRight className="size-3" />
                          </Button>
                        ) : (
                          <span className="text-xs text-primary font-medium">Currently Chatting</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
