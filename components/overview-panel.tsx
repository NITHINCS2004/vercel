"use client"

import {
  Clock,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  FileX,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { draftsForReview } from "@/lib/mock-data"

function computeStats() {
  const activeDrafts = draftsForReview.filter(
    (d) => d.status === "IN_REVIEW" || d.status === "CHANGES_REQUESTED"
  )
  const pendingReview = draftsForReview.filter(
    (d) => d.review_status === "PENDING"
  )
  const highRisk = activeDrafts.filter((d) => d.risk_tier === "HIGH")
  const mediumRisk = activeDrafts.filter((d) => d.risk_tier === "MEDIUM")
  const lowRisk = activeDrafts.filter((d) => d.risk_tier === "LOW")
  const approved = draftsForReview.filter((d) => d.status === "APPROVED")
  const changesRequested = draftsForReview.filter(
    (d) => d.status === "CHANGES_REQUESTED"
  )

  return {
    totalPending: pendingReview.length,
    highRisk: highRisk.length,
    mediumRisk: mediumRisk.length,
    lowRisk: lowRisk.length,
    approved: approved.length,
    changesRequested: changesRequested.length,
    total: draftsForReview.length,
  }
}

export function OverviewPanel() {
  const stats = computeStats()

  const riskBreakdown = [
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
      color: "text-warning",
      bgColor: "bg-warning/10",
      barColor: "bg-warning",
    },
    {
      label: "Low Risk",
      value: stats.lowRisk,
      icon: ShieldCheck,
      color: "text-success",
      bgColor: "bg-success/10",
      barColor: "bg-success",
    },
  ]

  const statusCards = [
    {
      label: "Approved",
      value: stats.approved,
      icon: FileCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Changes Req.",
      value: stats.changesRequested,
      icon: FileX,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ]

  const totalActive = stats.highRisk + stats.mediumRisk + stats.lowRisk

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-foreground">Overview</h2>

      {/* Pending Review - Primary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <Clock className="size-5 text-primary" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Pending Review
            </span>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.totalPending}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Risk Breakdown */}
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Risk Distribution
            </span>
            <TrendingUp className="size-3.5 text-muted-foreground" />
          </div>
          <Separator />
          <div className="flex flex-col gap-3">
            {riskBreakdown.map((risk) => (
              <div key={risk.label} className="flex items-center gap-3">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${risk.bgColor}`}>
                  <risk.icon className={`size-3.5 ${risk.color}`} />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{risk.label}</span>
                    <span className="text-xs font-bold tabular-nums text-foreground">{risk.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${risk.barColor} transition-all`}
                      style={{
                        width: totalActive > 0 ? `${(risk.value / totalActive) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-3">
        {statusCards.map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">{stat.value}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Contracts */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total Contracts</span>
          <span className="text-sm font-bold tabular-nums text-foreground">{stats.total}</span>
        </div>
      </div>
    </div>
  )
}
