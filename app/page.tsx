"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { DraftsTable } from "@/components/drafts-table"
import { OverviewPanel } from "@/components/overview-panel"
import { ContractViewer } from "@/components/contract-viewer"
import type { DraftForReview } from "@/lib/mock-data"

export default function LegalDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedDraft, setSelectedDraft] = useState<DraftForReview | null>(null)

  const handleViewDraft = (draft: DraftForReview) => {
    setSelectedDraft(draft)
  }

  const handleCloseDraft = () => {
    setSelectedDraft(null)
  }

  const handleNavigate = (view: string) => {
    setActiveView(view)
    setSelectedDraft(null) // close viewer when navigating
  }

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onNavigate={handleNavigate} />
      <SidebarInset>
        <DashboardHeader activeView={selectedDraft ? "contract-view" : activeView} />

        {/* Contract Viewer takes over the main area when a draft is selected */}
        {selectedDraft ? (
          <ContractViewer draft={selectedDraft} onClose={handleCloseDraft} />
        ) : (
          <main className="flex-1 overflow-auto p-6">
            {activeView === "dashboard" && (
              <DashboardOverview onNavigate={handleNavigate} />
            )}
            {activeView === "review-queue" && (
              <div className="flex flex-1 flex-col gap-6 lg:flex-row">
                <div className="flex-1 min-w-0">
                  <DraftsTable onViewDraft={handleViewDraft} />
                </div>
                <aside className="w-full shrink-0 lg:w-64 xl:w-72">
                  <OverviewPanel />
                </aside>
              </div>
            )}
            {activeView !== "dashboard" && activeView !== "review-queue" && (
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <span className="text-lg font-semibold text-muted-foreground">
                    {activeView.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {activeView.charAt(0).toUpperCase() + activeView.slice(1).replace("-", " ")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  This section is coming soon.
                </p>
              </div>
            )}
          </main>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
