/** Trang mẫu design system – render đúng các component trong ui/components. Build: xem DESIGN.md §8. */
import React from "react"
import { createRoot } from "react-dom/client"
import { Info, Search, Send, Square, RefreshCw, Download, AlertTriangle } from "lucide-react"
import {
  Button, Input, Textarea, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Checkbox, RadioGroup, RadioGroupItem, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription, DialogClose,
  Tabs, TabsList, TabsTrigger, TabsContent, Alert, AlertTitle, AlertDescription, Separator,
  StatusBadge, STATUS, type MessageStatus, FormField, PageHeader, StatTile, SidebarNav,
} from "@/components/index"

const colors: [string, string, string][] = [
  ["primary", "#5879B9", "Nút chính, menu đang chọn, link, tab đang chọn"],
  ["primary-hover", "#4767a4", "Hover nút chính"],
  ["primary-soft", "#eef2f9", "Nền nhấn nhẹ, badge vai trò, vòng focus"],
  ["foreground", "#333333", "Chữ chính"],
  ["muted-foreground", "#666666", "Chữ phụ, mô tả"],
  ["faint", "#8c8c8c", "Gợi ý, placeholder"],
  ["muted", "#f5f6f8", "Thanh tiêu đề, header bảng/card, sidebar"],
  ["accent", "#e9ecf1", "Hover menu, nút phụ"],
  ["border", "#d5d9df", "Viền ô nhập, card, bảng"],
  ["border-subtle", "#e8eaee", "Kẻ dòng bảng"],
  ["ring", "#9db7e3", "Viền ô đang chọn (focus)"],
  ["background", "#ffffff", "Nền trang"],
]
const semantic: [string, string, string, string][] = [
  ["success", "#1e7b46", "#e6f4ec", "Thành công, Đang phát"],
  ["warning", "#a15c00", "#fff4e0", "Chờ duyệt, cảnh báo"],
  ["destructive", "#b4321f", "#fdecea", "Lỗi, Từ chối, Dừng"],
  ["info", "#2a5ca8", "#e3eefb", "Thông tin, Chờ phát"],
]

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="mb-2.5 border-b pb-1.5">{title}</h2>
      {children}
    </section>
  )
}

