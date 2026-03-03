"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { DraftForReview, ContractStatus, ReviewStatus, RiskTier } from "@/lib/mock-data"
import { draftsForReview } from "@/lib/mock-data"

const ITEMS_PER_PAGE = 5

function getStatusBadge(status: ContractStatus) {
  const variants: Record<ContractStatus, { className: string; label: string }> = {
    DRAFTING: { className: "bg-muted text-muted-foreground", label: "Drafting" },
    IN_REVIEW: { className: "bg-primary/15 text-primary border-primary/20", label: "In Review" },
    CHANGES_REQUESTED: { className: "bg-warning/15 text-warning-foreground border-warning/20", label: "Changes Requested" },
    APPROVED: { className: "bg-success/15 text-success border-success/20", label: "Approved" },
  }
  const v = variants[status]
  return <Badge variant="outline" className={`text-[10px] font-semibold ${v.className}`}>{v.label}</Badge>
}

function getReviewStatusBadge(status: ReviewStatus) {
  const variants: Record<ReviewStatus, { className: string; label: string }> = {
    PENDING: { className: "bg-primary/15 text-primary border-primary/20", label: "Pending" },
    AWAITING_DECISION: { className: "bg-warning/15 text-warning-foreground border-warning/20", label: "Awaiting Decision" },
    COMPLETED: { className: "bg-success/15 text-success border-success/20", label: "Completed" },
  }
  const v = variants[status]
  return <Badge variant="outline" className={`text-[10px] font-semibold ${v.className}`}>{v.label}</Badge>
}

function getRiskBadge(risk: RiskTier) {
  const variants: Record<RiskTier, { className: string }> = {
    HIGH: { className: "bg-destructive/15 text-destructive border-destructive/20" },
    MEDIUM: { className: "bg-warning/15 text-warning-foreground border-warning/20" },
    LOW: { className: "bg-success/15 text-success border-success/20" },
  }
  const v = variants[risk]
  return <Badge variant="outline" className={`text-[10px] font-semibold ${v.className}`}>{risk}</Badge>
}

interface DraftsTableProps {
  onViewDraft?: (draft: DraftForReview) => void
}

export function DraftsTable({ onViewDraft }: DraftsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredDrafts = draftsForReview.filter((draft: DraftForReview) => {
    const matchesSearch =
      searchQuery === "" ||
      draft.draft_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.submitted_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.party_a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.party_b.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRisk = riskFilter === "all" || draft.risk_tier === riskFilter
    const matchesStatus = statusFilter === "all" || draft.status === statusFilter

    return matchesSearch && matchesRisk && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredDrafts.length / ITEMS_PER_PAGE))
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedDrafts = filteredDrafts.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Drafts Pending Review</h2>
        <span className="text-xs text-muted-foreground">
          {filteredDrafts.length} draft{filteredDrafts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, parties..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-muted-foreground" />
          <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="h-8 w-[130px] text-xs bg-background">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="h-8 w-[160px] text-xs bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="CHANGES_REQUESTED">Changes Requested</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1">
                  Draft ID
                  <ArrowUpDown className="size-3" />
                </div>
              </TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Parties</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Jurisdiction</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Risk</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Review</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Submitted By</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">Ver.</TableHead>
              <TableHead className="h-9 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDrafts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-sm text-muted-foreground">
                  No drafts match your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDrafts.map((draft) => (
                <TableRow key={draft.draft_id} className="border-border hover:bg-accent/50 transition-colors">
                  <TableCell className="py-3">
                    <span className="font-mono text-xs font-semibold text-foreground">{draft.draft_id}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {draft.contract_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium text-foreground">{draft.party_a}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {"& "}
                        {draft.party_b}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{draft.state}</span>
                  </TableCell>
                  <TableCell>{getRiskBadge(draft.risk_tier)}</TableCell>
                  <TableCell>{getStatusBadge(draft.status)}</TableCell>
                  <TableCell>{getReviewStatusBadge(draft.review_status)}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{draft.submitted_by}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(draft.submitted_at), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex size-6 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-muted-foreground">
                      {"v"}{draft.version_no}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            onClick={() => onViewDraft?.(draft)}
                          >
                            <Eye className="size-3.5" />
                            <span className="sr-only">View draft {draft.draft_id}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Review draft</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing {startIdx + 1}{"\u2013"}{Math.min(startIdx + ITEMS_PER_PAGE, filteredDrafts.length)} of {filteredDrafts.length}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-3.5" />
            <span className="sr-only">Previous page</span>
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="size-7 text-xs"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-3.5" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
