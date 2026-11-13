# CBC CMS – Design system

The UI conventions for the CMS of the Cell Broadcast (CBC) system, phase 1. Every new screen and every prototype should follow this document.

- **Stack:** [shadcn/ui](https://ui.shadcn.com) (Radix UI) + Tailwind CSS v3 + React 18 + TypeScript + lucide-react icons.
- **Source code:** folder [`ui/`](ui/).
- **Sample page:** [`ui/index.html`](ui/index.html), online at https://yenanna0804.github.io/cbc-demo/ui/. It renders the real components from `ui/components`.
- **Basis:** the UI style anna settled on 29/10/2026 for the demo, updated 13/11/2026 to follow public standards (§0):
  - Public Sans font, 16px body text, bold labels.
  - Input fields with a 1px grey border, very slightly rounded corners and a primary-colour border when focused.
  - White background, very light grey title bar, #4767a4 buttons, dark-grey text.
  - Every colour pair meets WCAG 2.2 AA.

## 0. Standards referenced

| Source | What we take from it |
|---|---|
| [U.S. Web Design System – Typography](https://designsystem.digital.gov/components/typography/) | Body text at least 16px; line height at least 1.5; 45–90 characters per line; Public Sans recommended for interfaces. |
| [GOV.UK Design System – Type scale](https://design-system.service.gov.uk/styles/type-scale) | Comparison: body 19px, small text 16px. |
| WCAG 2.2 AA ([target size SC 2.5.8](https://kb.daisy.org/publishing/docs/wcag/target-size-minimum.html)) | Text contrast ≥ 4.5:1; borders of inputs and focus indicators ≥ 3:1; click targets ≥ 24×24px. |
| [FCC findings on the 2018 Hawaii false missile alert](https://techcrunch.com/2018/01/30/details-and-solutions-emerge-for-missile-threat-false-alarm-in-hawaii/) | Test and live must look clearly different; confirmation wording must differ between test and live; two-person validation; correction template. |
| [SAFECOM/NCSWIC – Ten Keys to Improving Alerts, Warnings and Notifications](https://www.cyber.gov/sites/default/files/publications/safecom-ncswic_ten_keys_to_improving_awns_4.26.19_-_final_section_508_compliant.pdf) | Preview and cancel before sending; history and logs; prepared templates; separate drafting and approval roles; test environment visually distinct (colour + TEST label). |

The operational items (test mode, correction template) are **not** in the customer requirements for phase 1. They are listed here as reference only and are not added to the URD.

## 1. Folder layout

```
DESIGN.md                  ← this document
ui/
├── fonts/                ← Public Sans woff2 + public-sans.css + OFL licence
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
│       status-badge, form-field, page-header, stat-tile, sidebar-nav,
│       form-actions, required-hint
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
| `primary` | **#4767a4** | Primary button, selected menu item, links, active tab, focus ring (5.61:1 on white) |
| `primary-hover` | #3a5791 | Primary button on hover |
| `primary-soft` | #eef2f9 | Light highlight background, role badge, focus halo |
| `foreground` | #333333 | Main text |
| `muted-foreground` | #666666 | Secondary text, descriptions |
| `faint` | #767676 | Hints, placeholders (4.54:1) |
| `muted` | #f5f6f8 | Title bar, table and card headers, sidebar |
| `accent` | #e9ecf1 | Menu or row hover |
| `border` | #d5d9df | Borders of cards and tables, dividers (decorative only) |
| `input` | #858d9b | Borders of inputs, selects, checkboxes, radios (3.34:1) |
| `border-subtle` | #e8eaee | Table row lines |
| `ring` | #4767a4 | Focus border / ring |
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
| `cancelled` | Đã huỷ | `muted` | #666666 / #f1f1f1 |
| `scheduled` | Chờ phát | `info` | #2a5ca8 / #e3eefb |
| `broadcasting` | Đang phát | `success` | #1e7b46 / #e6f4ec |
| `stopped` | Đã dừng | `violet` | #5b45a6 / #ece9f7 |
| `expired` | Hết hạn | `slate` | #41546b / #e9eef4 |

Always use `<StatusBadge status="..." />`. Do not build a status badge by hand.

## 3. Type, spacing, corners

- **Font:** `"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` everywhere, including buttons and inputs. Public Sans (SIL OFL 1.1, by USWDS) is **self-hosted** in `ui/fonts/` and `fonts/` (latin, latin-ext, vietnamese subsets, weights 400–700, normal + italic). Do not load it from Google Fonts: the CMS may run on an internal network. Include `fonts/public-sans.css` in every page before the app CSS.
- **Type scale:** the Tailwind classes are overridden so that `text-sm` = 16px is the default size (USWDS minimum).

| Class | Size | Use |
|---|---|---|
| `text-xs` | 14px | Hints, notes, badges, menu group headings |
| `text-sm` / `text-base` | **16px** | Body text, labels, buttons, inputs, table headers |
| `text-md` | 18px | h2, card and dialog titles |
| `text-lg` | 24px | h1, page title |
| `text-xl` | 30px | KPI figures |
| `text-2xl` | 36px | Large figures |

- **Weights:** labels (`<Label>`), table headers and card titles are **bold**. Input values and body text are regular.
- **Control height:** inputs, selects and buttons are `h-control` = 40px. Small buttons are `h-control-sm` = 32px (both above the 24px WCAG minimum).
- **Corners:** buttons, inputs and badges use `rounded-md` = 2px. Cards and dialogs use `rounded-lg` = 3px. Do not use large radii.
- **Shadows:** cards have **no shadow**, only a 1px border. Only dialogs and popovers have a shadow.
- **Spacing:** card padding is 14px (`p-3.5`), the gap between fields is 12px (`gap-3`), and the gap between label and input is 6px (`gap-1.5`).
- **Icons:** lucide-react at 16px (`size-4`), placed before the button text.

## 4. Components

### 4.1 Base components (`components/ui`, from shadcn)

| Component | Variants / notes |
|---|---|
| `Button` | `variant`:<br>• `default`: primary button, #4767a4<br>• `outline`: secondary button with white background and border<br>• `secondary`<br>• `destructive`: red outline (Dừng, Từ chối)<br>• `destructive-solid`: solid red, for confirming inside a dialog<br>• `success`<br>• `ghost`<br>• `link`<br>`size`: `default`, `sm`, `lg`, `icon`. Supports `asChild` to wrap `<a>`. `loading` disables the button and sets `aria-busy` while sending. |
| `Input`, `Textarea` | 1px grey border. Focus gives a light-blue border with a light halo. `readOnly` gives a grey background. `aria-invalid` gives a red border. |
| `Label` | Bold, 16px. |
| `Select` | Radix Select. Put the `id` on `SelectTrigger`. |
| `Checkbox`, `RadioGroup` | 18px, primary colour when checked. |
| `Card` (+ `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) | Very light grey header, buttons in the footer aligned right. |
| `Badge` | `default`, `neutral`, `success`, `warning`, `destructive`, `info`, `violet`, `slate`, `muted`, `outline`. |
| `Table` (+ `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`) | Light grey header with bold 16px text, thin row lines, row hover. |
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
| `FormActions` | Button group at the end of a form or dialog: left-aligned, primary first, Huỷ as a link (§5.5). |
| `RequiredHint` | ⓘ icon with the "Dấu * đỏ là trường bắt buộc" tooltip on hover, focus and tap (§5.4). |
| `SidebarNav` | Light left menu: group headings with a primary-colour left bar, the selected item on a #4767a4 background with white text, and a red counter badge. |

### 4.3 Usage example

```tsx
import { Button, Input, FormField, FormActions, StatusBadge, PageHeader } from "@/components/index"

<PageHeader title="Soạn bản tin" requiredHint />
<FormField id="title" label="Tiêu đề" required hint="Hiển thị trên dòng đầu bản tin">
  <Input placeholder="Nhập tiêu đề" />
</FormField>
<FormActions>
  <Button loading={sending}>Gửi duyệt</Button>
  <Button variant="outline">Lưu nháp</Button>
  <Button variant="link">Huỷ</Button>
</FormActions>
<StatusBadge status="pending" />
```

A fuller example is in `ui/examples/compose-message.tsx`.

## 5. Layout rules

Settled by anna on 13/11/2026, based on [USWDS Form](https://designsystem.digital.gov/components/form/), [GOV.UK Button](https://design-system.service.gov.uk/components/button/), [GOV.UK Question pages](https://design-system.service.gov.uk/patterns/question-pages), [UK Parliament – Designing forms](https://designsystem.parliament.uk/how-tos/designing-forms/) and [NN/g – OK/Cancel](https://www.nngroup.com/articles/ok-cancel-or-cancel-ok/).

1. **Screen frame:**
   - A 288px left menu (`SidebarNav`).
   - A title bar on a `bg-muted` background.
   - Content padded 16–20px.
   - Below 800px the menu is hidden behind a hamburger button.
2. **Forms: one column.**
   - One field per row, stacked vertically ("Use simple vertical layouts" – USWDS; "You must lay out forms using a single column" – UK Parliament).
   - Keep the form column to about 720px wide (`max-w-[720px]`) so lines stay readable.
   - Exception: a filter/search bar above a table may sit on one row. It is a toolbar, not a data-entry form.
   - The compose screen keeps the **message preview on the right**, because SAFECOM recommends previewing before sending. Only the preview sits on the right; every input stays in the single left column.
3. **Labels, hints and errors:**
   - The label goes above the input.
   - The hint (grey) and the error (red) go directly under the input, aligned with it.
   - On a failed submit, also show a summary alert at the top of the form naming the fields with errors.
4. **Required fields:**
   - Mark each one with a red `*` after the label (USWDS).
   - Do not write the explanation as a line of text in the form. Put an **ⓘ icon next to the form title** (`<RequiredHint />`, or `<PageHeader requiredHint />`). It shows "Dấu * đỏ là trường bắt buộc" on mouse hover, on keyboard focus (Tab) and on tap (phones have no hover). Esc closes it.
5. **Buttons at the end of a form or dialog** (`<FormActions>`, `CardFooter`, `DialogFooter`):
   - Put them **below the last field, aligned left** with the edge of the inputs ("Align the primary action button to the left edge of your form" – GOV.UK; "Do not place buttons to the right of the form" – UK Parliament).
   - Order them as: **primary button first**, then the secondary button (`outline`), then **Huỷ / Quay lại as a `link`**. Example: `[Gửi duyệt] [Lưu nháp] Huỷ`.
   - Each action area has **at most one** primary button.
6. **Page toolbar** (detail and list pages, not forms):
   - Actions for the whole record, such as Duyệt và phát, Từ chối, Dừng or Tạo bản tin, sit in `PageHeader` on the right.
   - These are commands on an existing record, not the submit of a form.
7. **Dangerous actions** (Dừng bản tin, Từ chối, Xoá):
   - The first button is `destructive` (outline).
   - It always opens a `Dialog`. The confirm button is `destructive-solid` and its text says exactly what will happen ("Xác nhận dừng"). OTP is entered there when the process requires it.
   - Do not rely on red alone (GOV.UK).
8. **Prevent double submission:**
   - While a request is being sent, the button is `loading` (disabled + `aria-busy`).
   - The server must also reject duplicates.
9. **Tables:**
   - The STT column is narrow.
   - Codes (message code, Cell ID) use `font-mono`.
   - Statuses use `StatusBadge`.
   - Row actions use a `link` or `sm` button, aligned right.
10. **Feedback:** use an inline `Alert` on the screen and a short toast after an action. The text must say exactly what happened, for example "Đã gửi duyệt bản tin."
11. **Text:**
    - Write UI text in Vietnamese with full diacritics.
    - Use the function names exactly as in the URD.
12. **Mobile:** every screen must fit a 390px width with no horizontal page scroll. Wide tables and tab bars scroll inside their own frame.

## 6. Accessibility

- Every input has a `Label` linked to it by `htmlFor`/`id`. `FormField` does this for you.
- Focus is always visible (`ring`, #4767a4, ≥ 3:1). Do not remove the outline without providing a replacement.
- New colours must be checked: text ≥ 4.5:1 against its background, control borders ≥ 3:1.
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
- Use `text-sm` (16px).
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

- The current HTML demo (`index.html` at the repo root) is written in plain JS and plain CSS. It **uses the same colours, font and 16px type scale** as this document; its CSS variables are `--pri`, `--line`, `--head` and so on.
- When the CMS is rebuilt in React, use `ui/` directly and stop copying CSS from the demo.
- Dark mode: not defined for phase 1.