function App() {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-[minmax(0,1fr)] gap-8 px-4 py-6">
      <header>
        <h1>CBC CMS – Design system</h1>
        <p className="text-muted-foreground">shadcn/ui + Tailwind v3 · Arial 12px · nút chính #5879B9. Hướng dẫn đầy đủ: DESIGN.md.</p>
      </header>

      <Section id="colors" title="1. Màu chủ đạo">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {colors.map(([n, hex, use]) => (
            <div key={n} className="overflow-hidden rounded-lg border">
              <div className="h-12 border-b" style={{ background: hex }} />
              <div className="p-2"><b>{n}</b> <span className="font-mono text-xs text-muted-foreground">{hex}</span><div className="text-xs text-muted-foreground">{use}</div></div>
            </div>
          ))}
        </div>
        <h3 className="mb-2 mt-4">Màu trạng thái (chữ / nền nhạt)</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {semantic.map(([n, fg, bg, use]) => (
            <div key={n} className="rounded-lg border p-2.5" style={{ background: bg }}>
              <b style={{ color: fg }}>{n}</b>
              <div className="font-mono text-xs" style={{ color: fg }}>{fg} / {bg}</div>
              <div className="text-xs text-foreground">{use}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="2. Chữ">
        <div className="grid content-start gap-1.5">
          <div className="text-2xl font-bold">28px · số lớn</div>
          <div className="text-xl font-bold">22px · text-xl · số KPI</div>
          <div className="text-lg font-bold">16px · text-lg · h1 tiêu đề trang</div>
          <div className="text-md font-bold">14px · text-md · h2 tiêu đề card</div>
          <div className="text-sm"><b>12px · text-sm · nhãn (đậm)</b> và chữ thân (thường) – cỡ mặc định</div>
          <div className="text-xs text-muted-foreground">11.5px · text-xs · gợi ý, ghi chú, header bảng</div>
        </div>
      </Section>

      <Section id="buttons" title="3. Nút">
        <div className="flex flex-wrap items-center gap-2">
          <Button><Send />Gửi duyệt</Button>
          <Button variant="outline"><RefreshCw />Làm mới</Button>
          <Button variant="secondary"><Download />Xuất file</Button>
          <Button variant="destructive"><Square />Dừng bản tin</Button>
          <Button variant="destructive-solid">Xác nhận dừng</Button>
          <Button variant="success">Phê duyệt</Button>
          <Button variant="ghost">Bỏ qua</Button>
          <Button variant="link">Xem chi tiết</Button>
          <Button disabled>Đang xử lý</Button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button size="sm">Nhỏ (sm)</Button><Button>Mặc định</Button><Button size="lg">Lớn (lg)</Button>
          <Button size="icon" variant="outline" aria-label="Tìm"><Search /></Button>
        </div>
      </Section>

      <Section id="forms" title="4. Ô nhập & biểu mẫu">
        <Card>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <FormField id="f1" label="Tiêu đề" required hint="Hiển thị trên dòng đầu bản tin"><Input placeholder="Nhập tiêu đề" /></FormField>
            <FormField id="f2" label="Mức cảnh báo" required>
              <Select><SelectTrigger id="f2"><SelectValue placeholder="Chọn mức cảnh báo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="4371">Cảnh báo cực kỳ Khẩn cấp</SelectItem>
                  <SelectItem value="4372">Cảnh báo Khẩn cấp</SelectItem>
                </SelectContent></Select>
            </FormField>
            <FormField id="f3" label="Mã OTP" required error="Mã OTP không đúng"><Input defaultValue="12345" /></FormField>
            <FormField id="f4" label="Người tạo"><Input readOnly value="Nguyễn Văn A (chỉ đọc)" /></FormField>
            <FormField id="f5" label="Nội dung" required hint="0/650 ký tự" className="md:col-span-2"><Textarea placeholder="Nhập nội dung bản tin" /></FormField>
            <div className="grid content-start gap-1.5">
              <Label>Thời điểm phát</Label>
              <RadioGroup defaultValue="now" className="flex gap-4">
                <label className="flex items-center gap-1.5"><RadioGroupItem value="now" />Phát ngay</label>
                <label className="flex items-center gap-1.5"><RadioGroupItem value="later" />Hẹn giờ</label>
              </RadioGroup>
            </div>
            <div className="grid content-start gap-1.5">
              <Label>Mạng phát</Label>
              <label className="flex items-center gap-1.5"><Checkbox defaultChecked />4G</label>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section id="badges" title="5. Badge trạng thái bản tin">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATUS) as MessageStatus[]).map((s) => <StatusBadge key={s} status={s} />)}
          <Badge>Người soạn thảo</Badge>
          <Badge variant="outline">Mẫu TMP-01</Badge>
        </div>
      </Section>

      <Section id="cards" title="6. Card & số liệu">
        <div className="grid gap-2 md:grid-cols-4">
          <StatTile label="Tổng số cell" value="1.240" sub="Theo danh sách xã đã chọn" />
          <StatTile label="Cell nhận lệnh thành công" value="1.228" tone="success" sub="99,0%" />
          <StatTile label="Cell lỗi" value="12" tone="destructive" sub="Có thể gửi lại" />
          <StatTile label="Thời hạn phát" value="02:00" sub="giờ:phút" />
        </div>
        <Card className="mt-3">
          <CardHeader><div><CardTitle>Thông tin chiến dịch</CardTitle><CardDescription>Header nền xám nhạt, không đổ bóng</CardDescription></div><StatusBadge status="broadcasting" /></CardHeader>
          <CardContent className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1.5">
            <b>Mã bản tin</b><span>BT-2026-0012</span>
            <b>Nơi gửi</b><span>Tỉnh Quảng Bình · 12 xã</span>
          </CardContent>
          <CardFooter><Button variant="outline">Xem báo cáo</Button><Button variant="destructive">Dừng bản tin</Button></CardFooter>
        </Card>
      </Section>

      <Section id="table" title="7. Bảng">
        <Table>
          <TableHeader><TableRow><TableHead className="w-12">STT</TableHead><TableHead>Mã bản tin</TableHead><TableHead>Tiêu đề</TableHead><TableHead>Trạng thái</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader>
          <TableBody>
            {([["BT-0012", "Cảnh báo lũ quét", "broadcasting"], ["BT-0011", "Bão số 5", "pending"], ["BT-0010", "Sạt lở đất", "stopped"]] as [string, string, MessageStatus][]).map(([c, t, s], i) => (
              <TableRow key={c}><TableCell>{i + 1}</TableCell><TableCell className="font-mono">{c}</TableCell><TableCell>{t}</TableCell><TableCell><StatusBadge status={s} /></TableCell><TableCell className="text-right"><Button size="sm" variant="link">Chi tiết</Button></TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section id="tabs" title="8. Tabs, thông báo, hộp thoại">
        <Tabs defaultValue="a">
          <TabsList><TabsTrigger value="a">Thông tin chung</TabsTrigger><TabsTrigger value="b">Lịch sử gửi lệnh</TabsTrigger><TabsTrigger value="c">Kết quả theo cell</TabsTrigger></TabsList>
          <TabsContent value="a">Nội dung tab Thông tin chung.</TabsContent>
          <TabsContent value="b">Nội dung tab Lịch sử gửi lệnh.</TabsContent>
          <TabsContent value="c">Nội dung tab Kết quả theo cell.</TabsContent>
        </Tabs>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <Alert variant="info"><Info /><div><AlertTitle>Thông tin</AlertTitle><AlertDescription>Bản tin sẽ phát lúc 14:00.</AlertDescription></div></Alert>
          <Alert variant="success"><Info /><AlertDescription>Đã gửi duyệt bản tin.</AlertDescription></Alert>
          <Alert variant="warning"><AlertTriangle /><AlertDescription>Bản tin đã gửi duyệt sẽ không sửa được.</AlertDescription></Alert>
          <Alert variant="destructive"><AlertTriangle /><AlertDescription>12 cell nhận lệnh lỗi.</AlertDescription></Alert>
        </div>
        <div className="mt-3">
          <Dialog>
            <DialogTrigger asChild><Button variant="destructive">Mở hộp thoại Dừng bản tin</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Dừng bản tin BT-0012?</DialogTitle><DialogDescription>Cần nhập OTP để xác nhận.</DialogDescription></DialogHeader>
              <DialogBody><FormField id="otp" label="Mã OTP" required><Input placeholder="6 chữ số" /></FormField></DialogBody>
              <DialogFooter><DialogClose asChild><Button variant="outline">Huỷ</Button></DialogClose><Button variant="destructive-solid">Xác nhận dừng</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Section>

      <Section id="layout" title="9. Bố cục màn hình mẫu">
        <div className="flex h-[360px] overflow-x-auto rounded-lg border">
          <SidebarNav brand="CMS Cell Broadcast" subtitle="VNPT" activeKey="list" footer="Người soạn thảo"
            groups={[{ title: "Phát tin cảnh báo", items: [{ key: "new", label: "Soạn bản tin", href: "#" }, { key: "list", label: "Danh sách bản tin", href: "#" }, { key: "ap", label: "Chờ duyệt", href: "#", count: 2 }] },
                     { title: "Báo cáo", items: [{ key: "rp", label: "Báo cáo chiến dịch", href: "#" }] }]} />
          <div className="flex-1 overflow-auto">
            <div className="flex h-11 items-center border-b bg-muted px-4 text-muted-foreground">Thanh tiêu đề</div>
            <div className="p-4">
              <PageHeader title="Danh sách bản tin" description="Tra cứu theo mã, tiêu đề, trạng thái" actions={<><Button variant="outline"><RefreshCw />Làm mới</Button><Button>Soạn bản tin</Button></>} />
              <div className="flex gap-2"><Input placeholder="Tìm theo mã hoặc tiêu đề" className="max-w-xs" /><Button variant="outline"><Search />Tìm kiếm</Button></div>
              <Separator className="my-3" />
              <p className="text-muted-foreground">Bảng kết quả…</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
