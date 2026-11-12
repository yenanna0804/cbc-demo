import type { Config } from "tailwindcss"

/** CBC CMS – Tailwind v3 config dùng chung với shadcn/ui. Xem DESIGN.md. */
const hsl = (v: string) => `hsl(var(--${v}))`

export default {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "16px" },
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "Roboto", "\"Helvetica Neue\"", "Arial", "sans-serif"],
      },
      // Ghi đè thang chữ: giao diện CMS dùng chữ 14px làm chuẩn (anna 12/11/2026)
      fontSize: {
        xs: ["12.5px", { lineHeight: "1.5" }],   // ghi chú, gợi ý, badge
        sm: ["14px", { lineHeight: "1.5" }],     // chữ thân, nhãn, nút, ô nhập, header bảng (MẶC ĐỊNH)
        base: ["14px", { lineHeight: "1.5" }],
        md: ["16px", { lineHeight: "1.4" }],     // h2, tiêu đề card
        lg: ["20px", { lineHeight: "1.3" }],     // h1 tiêu đề trang
        xl: ["26px", { lineHeight: "1.2" }],     // số KPI
        "2xl": ["32px", { lineHeight: "1.2" }],
      },
      colors: {
        border: { DEFAULT: hsl("border"), subtle: hsl("border-subtle") },
        input: hsl("input"),
        ring: hsl("ring"),
        background: hsl("background"),
        foreground: hsl("foreground"),
        faint: hsl("faint"),
        primary: {
          DEFAULT: hsl("primary"),
          hover: hsl("primary-hover"),
          foreground: hsl("primary-foreground"),
          soft: hsl("primary-soft"),
        },
        secondary: { DEFAULT: hsl("secondary"), foreground: hsl("secondary-foreground") },
        muted: { DEFAULT: hsl("muted"), foreground: hsl("muted-foreground") },
        accent: { DEFAULT: hsl("accent"), foreground: hsl("accent-foreground") },
        popover: { DEFAULT: hsl("popover"), foreground: hsl("popover-foreground") },
        card: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
        destructive: {
          DEFAULT: hsl("destructive"),
          foreground: hsl("destructive-foreground"),
          soft: hsl("destructive-soft"),
        },
        success: { DEFAULT: hsl("success"), soft: hsl("success-soft") },
        warning: { DEFAULT: hsl("warning"), soft: hsl("warning-soft") },
        info: { DEFAULT: hsl("info"), soft: hsl("info-soft") },
        nav: { group: hsl("nav-group"), "group-foreground": hsl("nav-group-foreground") },
      },
      borderRadius: {
        lg: "var(--radius)", // 3px: card, dialog
        md: "2px",           // nút, ô nhập, badge
        sm: "2px",
      },
      height: { control: "34px", "control-sm": "28px" },
    },
  },
  plugins: [],
} satisfies Config
