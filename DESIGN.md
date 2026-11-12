# CBC CMS – Design system

The UI conventions for the CMS of the Cell Broadcast (CBC) system, phase 1. Every new screen and every prototype should follow this document.

- **Stack:** [shadcn/ui](https://ui.shadcn.com) (Radix UI) + Tailwind CSS v3 + React 18 + TypeScript + lucide-react icons.
- **Source code:** folder [`ui/`](ui/).
- **Sample page:** [`ui/index.html`](ui/index.html), online at https://yenanna0804.github.io/cbc-demo/ui/. It renders the real components from `ui/components`.
- **Basis:** the UI style anna settled on 29/10/2026 for the demo, updated 12/11/2026:
  - System font stack, 14px text, bold labels.
  - Input fields with a 1px light-grey border, very slightly rounded corners and a light-blue border when focused.
  - White background, very light grey title bar, #5879B9 buttons, dark-grey text.

## 1. Folder layout

```
DESIGN.md                  ← this document
ui/
├── styles/globals.css     ← colour tokens (CSS variables) + base styles
├── tailwind.config.ts     ← maps tokens to Tailwind classes, type scale, radius
├── components.json        ← shadcn CLI config (run `npx shadcn add ...` here)
├── lib/utils.ts           ← cn() to merge classes
├── components/
│   ├── index.ts           ← exports every component
│   ├── ui/                ← shadcn base components, restyled for CBC
│   │   button, input, textarea, label, select, checkbox, radio-group,
│   │   card, badge, table, dialog, tabs, alert, separator
│   └── cbc/               ← CBC-specific components
│       status-badge, form-field, page-header, stat-tile, sidebar-nav
├── examples/compose-message.tsx  ← sample "Soạn bản tin" screen built from the components
├── preview/main.tsx       ← source of the sample page (+ app.js/app.css builds)
├── index.html             ← sample page
├── package.json, tsconfig.json
```

## 2. Colours

All colours are declared once in `ui/styles/globals.css` as HSL variables, following the shadcn convention. **Do not hard-code hex values in a component.** Use the Tailwind class names in the table below.

### 2.1 Main colours

| Token / Tailwind class | Hex | Use |
|---|---|---|
| `primary` | **#5879B9** | Primary button, selected menu item, links, active tab |
| `primary-hover` | #4767a4 | Primary button on hover |
| `primary-soft` | #eef2f9 | Light highlight background, role badge, focus halo |
| `foreground` | #333333 | Main text |
| `muted-foreground` | #666666 | Secondary text, descriptions |
| `faint` | #8c8c8c | Hints, placeholders |
| `muted` | #f5f6f8 | Title bar, table and card headers, sidebar |
| `accent` | #e9ecf1 | Menu or row hover |
| `border` | #d5d9df | Borders of inputs, cards and tables |
| `border-subtle` | #e8eaee | Table row lines |
| `ring` | #9db7e3 | Border of the focused input |
| `background` | #ffffff | Page background |
| `nav-group` / `nav-group-foreground` | #e3e9f3 / #1f3354 | Menu group heading |

### 2.2 Status colours (text / light background)

| Token | Text | Background | Use |
|---|---|---|---|
| `success` | #1e7b46 | #e6f4ec | Success, Đang phát |
| `warning` | #a15c00 | #fff4e0 | Chờ duyệt, warnings |
| `destructive` | #b4321f | #fdecea | Errors, Từ chối, Dừng, Xoá |
| `info` | #2a5ca8 | #e3eefb | Information, Chờ phát |

Colours are used in pairs: **dark text on its light background**, for example `bg-success-soft text-success`. Do not put white text on a light background.

### 2.3 Message statuses

The labels and colours match the demo exactly.

| Code | Label | Badge variant | Colour (text / background) |
|---|---|---|---|
| `draft` | Nháp | `neutral` | #4a5565 / #eef0f3 |
| `pending` | Chờ duyệt | `warning` | #a15c00 / #fff4e0 |
| `rejected` | Bị từ chối | `destructive` | #b4321f / #fdecea |
| `cancelled` | Đã huỷ | `muted` | #777777 / #f1f1f1 |
| `scheduled` | Chờ phát | `info` | #2a5ca8 / #e3eefb |
| `broadcasting` | Đang phát | `success` | #1e7b46 / #e6f4ec |
| `stopped` | Đã dừng | `violet` | #5b45a6 / #ece9f7 |
| `expired` | Hết hạn | `slate` | #41546b / #e9eef4 |

Always use `<StatusBadge status="..." />`. Do not build a status badge by hand.

## 3. Type, spacing, corners

- **Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` everywhere, including buttons and inputs. Each OS uses its own system font (San Francisco on macOS/iOS, Segoe UI on Windows, Roboto on Android); Arial is the fallback.
- **Type scale:** the Tailwind classes are overridden so that `text-sm` = 14px is the default size.

| Class | Size | Use |
|---|---|---|
| `text-xs` | 12.5px | Hints, notes, badges, menu group headings |
| `text-sm` / `text-base` | **14px** | Body text, labels, buttons, inputs, table headers |
| `text-md` | 16px | h2, card and dialog titles |
| `text-lg` | 20px | h1, page title |
| `text-xl` | 26px | KPI figures |
| `text-2xl` | 32px | Large figures |

- **Weights:** labels (`<Label>`), table headers and card titles are **bold**. Input values and body text are regular.
- **Control height:** inputs, selects and buttons are `h-control` = 34px. Small buttons are `h-control-sm` = 28px.
- **Corners:** buttons, inputs and badges use `rounded-md` = 2px. Cards and dialogs use `rounded-lg` = 3px. Do not use large radii.
- **Shadows:** cards have **no shadow**, only a 1px border. Only dialogs and popovers have a shadow.
- **Spacing:** card padding is 14px (`p-3.5`), the gap between fields is 12px (`gap-3`), and the gap between label and input is 6px (`gap-1.5`).
- **Icons:** lucide-react at 16px (`size-4`), placed before the button text.

## 4. Components

### 4.1 Base components (`components/ui`, from shadcn)

| Component | Variants / notes |
|---|---|
| `Button` | `variant`:<br>• `default`: primary button, #5879B9<br>• `outline`: secondary button with white background and border<br>• `secondary`<br>• `destructive`: red outline (Dừng, Từ chối)<br>• `destructive-solid`: solid red, for confirming inside a dialog<br>• `success`<br>• `ghost`<br>• `link`<br>`size`: `default`, `sm`, `lg`, `icon`. Supports `asChild` to wrap `<a>`. |
| `Input`, `Textarea` | 1px grey border. Focus gives a light-blue border with a light halo. `readOnly` gives a grey background. `aria-invalid` gives a red border. |
| `Label` | Bold, 14px. |
| `Select` | Radix Select. Put the `id` on `SelectTrigger`. |
| `Checkbox`, `RadioGroup` | 16px, primary colour when checked. |
| `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) | Very light grey header, buttons in the footer aligned right. |
| `Badge` | `default`, `neutral`, `success`, `warning`, `destructive`, `info`, `violet`, `slate`, `muted`, `outline`. |
| `Table` (+ `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`) | Light grey header with bold 14px text, thin row lines, row hover. |
| `Dialog` (+ `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`) | Header, body and footer split like a card. |
| `Tabs` | Underline style: the active tab has primary-colour text and a 2px underline. |
| `Alert` | `info`, `success`, `warning`, `destructive`. |
| `Separator` | A 1px line. |

