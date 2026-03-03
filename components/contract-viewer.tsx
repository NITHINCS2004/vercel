"use client"

import { useState, useCallback } from "react"
import { format } from "date-fns"
import {
  X,
  Bot,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  Clock,
  Loader2,
  CheckCircle2,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { DraftForReview, ContractSection, RiskTier, ReviewReport } from "@/lib/mock-data"
import { resolveTemplate, generateReviewReport } from "@/lib/mock-data"
import { ReviewAgentLoading } from "@/components/review-agent-loading"
import { PlaybookReviewReport } from "@/components/playbook-review-report"

type ViewState = "draft" | "agent-loading" | "review-report"

function getRiskBadgeClass(risk: RiskTier) {
  const map: Record<RiskTier, string> = {
    HIGH: "bg-destructive/10 text-destructive border-destructive/20",
    MEDIUM: "bg-warning/10 text-warning-foreground border-warning/20",
    LOW: "bg-success/10 text-success-foreground border-success/20",
  }
  return map[risk]
}

function getStatusLabel(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    IN_REVIEW: { label: "In Review", className: "bg-primary/10 text-primary border-primary/20" },
    CHANGES_REQUESTED: { label: "Changes Requested", className: "bg-warning/10 text-warning-foreground border-warning/20" },
    APPROVED: { label: "Approved", className: "bg-success/10 text-success-foreground border-success/20" },
    DRAFTING: { label: "Drafting", className: "bg-muted text-muted-foreground border-border" },
  }
  return map[status] || { label: status, className: "bg-muted text-muted-foreground" }
}

interface ContractViewerProps {
  draft: DraftForReview
  onClose: () => void
}

export function ContractViewer({ draft, onClose }: ContractViewerProps) {
  const sections = resolveTemplate(draft)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.section_id))
  )
  const [viewState, setViewState] = useState<ViewState>("draft")
  const [reviewReport, setReviewReport] = useState<ReviewReport | null>(null)

  const statusInfo = getStatusLabel(draft.status)

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const expandAll = () => setExpandedSections(new Set(sections.map((s) => s.section_id)))
  const collapseAll = () => setExpandedSections(new Set())

  const handleRunAgent = () => {
    if (reviewReport) {
      setViewState("review-report")
    } else {
      setViewState("agent-loading")
    }
  }

  const handleAgentComplete = useCallback(() => {
    const report = generateReviewReport(draft)
    setReviewReport(report)
    setViewState("review-report")
  }, [draft])

  const handleCloseReport = () => {
    setViewState("draft")
  }

  // If showing loading or report, render those instead
  if (viewState === "agent-loading") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <ReviewAgentLoading onComplete={handleAgentComplete} />
      </div>
    )
  }

  if (viewState === "review-report" && reviewReport) {
    return (
      <PlaybookReviewReport
        report={reviewReport}
        draft={draft}
        onClose={handleCloseReport}
      />
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Fixed Header */}
      <div className="shrink-0 border-b border-border bg-card">
        {/* Primary info row */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground truncate">
                  Contract: {draft.contract_type} {"\u2013"} {draft.party_b}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono font-medium">{draft.draft_id}</span>
                <span>{"\u00B7"}</span>
                <span>{draft.party_a} & {draft.party_b}</span>
                <span>{"\u00B7"}</span>
                <span>{draft.state}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleRunAgent}
                    size="sm"
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {reviewReport ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <Bot className="size-3.5" />
                    )}
                    {reviewReport ? "View Review Report" : "Run AI Review Agent"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Run AI-powered legal review against playbook rules</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
              <span className="sr-only">Close contract viewer</span>
            </Button>
          </div>
        </div>

        {/* Metadata ribbon */}
        <div className="flex items-center gap-3 border-t border-border bg-muted/50 px-6 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Version:</span>
            <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-[10px] font-semibold">
              <Hash className="size-2.5" />
              v{draft.version_no}
            </Badge>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Status:</span>
            <Badge variant="outline" className={`h-5 px-1.5 text-[10px] font-semibold ${statusInfo.className}`}>
              {statusInfo.label}
            </Badge>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground">Risk:</span>
            <Badge variant="outline" className={`h-5 px-1.5 text-[10px] font-semibold ${getRiskBadgeClass(draft.risk_tier)}`}>
              <Shield className="mr-1 size-2.5" />
              {draft.risk_tier}
            </Badge>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              Submitted {format(new Date(draft.submitted_at), "MMM d, yyyy 'at' h:mm a")} by {draft.submitted_by}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      {/* Document area -- page background with the paper card inside */}
      <div className="min-h-0 flex-1 bg-muted/30 px-6 py-6">
        <div className="mx-auto flex h-full max-w-4xl flex-col">
          {/* Document Paper -- constrained height, scroll inside */}
          <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-card shadow-sm">
            {/* Document Title -- pinned at top of paper */}
            <div className="shrink-0 border-b border-border px-8 py-5 text-center">
              <h1 className="text-lg font-bold tracking-wide text-foreground">
                {sections[0]?.title || draft.contract_type}
              </h1>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {draft.contract_type === "NDA" && "Confidentiality and Non-Disclosure"}
                {draft.contract_type === "MSA" && "Master Services Agreement"}
                {draft.contract_type === "SOW" && "Statement of Work"}
                {" "}{"\u2014"} Governed by the laws of {draft.state}
              </p>
            </div>

            {/* Scrollable sections inside the paper */}
            <ScrollArea className="min-h-0 flex-1">
              <div className="flex flex-col">
                {sections.map((section, idx) => (
                  <ContractSectionBlock
                    key={section.section_id}
                    section={section}
                    index={idx}
                    isExpanded={expandedSections.has(section.section_id)}
                    onToggle={() => toggleSection(section.section_id)}
                    isLast={idx === sections.length - 1}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContractSectionBlock({
  section,
  index,
  isExpanded,
  onToggle,
  isLast,
}: {
  section: ContractSection
  index: number
  isExpanded: boolean
  onToggle: () => void
  isLast: boolean
}) {
  // Skip rendering header section_kind separately in the collapse view since it's the title
  const isHeader = section.section_kind === "header"

  return (
    <div className={!isLast ? "border-b border-border/50" : ""}>
      {/* Section Header (clickable) */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-8 py-3 text-left transition-colors hover:bg-accent/50"
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          {isExpanded ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )}
        </span>
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-foreground">
            {section.title}
          </span>
          {section.required && (
            <Badge variant="secondary" className="h-4 px-1 text-[9px] font-medium shrink-0">
              Required
            </Badge>
          )}
          {isHeader && (
            <Badge variant="outline" className="h-4 px-1 text-[9px] font-medium shrink-0 border-primary/20 text-primary bg-primary/5">
              Preamble
            </Badge>
          )}
        </span>
        <span className="ml-auto shrink-0 text-[10px] font-mono text-muted-foreground/50">
          {section.section_id}
        </span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-8 pb-6 pl-16">
          <div className="prose-contract text-[13px] leading-relaxed text-foreground/85 whitespace-pre-wrap">
            {section.content}
          </div>
        </div>
      )}
    </div>
  )
}
