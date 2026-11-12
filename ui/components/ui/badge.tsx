import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-px text-xs font-bold leading-[18px]",
  {
    variants: {
      variant: {
        default: "bg-primary-soft text-primary",
        neutral: "bg-[#eef0f3] text-[#4a5565]",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        destructive: "bg-destructive-soft text-destructive",
        info: "bg-info-soft text-info",
        violet: "bg-[#ece9f7] text-[#5b45a6]",
        slate: "bg-[#e9eef4] text-[#41546b]",
        muted: "bg-[#f1f1f1] text-[#777777]",
        outline: "border border-border bg-background text-foreground font-normal",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
