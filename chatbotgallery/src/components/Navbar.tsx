import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/lib/theme"
import { Bot as BotIcon, Plus, Search, Sun, Moon } from "lucide-react"

interface NavbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onOpenCreateModal: () => void
  totalBots: number
}

export function Navbar({
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  totalBots,
}: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <BotIcon className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base tracking-tight">ChatBot Gallery</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
                {totalBots} {totalBots === 1 ? "bot" : "bots"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Community AI & REST API Chatbots
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-36 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bots..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>

          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="size-9 rounded-xl shrink-0"
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-slate-700" />
            )}
          </Button>

          <Button onClick={onOpenCreateModal} size="sm" className="gap-1.5 shadow-xs">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add Bot</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
