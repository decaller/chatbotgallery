import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/lib/theme"
import type { Bot } from "@/types/bot"
import {
  Bot as BotIcon,
  MessageSquare,
  ArrowRight,
  Trash2,
  Workflow,
  History,
  Edit3,
} from "lucide-react"

interface BotCardProps {
  bot: Bot
  onSelectBot: (bot: Bot) => void
  onEditBot?: (bot: Bot) => void
  onViewTimeline?: (bot: Bot) => void
  onDeleteBot?: (botId: string) => void
}

export function BotCard({
  bot,
  onSelectBot,
  onEditBot,
  onViewTimeline,
  onDeleteBot,
}: BotCardProps) {
  const { resolvedTheme } = useTheme()

  const initials = bot.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const accentColor =
    resolvedTheme === "dark"
      ? bot.themeColorDark || bot.themeColor || "#818cf8"
      : bot.themeColor || "#4f46e5"

  return (
    <Card className="flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50 group">
      {/* Cover Image Banner (if available) */}
      {bot.coverUrl ? (
        <div className="relative h-28 w-full overflow-hidden bg-muted">
          <img
            src={bot.coverUrl}
            alt={`${bot.name} cover`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      ) : (
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: accentColor }}
        />
      )}

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <Avatar className="size-11 rounded-xl border bg-muted shrink-0">
            {bot.avatarUrl ? (
              <AvatarImage src={bot.avatarUrl} alt={bot.name} className="object-cover" />
            ) : null}
            <AvatarFallback
              className="rounded-xl font-semibold text-white text-sm"
              style={{ backgroundColor: accentColor }}
            >
              {initials || <BotIcon className="size-5" />}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Version Badge with Timeline Trigger */}
            <Badge
              variant="outline"
              className="cursor-pointer text-[10px] gap-1 px-1.5 hover:bg-muted font-mono"
              onClick={(e) => {
                e.stopPropagation()
                onViewTimeline?.(bot)
              }}
              title="View revision history"
            >
              <History className="size-2.5 text-primary" />
              v{bot.currentVersion || 1}
            </Badge>

            {bot.n8nWorkflow && (
              <Badge variant="outline" className="text-[10px] gap-1 px-1.5 border-primary/30 text-primary">
                <Workflow className="size-2.5" />
                n8n
              </Badge>
            )}

            <Badge variant="secondary" className="text-xs font-normal">
              {bot.category || "General"}
            </Badge>

            {onDeleteBot && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`Are you sure you want to delete "${bot.name}"?`)) {
                    onDeleteBot(bot.id)
                  }
                }}
                title="Delete Bot"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div>
          <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {bot.name}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">by {bot.author}</p>
        </div>

        <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {bot.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" title={`Total: ${bot.playCount} chats (v${bot.currentVersion}: ${bot.versionPlayCount} chats)`}>
            <MessageSquare className="size-3.5" />
            <span>{bot.playCount} {bot.playCount === 1 ? "chat" : "chats"}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onEditBot && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-2 gap-1"
              onClick={(e) => {
                e.stopPropagation()
                onEditBot(bot)
              }}
              title="Edit & publish new revision"
            >
              <Edit3 className="size-3" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="gap-1 px-2.5 text-xs font-medium group-hover:translate-x-0.5 transition-transform"
            style={{ color: accentColor }}
            onClick={() => onSelectBot(bot)}
          >
            <span>Chat</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
