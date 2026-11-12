import { Badge, type BadgeProps } from "@/components/ui/badge"

/** Trạng thái bản tin – đúng 8 trạng thái đang dùng trong demo CMS. */
export type MessageStatus =
  | "draft" | "pending" | "rejected" | "cancelled"
  | "scheduled" | "broadcasting" | "stopped" | "expired"

export const STATUS: Record<MessageStatus, { label: string; variant: NonNullable<BadgeProps["variant"]> }> = {
  draft:        { label: "Nháp",       variant: "neutral" },
  pending:      { label: "Chờ duyệt",  variant: "warning" },
  rejected:     { label: "Bị từ chối", variant: "destructive" },
  cancelled:    { label: "Đã huỷ",     variant: "muted" },
  scheduled:    { label: "Chờ phát",   variant: "info" },
  broadcasting: { label: "Đang phát",  variant: "success" },
  stopped:      { label: "Đã dừng",    variant: "violet" },
  expired:      { label: "Hết hạn",    variant: "slate" },
}

export function StatusBadge({ status }: { status: MessageStatus }) {
  const s = STATUS[status]
  return <Badge variant={s.variant}>{s.label}</Badge>
}
