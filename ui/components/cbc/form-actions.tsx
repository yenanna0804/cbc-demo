import * as React from "react"
import { cn } from "@/lib/utils"

/** Cụm nút cuối form / hộp thoại: căn TRÁI thẳng mép ô nhập, nút chính đứng ĐẦU, Huỷ/Quay lại dạng link đứng cuối.
 *  Căn cứ: GOV.UK Button ("Align the primary action button to the left edge of your form"),
 *  UK Parliament Design System ("Do not place buttons to the right of the form"). */
export function FormActions({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
}
