import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-control w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm placeholder:text-faint",
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-primary-soft",
        "read-only:bg-muted disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
