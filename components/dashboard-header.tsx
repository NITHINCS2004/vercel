"use client"

import { Bell, ChevronDown } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { currentUser } from "@/lib/mock-data"

const viewTitles: Record<string, string> = {
  dashboard: "Dashboard",
  contracts: "Contracts",
  "review-queue": "Review Queue",
  "contract-view": "Contract Review",
  templates: "Templates",
  playbooks: "Playbooks",
  settings: "Settings",
}

export function DashboardHeader({ activeView }: { activeView: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-card">
      <div className="flex flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-foreground">
            {viewTitles[activeView] || "Dashboard"}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 text-muted-foreground hover:text-foreground">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start leading-none md:flex">
                <span className="text-xs font-medium text-foreground">{currentUser.name}</span>
                <Badge variant="secondary" className="mt-0.5 h-4 px-1 text-[9px] font-medium">
                  Legal User
                </Badge>
              </div>
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
