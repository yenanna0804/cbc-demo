import * as React from "react"
import { cn } from "@/lib/utils"
import { RequiredHint } from "./required-hint"

interface PageHeaderProps {
  title: string
  /** true: thêm ⓘ chú thích dấu * cạnh tiêu đề (trang có form) */
  requiredHint?: boolean
  description?: string
  actions?: React.ReactNode  // thanh thao tác của trang chi tiết/danh sách (không phải nút submit form)
  className?: string
}

export function PageHeader({ title, requiredHint, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        <h1 className="text-lg font-bold">{title}{requiredHint && <RequiredHint />}</h1>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
