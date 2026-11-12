import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Nút chính: Lưu, Gửi duyệt, Phê duyệt, Tìm kiếm. Tối đa 1 nút chính mỗi vùng thao tác.
        default: "border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:border-primary-hover",
        // Nút phụ: Huỷ, Quay lại, Làm mới, Xuất file
        outline: "border-border bg-background text-foreground hover:bg-accent",
        secondary: "border-border bg-muted text-foreground hover:bg-accent",
        // Thao tác nguy hiểm dạng viền: Dừng bản tin, Từ chối, Xoá (trước khi xác nhận)
        destructive: "border-destructive/30 bg-background text-destructive hover:bg-destructive-soft",
        // Nút xác nhận nguy hiểm trong hộp thoại
        "destructive-solid": "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "border-success bg-success text-white hover:bg-success/90",
        ghost: "border-transparent bg-transparent hover:bg-accent",
        link: "border-transparent bg-transparent px-1 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-control px-3.5",
        sm: "h-control-sm px-2 text-xs",
        lg: "h-10 px-5 text-md",
        icon: "h-control w-[34px] px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
