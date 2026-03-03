"use client"

import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  FileStack,
  BookOpen,
  Settings,
  Scale,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { currentUser } from "@/lib/mock-data"

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
    badge: undefined as string | undefined,
  },
  {
    title: "Contracts",
    icon: FileText,
    key: "contracts",
    badge: undefined as string | undefined,
  },
  {
    title: "Review Queue",
    icon: ClipboardCheck,
    key: "review-queue",
    badge: "5",
  },
  {
    title: "Templates",
    icon: FileStack,
    key: "templates",
    badge: undefined as string | undefined,
  },
  {
    title: "Playbooks",
    icon: BookOpen,
    key: "playbooks",
    badge: undefined as string | undefined,
  },
]

interface AppSidebarProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <Scale className="size-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">Contract Copilot</span>
            <span className="text-xs text-sidebar-foreground/60">Lite</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeView === item.key}
                    tooltip={item.title}
                    onClick={() => onNavigate(item.key)}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="bg-sidebar-primary/20 text-sidebar-primary text-[10px] font-semibold">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => onNavigate("settings")}
              className="cursor-pointer"
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={currentUser.name} className="h-auto py-2">
              <Avatar className="size-6">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-semibold">
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-xs font-medium text-sidebar-foreground">{currentUser.name}</span>
                <span className="text-[10px] text-sidebar-foreground/50">Legal User</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
