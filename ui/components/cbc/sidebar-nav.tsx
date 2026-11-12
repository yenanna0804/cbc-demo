import * as React from "react"
import { cn } from "@/lib/utils"

export interface NavGroup {
  title: string
  items: { key: string; label: string; href: string; count?: number }[]
}

interface SidebarNavProps {
  brand: string
  subtitle?: string
  groups: NavGroup[]
  activeKey: string
  footer?: React.ReactNode
}

/** Thanh điều hướng trái nền sáng: nhóm có vạch trái màu chủ đạo, mục đang chọn nền #5879B9 chữ trắng. */
export function SidebarNav({ brand, subtitle, groups, activeKey, footer }: SidebarNavProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r bg-muted">
      <div className="border-b px-4 py-3">
        <b className="block text-md">{brand}</b>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-3">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="mb-1 mt-3 border-l-[3px] border-primary bg-nav-group px-2.5 py-1.5 text-sm font-bold uppercase tracking-wide text-nav-group-foreground">
              {g.title}
            </div>
            {g.items.map((it) => (
              <a
                key={it.key}
                href={it.href}
                aria-current={it.key === activeKey ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-sm px-2.5 py-1.5 text-sm text-foreground hover:bg-accent",
                  it.key === activeKey && "bg-primary text-primary-foreground hover:bg-primary"
                )}
              >
                {it.label}
                {it.count != null && (
                  <span className="rounded-sm bg-destructive px-1.5 text-xs font-bold text-white">{it.count}</span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>
      {footer && <div className="border-t px-4 py-2.5 text-xs text-muted-foreground">{footer}</div>}
    </aside>
  )
}
