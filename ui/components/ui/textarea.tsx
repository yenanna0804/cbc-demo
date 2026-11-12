import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[90px] w-full resize-y rounded-md border border-input bg-background px-2.5 py-2 text-sm placeholder:text-faint",
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-primary-soft",
        "read-only:bg-muted disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"

export { Textarea }
