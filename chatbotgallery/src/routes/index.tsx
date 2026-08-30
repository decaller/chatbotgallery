import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { getBotsFn, deleteBotFn } from "@/lib/server-fns"
import { Navbar } from "@/components/Navbar"
import { BotGallery } from "@/components/BotGallery"
import { ChatView } from "@/components/ChatView"
import { CreateBotDialog } from "@/components/CreateBotDialog"
import { EditBotDialog } from "@/components/EditBotDialog"
import { VersionTimelineDialog } from "@/components/VersionTimelineDialog"
import { Button } from "@/components/ui/button"
import type { Bot, BotVersion } from "@/types/bot"
import { Plus, Server } from "lucide-react"

interface IndexSearchParams {
  bot?: string
}

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): IndexSearchParams => {
    return {
      bot: typeof search.bot === "string" && search.bot.trim() !== "" ? search.bot.trim() : undefined,
    }
  },
  loaderDeps: ({ search: { bot } }) => ({ bot }),
  loader: async () => {
    try {
      const bots = await getBotsFn()
      return { initialBots: bots }
    } catch {
      return { initialBots: [] }
    }
  },
  component: IndexPage,
})

function IndexPage() {
  const { initialBots } = Route.useLoaderData()
  const { bot: selectedBotId } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [bots, setBots] = useState<Bot[]>(initialBots || [])
  const [historicalBot, setHistoricalBot] = useState<Bot | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit and Timeline State
  const [botToEdit, setBotToEdit] = useState<Bot | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const [botForTimeline, setBotForTimeline] = useState<Bot | null>(null)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)

  // Derived activeBot
  const baseActiveBot = selectedBotId ? bots.find((b) => b.id === selectedBotId) || null : null
  const activeBot =
    historicalBot && historicalBot.id === selectedBotId ? historicalBot : baseActiveBot

  // Navigation handlers
  const handleSelectBot = (bot: Bot) => {
    setHistoricalBot(null)
    navigate({ search: { bot: bot.id } })
  }

  const handleBackToHome = () => {
    setHistoricalBot(null)
    navigate({ search: { bot: undefined } })
    refreshBots()
  }

  // Fetch / refresh bots
  const refreshBots = async () => {
    try {
      const updated = await getBotsFn()
      setBots(updated)
    } catch (err) {
      console.error("Failed to refresh bots:", err)
    }
  }

  const handleBotCreated = (newBot: Bot) => {
    setBots((prev) => [newBot, ...prev])
  }

  const handleBotUpdated = (updatedBot: Bot) => {
    setBots((prev) => prev.map((b) => (b.id === updatedBot.id ? updatedBot : b)))
    if (historicalBot?.id === updatedBot.id) {
      setHistoricalBot(updatedBot)
    }
  }

  const handleEditClick = (bot: Bot) => {
    setBotToEdit(bot)
    setIsEditOpen(true)
  }

  const handleTimelineClick = (bot: Bot) => {
    setBotForTimeline(bot)
    setIsTimelineOpen(true)
  }

  const handleSelectHistoricalVersion = (version: BotVersion) => {
    if (botForTimeline) {
      const customVersionBot: Bot = {
        ...botForTimeline,
        currentVersion: version.version,
        name: version.name,
        description: version.description,
        author: version.author,
        apiUrl: version.apiUrl,
        apiKey: version.apiKey,
        avatarUrl: version.avatarUrl,
        coverUrl: version.coverUrl,
        themeColor: version.themeColor,
        themeColorDark: version.themeColorDark,
        category: version.category,
        initialMessage: version.initialMessage,
        initialChips: version.initialChips,
        n8nWorkflow: version.n8nWorkflow,
      }
      setHistoricalBot(customVersionBot)
      setIsTimelineOpen(false)
      navigate({ search: { bot: botForTimeline.id } })
    }
  }

  const handleDeleteBot = async (botId: string) => {
    try {
      await deleteBotFn({ data: { id: botId } })
      setBots((prev) => prev.filter((b) => b.id !== botId))
      if (selectedBotId === botId) {
        handleBackToHome()
      }
    } catch (err) {
      console.error("Failed to delete bot:", err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        totalBots={bots.length}
        onGoHome={handleBackToHome}
      />

      <main className="flex-1">
        {activeBot ? (
          <ChatView
            bot={activeBot}
            onBack={handleBackToHome}
            onBotUpdated={handleBotUpdated}
          />
        ) : (
          <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-8 space-y-8">
            {/* Header Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-10 shadow-xs">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Server className="size-3.5 text-primary" />
                  REST API, n8n Webhooks & Community Version Timeline
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  Interactive AI Chatbot Hub
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Explore custom community chatbots hosted on external servers, publish new bots, or edit revisions with full timeline history and independent play counts.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-xs">
                    <Plus className="size-4" />
                    Add Your Bot
                  </Button>
                </div>
              </div>
            </div>

            {/* Gallery Content */}
            <BotGallery
              bots={bots}
              searchQuery={searchQuery}
              onSelectBot={handleSelectBot}
              onEditBot={handleEditClick}
              onViewTimeline={handleTimelineClick}
              onDeleteBot={handleDeleteBot}
              onOpenCreateModal={() => setIsCreateOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Create Bot Dialog */}
      <CreateBotDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onBotCreated={handleBotCreated}
      />

      {/* Edit Bot / Revision Dialog */}
      <EditBotDialog
        bot={botToEdit}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onBotUpdated={handleBotUpdated}
      />

      {/* Version Timeline Dialog */}
      <VersionTimelineDialog
        bot={botForTimeline}
        open={isTimelineOpen}
        onOpenChange={setIsTimelineOpen}
        onSelectVersion={handleSelectHistoricalVersion}
      />
    </div>
  )
}
