"use client"

import { useState, useCallback } from "react"
import {
  AlertTriangle,
  Shield,
  BookOpen,
  FileText,
  Check,
  X,
  MessageSquare,
  Send,
  ChevronRight,
  Quote,
  Scale,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import type { ReviewReport, ReviewFinding, ClauseDecision, FindingSeverity, DraftForReview } from "@/lib/mock-data"

function getSeverityConfig(severity: FindingSeverity) {
  const map: Record<FindingSeverity, { label: string; className: string; dotClass: string }> = {
    HIGH: {
      label: "High Risk",
      className: "bg-destructive/10 text-destructive border-destructive/20",
      dotClass: "bg-destructive",
    },
    MEDIUM: {
      label: "Medium Risk",
      className: "bg-warning/10 text-warning-foreground border-warning/20",
      dotClass: "bg-warning",
    },
    LOW: {
      label: "Low Risk",
      className: "bg-muted text-muted-foreground border-border",
      dotClass: "bg-muted-foreground",
    },
  }
  return map[severity]
}

function getDecisionConfig(decision: ClauseDecision) {
  const map: Record<ClauseDecision, { label: string; className: string; dotClass: string }> = {
    PENDING: {
      label: "Pending",
      className: "bg-muted text-muted-foreground border-border",
      dotClass: "bg-muted-foreground",
    },
    ACCEPTED: {
      label: "Accepted",
      className: "bg-success/10 text-success-foreground border-success/20",
      dotClass: "bg-success",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-destructive/10 text-destructive border-destructive/20",
      dotClass: "bg-destructive",
    },
  }
  return map[decision]
}

interface PlaybookReviewReportProps {
  report: ReviewReport
  draft: DraftForReview
  onClose: () => void
}

export function PlaybookReviewReport({ report, draft, onClose }: PlaybookReviewReportProps) {
  const [findings, setFindings] = useState<ReviewFinding[]>(report.findings)
  const [selectedFindingId, setSelectedFindingId] = useState<number>(
    report.findings[0]?.id ?? 0
  )
  const [showCommentInput, setShowCommentInput] = useState<number | null>(null)
  const [commentDraft, setCommentDraft] = useState("")

  const selectedFinding = findings.find((f) => f.id === selectedFindingId) ?? null

  const updateFindingDecision = useCallback(
    (findingId: number, decision: ClauseDecision) => {
      setFindings((prev) =>
        prev.map((f) => (f.id === findingId ? { ...f, decision } : f))
      )
    },
    []
  )

  const submitComment = useCallback(
    (findingId: number) => {
      if (!commentDraft.trim()) return
      setFindings((prev) =>
        prev.map((f) =>
          f.id === findingId ? { ...f, legal_comment: commentDraft.trim() } : f
        )
      )
      setCommentDraft("")
      setShowCommentInput(null)
    },
    [commentDraft]
  )

  const handleRequestChanges = () => {
    // Only enabled when ALL findings have been decided (no PENDING)
    // Updates contract status to CHANGES_REQUESTED and sends back to BU
    // In a real app: POST /api/v1/reviews/{contract_id}/request-changes
    // - Sets review_requests.status = 'COMPLETED'
    // - Sets contracts.status = 'CHANGES_REQUESTED'
    // - Freezes the reviewed version as immutable
    // - Enables redline mode for BU to see accepted/rejected clauses + comments
    onClose()
  }

  const pendingCount = findings.filter((f) => f.decision === "PENDING").length
  const acceptedCount = findings.filter((f) => f.decision === "ACCEPTED").length
  const rejectedCount = findings.filter((f) => f.decision === "REJECTED").length
  const allDecided = pendingCount === 0

  const highCount = findings.filter((f) => f.severity === "HIGH").length
  const mediumCount = findings.filter((f) => f.severity === "MEDIUM").length
  const lowCount = findings.filter((f) => f.severity === "LOW").length

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Report Header */}
      <div className="shrink-0 border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Scale className="size-4 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-sm font-semibold text-foreground">
                Playbook Review Report
              </h2>
              <p className="text-xs text-muted-foreground">
                {draft.contract_type} {"\u2013"} {draft.party_a} & {draft.party_b}
                {" | "}{findings.length} flagged clause{findings.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Request Changes -- only when ALL findings are decided */}
            <Button
              size="sm"
              className={`gap-2 ${
                allDecided
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              }`}
              variant={allDecided ? "default" : "outline"}
              onClick={handleRequestChanges}
              disabled={!allDecided}
            >
              <Send className="size-3.5" />
              Request Changes
              {!allDecided && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px] font-mono">
                  {pendingCount} left
                </Badge>
              )}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
              <span className="sr-only">Close review report</span>
            </Button>
          </div>
        </div>

        {/* Stats ribbon */}
        <div className="flex items-center gap-4 border-t border-border bg-muted/50 px-6 py-2">
          {/* Severity breakdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Severity:</span>
          </div>
          {highCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-destructive" />
              <span className="text-[11px] text-muted-foreground">High: {highCount}</span>
            </div>
          )}
          {mediumCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-warning" />
              <span className="text-[11px] text-muted-foreground">Medium: {mediumCount}</span>
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Low: {lowCount}</span>
            </div>
          )}
          <Separator orientation="vertical" className="h-4" />
          {/* Decision progress */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Decisions:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-muted-foreground/40" />
            <span className="text-[11px] text-muted-foreground">Pending: {pendingCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-success" />
            <span className="text-[11px] text-muted-foreground">Accepted: {acceptedCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-destructive" />
            <span className="text-[11px] text-muted-foreground">Rejected: {rejectedCount}</span>
          </div>
          {/* Progress indicator */}
          <div className="ml-auto flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${allDecided ? 100 : ((findings.length - pendingCount) / findings.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-medium text-muted-foreground">
              {findings.length - pendingCount}/{findings.length}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex min-h-0 flex-1">
        {/* Left: Flagged Clauses List */}
        <div className="w-72 shrink-0 border-r border-border bg-card xl:w-80">
          <div className="shrink-0 border-b border-border px-4 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Flagged Clauses
            </h3>
          </div>
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-0.5 p-2">
              {findings.map((finding) => {
                const sevConfig = getSeverityConfig(finding.severity)
                const decConfig = getDecisionConfig(finding.decision)
                const isSelected = finding.id === selectedFindingId

                return (
                  <button
                    key={finding.id}
                    onClick={() => setSelectedFindingId(finding.id)}
                    className={`flex w-full flex-col gap-2 rounded-lg px-3 py-3 text-left transition-colors ${
                      isSelected
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground leading-snug">
                        {finding.section_title}
                      </span>
                      <ChevronRight
                        className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                          isSelected ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`h-4 px-1 text-[9px] font-semibold ${sevConfig.className}`}
                      >
                        {sevConfig.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`h-4 px-1 text-[9px] font-semibold ${decConfig.className}`}
                      >
                        {decConfig.label}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {finding.issue_summary}
                    </p>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Finding Detail */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted/30">
          {selectedFinding ? (
            <FindingDetailPanel
              finding={selectedFinding}
              onDecision={updateFindingDecision}
              showCommentInput={showCommentInput === selectedFinding.id}
              onToggleComment={() =>
                setShowCommentInput((prev) =>
                  prev === selectedFinding.id ? null : selectedFinding.id
                )
              }
              commentDraft={commentDraft}
              onCommentChange={setCommentDraft}
              onSubmitComment={() => submitComment(selectedFinding.id)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a flagged clause to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Finding Detail Panel */

function FindingDetailPanel({
  finding,
  onDecision,
  showCommentInput,
  onToggleComment,
  commentDraft,
  onCommentChange,
  onSubmitComment,
}: {
  finding: ReviewFinding
  onDecision: (id: number, decision: ClauseDecision) => void
  showCommentInput: boolean
  onToggleComment: () => void
  commentDraft: string
  onCommentChange: (val: string) => void
  onSubmitComment: () => void
}) {
  const sevConfig = getSeverityConfig(finding.severity)
  const decConfig = getDecisionConfig(finding.decision)

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto max-w-3xl px-6 py-6">
        {/* Title + severity + decision status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold text-foreground">
              {finding.section_title}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {finding.block_id} | {finding.issue_type}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className={`gap-1.5 px-2.5 py-1 text-xs font-semibold ${sevConfig.className}`}
            >
              <div className={`size-2 rounded-full ${sevConfig.dotClass}`} />
              {sevConfig.label}
            </Badge>
            <Badge
              variant="outline"
              className={`gap-1.5 px-2.5 py-1 text-xs font-semibold ${decConfig.className}`}
            >
              <div className={`size-2 rounded-full ${decConfig.dotClass}`} />
              {decConfig.label}
            </Badge>
          </div>
        </div>

        <Separator className="my-5" />

        {/* Original Clause Text */}
        <DetailSection icon={Quote} title="Original Clause Text">
          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
              {finding.original_clause_text}
            </p>
          </div>
        </DetailSection>

        {/* Issue Summary */}
        <DetailSection icon={AlertTriangle} title="Issue Summary">
          <p className="text-sm leading-relaxed text-foreground/85">
            {finding.issue_summary}
          </p>
        </DetailSection>

        {/* Violation Explanation */}
        <DetailSection icon={Shield} title="Why It Violates Playbook">
          <p className="text-sm leading-relaxed text-foreground/85">
            {finding.violation_explanation}
          </p>
        </DetailSection>

        {/* Playbook Rule Citation */}
        <DetailSection icon={BookOpen} title="Playbook Rule Citation">
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm font-medium text-foreground">
              {finding.playbook_rule_citation}
            </p>
          </div>
        </DetailSection>

        {/* Approved Fallback Language */}
        <DetailSection icon={FileText} title="Approved Fallback Language">
          <div className="rounded-lg border border-success/20 bg-success/5 px-4 py-3">
            <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
              {finding.approved_fallback_language}
            </p>
          </div>
        </DetailSection>

        {/* Risk Explanation */}
        <DetailSection icon={AlertTriangle} title="Risk Explanation">
          <p className="text-sm leading-relaxed text-foreground/85">
            {finding.risk_explanation}
          </p>
        </DetailSection>

        <Separator className="my-5" />

        {/* Decision Actions */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Clause Decision
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            {/* Accept Change - Approves replacing the clause with fallback language */}
            <Button
              size="sm"
              variant={finding.decision === "ACCEPTED" ? "default" : "outline"}
              className={`gap-2 ${
                finding.decision === "ACCEPTED"
                  ? "bg-success text-success-foreground hover:bg-success/90"
                  : ""
              }`}
              onClick={() => onDecision(finding.id, "ACCEPTED")}
            >
              <Check className="size-3.5" />
              Accept Change
            </Button>

            {/* Reject Change - Keeps the original clause as-is (legal override) */}
            <Button
              size="sm"
              variant={finding.decision === "REJECTED" ? "default" : "outline"}
              className={`gap-2 ${
                finding.decision === "REJECTED"
                  ? "bg-destructive text-primary-foreground hover:bg-destructive/90"
                  : ""
              }`}
              onClick={() => onDecision(finding.id, "REJECTED")}
            >
              <X className="size-3.5" />
              Reject Change
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Add Comment -- optional annotation for BU */}
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={onToggleComment}
            >
              <MessageSquare className="size-3.5" />
              {finding.legal_comment ? "Edit Comment" : "Add Comment"}
            </Button>
          </div>

          {/* Explanation of what each action means */}
          <div className="mt-3 flex flex-col gap-1.5">
            {finding.decision === "ACCEPTED" && (
              <p className="flex items-start gap-2 text-xs text-success-foreground">
                <Check className="mt-0.5 size-3 shrink-0" />
                <span>
                  Clause will be replaced with the approved fallback language.
                  A new contract version will be generated with this change applied.
                </span>
              </p>
            )}
            {finding.decision === "REJECTED" && (
              <p className="flex items-start gap-2 text-xs text-destructive">
                <X className="mt-0.5 size-3 shrink-0" />
                <span>
                  Original clause will be kept as-is. The fallback suggestion is discarded.
                  No version change for this clause.
                </span>
              </p>
            )}
            {finding.decision === "PENDING" && (
              <p className="text-xs text-muted-foreground">
                Choose to accept the fallback language or reject and keep the original clause.
              </p>
            )}
          </div>
        </div>

        {/* Comment input */}
        {showCommentInput && (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <label className="text-xs font-semibold text-muted-foreground">
              Legal Comment (visible to Business User in redline mode)
            </label>
            <Textarea
              placeholder="Add reasoning for your decision, instructions for the BU, or notes..."
              value={commentDraft || finding.legal_comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={onToggleComment}>
                Cancel
              </Button>
              <Button size="sm" className="gap-2" onClick={onSubmitComment}>
                <ArrowRight className="size-3.5" />
                Save Comment
              </Button>
            </div>
          </div>
        )}

        {/* Existing comment display */}
        {finding.legal_comment && !showCommentInput && (
          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">
                Legal Comment
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">
              {finding.legal_comment}
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

/* Detail Section Helper */

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="size-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      </div>
      {children}
    </div>
  )
}
