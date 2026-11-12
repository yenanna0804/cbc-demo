import { cn } from "@/lib/utils"

interface StatTileProps {
  label: string
  value: string | number
  sub?: string
  tone?: "default" | "success" | "warning" | "destructive"
  className?: string
}

const toneClass = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
}

/** Ô số liệu tổng quan (báo cáo chiến dịch, dashboard). */
export function StatTile({ label, value, sub, tone = "default", className }: StatTileProps) {
  return (
    <div className={cn("rounded-lg border bg-card px-3.5 py-3", className)}>
      <div className="text-sm font-bold">{label}</div>
      <div className={cn("my-1.5 text-xl font-bold tabular-nums", toneClass[tone])}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  )
}
