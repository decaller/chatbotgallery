import { useState, useMemo } from "react"
import { BotCard } from "./BotCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Bot } from "@/types/bot"
import { Plus, Bot as BotIcon, SearchX } from "lucide-react"

interface BotGalleryProps {
  bots: Bot[]
  searchQuery: string
  onSelectBot: (bot: Bot) => void
  onEditBot: (bot: Bot) => void
  onViewTimeline: (bot: Bot) => void
  onDeleteBot: (botId: string) => void
  onOpenCreateModal: () => void
}

export function BotGallery({
  bots,
  searchQuery,
  onSelectBot,
  onEditBot,
  onViewTimeline,
  onDeleteBot,
  onOpenCreateModal,
}: BotGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    set.add("All")
    bots.forEach((b) => {
      if (b.category) set.add(b.category)
    })
    return Array.from(set)
  }, [bots])

  // Filter bots by category and search
  const filteredBots = useMemo(() => {
    return bots.filter((bot) => {
      const matchCategory =
        selectedCategory === "All" || bot.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        bot.name.toLowerCase().includes(query) ||
        bot.description.toLowerCase().includes(query) ||
        bot.author.toLowerCase().includes(query) ||
        bot.category.toLowerCase().includes(query)

      return matchCategory && matchSearch
    })
  }, [bots, selectedCategory, searchQuery])

  if (bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <BotIcon className="size-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">No ChatBots Yet</h2>
        <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
          Be the first maker to publish a chatbot! Connect your n8n workflow, FastAPI service, or REST API endpoint.
        </p>
        <Button onClick={onOpenCreateModal} className="gap-2 shadow-xs">
          <Plus className="size-4" />
          Create First Bot
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <Badge
                key={cat}
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded-full transition-all"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            )
          })}
        </div>
      )}

      {/* Grid */}
      {filteredBots.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onSelectBot={onSelectBot}
              onEditBot={onEditBot}
              onViewTimeline={onViewTimeline}
              onDeleteBot={onDeleteBot}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SearchX className="size-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-semibold">No bots match your criteria</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or category filter.
          </p>
        </div>
      )}
    </div>
  )
}
