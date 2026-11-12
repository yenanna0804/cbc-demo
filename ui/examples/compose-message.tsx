/** Ví dụ ghép component: màn hình Soạn bản tin (rút gọn). Chỉ để tham khảo cách dùng. */
import {
  Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Textarea,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  RadioGroup, RadioGroupItem, Label, Alert, AlertDescription,
  PageHeader, FormField, StatusBadge,
} from "@/components/index"

export default function ComposeMessage() {
  return (
    <div className="p-5">
      <PageHeader
        title="Soạn bản tin"
        description="Chọn mẫu hoặc soạn tự do, chọn nơi gửi theo Tỉnh/Xã."
        actions={<><Button variant="outline">Lưu nháp</Button><Button>Gửi duyệt</Button></>}
      />
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bản tin</CardTitle>
          <StatusBadge status="draft" />
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <FormField id="title" label="Tiêu đề" required>
            <Input placeholder="Nhập tiêu đề bản tin" />
          </FormField>
          <FormField id="level" label="Mức cảnh báo" required>
            <Select>
              <SelectTrigger><SelectValue placeholder="Chọn mức cảnh báo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="4371">Cảnh báo cực kỳ Khẩn cấp</SelectItem>
                <SelectItem value="4372">Cảnh báo Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField id="content" label="Nội dung" required hint="Tối đa 650 ký tự" className="md:col-span-2">
            <Textarea />
          </FormField>
          <div className="grid gap-1.5">
            <Label>Thời điểm phát</Label>
            <RadioGroup defaultValue="now" className="flex gap-4">
              <label className="flex items-center gap-1.5"><RadioGroupItem value="now" />Phát ngay</label>
              <label className="flex items-center gap-1.5"><RadioGroupItem value="schedule" />Hẹn giờ</label>
            </RadioGroup>
          </div>
          <Alert variant="warning" className="md:col-span-2">
            <AlertDescription>Bản tin đã gửi duyệt sẽ không sửa được.</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Huỷ</Button>
          <Button>Gửi duyệt</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