### 4.2 CBC components (`components/cbc`)

| Component | Purpose |
|---|---|
| `StatusBadge` + `STATUS` | Badge for the 8 message statuses (§2.3). |
| `FormField` | Bold label + `*` for a required field + input + hint (grey) or error (red). Sets `id`, `aria-invalid` and `aria-describedby` automatically. |
| `PageHeader` | Page title + description + action buttons on the right. |
| `StatTile` | Figure tile for reports and dashboards (`tone`: default, success, warning, destructive). |
| `SidebarNav` | Light left menu: group headings with a primary-colour left bar, the selected item on a #5879B9 background with white text, and a red counter badge. |

### 4.3 Usage example

```tsx
import { Button, Input, FormField, StatusBadge, PageHeader } from "@/components/index"

<PageHeader title="Soạn bản tin"
  actions={<><Button variant="outline">Lưu nháp</Button><Button>Gửi duyệt</Button></>} />
<FormField id="title" label="Tiêu đề" required hint="Hiển thị trên dòng đầu bản tin">
  <Input placeholder="Nhập tiêu đề" />
</FormField>
<StatusBadge status="pending" />
```

A fuller example is in `ui/examples/compose-message.tsx`.

## 5. Layout rules

1. **Screen frame:**
   - A 256px left menu (`SidebarNav`).
   - A 44px title bar on a `bg-muted` background.
   - Content padded 16–20px.
   - Below 800px the menu is hidden behind a hamburger button.
