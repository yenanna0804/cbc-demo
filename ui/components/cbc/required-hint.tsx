import * as React from "react"
import { cn } from "@/lib/utils"

/** Biểu tượng ⓘ đặt cạnh tiêu đề form: rê chuột, Tab tới hoặc chạm vào thì hiện "Dấu * đỏ là trường bắt buộc".
 *  Hiện khi hover + focus + chạm (điện thoại không có hover); Esc để đóng (WCAG 1.4.13). */
export function RequiredHint({ className, text = "là trường bắt buộc" }: { className?: string; text?: string }) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])
  return (
    <span className={cn("group relative ml-1.5 inline-flex align-middle", className)}>
      <button
        type="button"
        aria-label={`Chú thích: dấu * đỏ ${text}`}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className="grid size-[22px] place-items-center rounded-full border border-input bg-background font-serif text-[13px] font-bold italic leading-none text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        i
      </button>
      <span
        id={id}
        role="tooltip"
        className={cn(
          "absolute left-1/2 top-[calc(100%+8px)] z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1b2330] px-2.5 py-2 text-xs font-normal text-white shadow-md",
          "hidden group-hover:block group-focus-within:block",
          open && "block"
        )}
      >
        Dấu <span className="text-[#ff8a7a]">*</span> đỏ {text}
      </span>
    </span>
  )
}
