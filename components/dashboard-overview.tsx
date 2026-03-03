"use client"

import {
  Clock,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  FileX,
  TrendingUp,
  FileText,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { draftsForReview } from "@/lib/mock-data"
import type { RiskTier, ContractStatus } from "@/lib/mock-data"

function computeStats() {
  const pending = draftsForReview.filter((d) => d.review_status === "PENDING")
  const inReview = draftsForReview.filter((d) => d.status === "IN_REVIEW")
  const highRisk = draftsForReview.filter((d) => d.risk_tier === "HIGH")
  const mediumRisk = draftsForReview.filter((d) => d.risk_tier === "MEDIUM")
  const lowRisk = draftsForReview.filter((d) => d.risk_tier === "LOW")
  const approved = draftsForReview.filter((d) => d.status === "APPROVED")
  const changesRequested = draftsForReview.filter((d) => d.status === "CHANGES_REQUESTED")

  return {
    totalPending: pending.length,
    inReview: inReview.length,
    highRisk: highRisk.length,
    mediumRisk: mediumRisk.length,
    lowRisk: lowRisk.length,
    approved: approved.length,
    changesRequested: changesRequested.length,
    total: draftsForReview.length,
  }
}

function getRiskBadge(risk: RiskTier) {
  const variants: Record<RiskTier, { className: string }> = {
    HIGH: { className: "bg-destructive/10 text-destructive border-destructive/20" },
    MEDIUM: { className: "bg-warning/10 text-warning-foreground border-warning/20" },
    LOW: { className: "bg-success/10 text-success-foreground border-success/20" },
  }
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold ${variants[risk].className}`}>
      {risk}
    </Badge>
  )
}

function getStatusLabel(status: ContractStatus) {
  const map: Record<ContractStatus, string> = {
    DRAFTING: "Drafting",
    IN_REVIEW: "In Review",
    CHANGES_REQUESTED: "Changes Req.",
    APPROVED: "Approved",
  }
  return map[status]
}

export function DashboardOverview({ onNavigate }: { onNavigate: (view: string) => void }) {
  const stats = computeStats()
  const recentDrafts = draftsForReview.slice(0, 5)
  const totalRisk = stats.highRisk + stats.mediumRisk + stats.lowRisk

  const summaryCards = [
    {
      label: "Pending Review",
      value: stats.totalPending,
      icon: Clock,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "In Review",
      value: stats.inReview,
      icon: ClipboardCheck,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: FileCheck,
      iconColor: "text-success-foreground",
      iconBg: "bg-success/10",
    },
    {
      label: "Changes Requested",
      value: stats.changesRequested,
      icon: FileX,
      iconColor: "text-warning-foreground",
      iconBg: "bg-warning/10",
    },
  ]

  const riskItems = [
    {
      label: "High Risk",
      value: stats.highRisk,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      barColor: "bg-destructive",
    },
    {
      label: "Medium Risk",
      value: stats.mediumRisk,
      icon: AlertCircle,
      color: "text-warning-foreground",
      bgColor: "bg-warning/10",
      barColor: "bg-warning",
    },
    {
      label: "Low Risk",
      value: stats.lowRisk,
      icon: ShieldCheck,
      color: "text-success-foreground",
      bgColor: "bg-success/10",
      barColor: "bg-success",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border-border bg-card shadow-sm">
            <CardContent className="flex items-center gap-4 py-5 px-5">
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                <card.icon className={`size-5 ${card.iconColor}`} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {card.label}
                </span>
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Risk Distribution */}
        <Card className="border-border bg-card shadow-sm lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">Risk Distribution</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {riskItems.map((risk) => (
              <div key={risk.label} className="flex items-center gap-3">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${risk.bgColor}`}>
                  <risk.icon className={`size-4 ${risk.color}`} />
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{risk.label}</span>
                    <span className="text-xs font-bold tabular-nums text-foreground">{risk.value}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${risk.barColor} transition-all`}
                      style={{
                        width: totalRisk > 0 ? `${(risk.value / totalRisk) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total Contracts</span>
              <span className="text-sm font-bold tabular-nums text-foreground">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Drafts */}
        <Card className="border-border bg-card shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">Recent Drafts</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-primary hover:text-primary"
                onClick={() => onNavigate("review-queue")}
              >
                View all
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-0">
              {recentDrafts.map((draft, idx) => (
                <div key={draft.draft_id}>
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {draft.draft_id}
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-semibold">
                          {draft.contract_type}
                        </Badge>
                        {getRiskBadge(draft.risk_tier)}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{draft.party_a} & {draft.party_b}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="text-[11px] font-medium text-foreground">
                        {getStatusLabel(draft.status)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(draft.submitted_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  {idx < recentDrafts.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