2. **Page heading:** `PageHeader` comes first. The primary button goes **last on the right**. Each action area has **at most one** primary button, and the other buttons use `outline`.
3. **Forms:**
   - The label goes above the input. A required field has a red `*`.
   - The hint or error goes below the input.
   - Use 2 columns on desktop and 1 column below 800px.
4. **Tables:**
   - The STT column is narrow.
   - Codes (message code, Cell ID) use `font-mono`.
   - Statuses use `StatusBadge`.
   - Row actions use a `link` or `sm` button, aligned right.
5. **Dangerous actions** (Dừng bản tin, Từ chối, Xoá):
   - The trigger button is `destructive` (outline).
   - It always opens a `Dialog`. The confirm button is `destructive-solid`, and OTP is entered there when the process requires it.
6. **Feedback:** use an inline `Alert` on the screen and a short toast after an action. The text must say exactly what happened, for example "Đã gửi duyệt bản tin."
7. **Text:**
   - Write UI text in Vietnamese with full diacritics.
   - Use the function names exactly as in the URD (for example "Gửi duyệt", "Phát lại bản tin", "Hẹn giờ phát").
8. **Mobile:** every screen must fit a 390px width with no horizontal page scroll. Wide tables scroll inside their own frame.

## 6. Accessibility

- Every input has a `Label` linked to it by `htmlFor`/`id`. `FormField` does this for you.
- Focus is always visible (`ring`). Do not remove the outline without providing a replacement.
- Never use colour as the only signal: a status badge always carries its text label.
- An icon-only button must have an `aria-label`.

## 7. Adding a component from shadcn

```bash
cd ui
npx shadcn@latest add <component>   # uses components.json, style default, Tailwind v3
```

After adding, change it to fit CBC:

- Use the `h-control` height.
- Use `rounded-md` (2px).
- Use `text-sm` (14px).
- Remove the `shadow` unless it is a popover or dialog.
- Use colour tokens only, never hex.

Then add an export in `components/index.ts` and a sample in `preview/main.tsx`.

## 8. Rebuilding the sample page

`preview/app.js` and `preview/app.css` are build outputs. Rebuild them after changing a component:

```bash
cd ui
npm install && npm install react@18.3.1 react-dom@18.3.1 esbuild@0.24.0
npx tsc -p .                                   # type check
npx esbuild preview/main.tsx --bundle --minify --alias:@=. \
  --define:process.env.NODE_ENV='"production"' --outfile=preview/app.js
npx tailwindcss -c tailwind.config.ts -i styles/globals.css -o preview/app.css --minify \
  --content "./components/**/*.tsx,./preview/main.tsx"
```

## 9. Relationship to the current demo

- The current HTML demo (`index.html` at the repo root) is written in plain JS and plain CSS. It **uses the same colours, font and 14px type scale** as this document; its CSS variables are `--pri`, `--line`, `--head` and so on.
- When the CMS is rebuilt in React, use `ui/` directly and stop copying CSS from the demo.
- Dark mode: not defined for phase 1.
