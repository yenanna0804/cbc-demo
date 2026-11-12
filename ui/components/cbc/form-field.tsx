import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  hint?: React.ReactNode   // gợi ý xám dưới ô
  error?: string           // lỗi đỏ dưới ô, thay cho hint
  className?: string
  children: React.ReactElement
}

/** Nhãn đậm ở trên – ô nhập – gợi ý/lỗi ở dưới. Trường bắt buộc có dấu * đỏ.
 *  Với Select: đặt id trực tiếp lên <SelectTrigger id=...> để nhãn trỏ đúng. */
export function FormField({ id, label, required, hint, error, className, children }: FormFieldProps) {
  const describedBy = error || hint ? `${id}-desc` : undefined
  const child = React.cloneElement(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  })
  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div>{child}</div>
      {error ? (
        <p id={describedBy} className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p id={describedBy} className="text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  )
}
