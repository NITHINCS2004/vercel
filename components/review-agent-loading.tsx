"use client"

import { useState, useEffect } from "react"
import { Bot, CheckCircle2, Loader2, FileSearch } from "lucide-react"
import { reviewProgressSteps } from "@/lib/mock-data"

interface ReviewAgentLoadingProps {
  onComplete: () => void
}

export function ReviewAgentLoading({ onComplete }: ReviewAgentLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  useEffect(() => {
    const stepDuration = 1200 // ms per step

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        setCompletedSteps((cs) => {
          const updated = new Set(cs)
          updated.add(prev)
          return updated
        })

        if (next >= reviewProgressSteps.length) {
          clearInterval(interval)
          // Brief pause after all steps complete, then trigger onComplete
          setTimeout(() => {
            onComplete()
          }, 800)
          return prev
        }
        return next
      })
    }, stepDuration)

    return () => clearInterval(interval)
  }, [onComplete])

  const progress = Math.round(
    ((completedSteps.size) / reviewProgressSteps.length) * 100
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-muted/30 px-6 py-10">
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="size-7 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                AI Review Agent
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Analyzing draft against playbook rules
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-mono font-medium text-foreground">{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps list */}
          <div className="mt-6 flex flex-col gap-1">
            {reviewProgressSteps.map((step, idx) => {
              const isCompleted = completedSteps.has(idx)
              const isActive = currentStep === idx && !isCompleted
              const isPending = idx > currentStep

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                    isActive
                      ? "bg-primary/5"
                      : isCompleted
                      ? "opacity-70"
                      : "opacity-40"
                  }`}
                >
                  {/* Step icon */}
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 className="size-4 text-success-foreground" />
                    ) : isActive ? (
                      <Loader2 className="size-4 animate-spin text-primary" />
                    ) : (
                      <FileSearch className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Step text */}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-foreground"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {(isActive || isCompleted) && (
                      <span className="text-xs text-muted-foreground">
                        {step.detail}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
