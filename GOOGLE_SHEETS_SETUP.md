# HƯỚNG DẪN KẾT NỐI TỰ ĐỘNG VỚI GOOGLE SHEETS (DÀNH CHO VERCEL & GITHUB)

Khi bạn đẩy dự án này lên GitHub và Deploy lên **Vercel**, để toàn bộ ý kiến đánh giá của phụ huynh và nhà trường tự động nhảy thành từng dòng trong file **Google Sheets (Excel Online)**, bạn chỉ cần thực hiện 3 bước đơn giản sau:

---

## BƯỚC 1: TẠO FILE GOOGLE SHEET

1. Mở [Google Sheets](https://sheets.google.com) và tạo một bảng tính mới với tên: **"Khảo Sát Thực Đơn Bán Trú - SIBA"**.
2. Đổi tên Sheet1 thành: **"DanhSachDanhGia"** (hoặc để mặc định).
3. Tại dòng 1 (Dòng tiêu đề), bạn có thể dán danh sách tiêu đề cột sau:
   - **Cột A**: Mã phiếu
   - **Cột B**: Thời gian gửi
   - **Cột C**: Họ tên người đánh giá
   - **Cột D**: Đối tượng (Phụ huynh/Giáo viên)
   - **Cột E**: Điểm trường
   - **Cột F**: Mã trường
   - **Cột G**: Lớp / Học sinh
   - **Cột H**: Số điện thoại
   - **Cột I**: Thứ 2 - Đánh giá
   - **Cột J**: Thứ 2 - Món đề xuất
   - **Cột K**: Thứ 2 - Góp ý
   - **Cột L**: Thứ 3 - Đánh giá
   - **Cột M**: Thứ 3 - Món đề xuất
   - **Cột N**: Thứ 3 - Góp ý
   - **Cột O**: Thứ 4 - Đánh giá
   - **Cột P**: Thứ 4 - Món đề xuất
   - **Cột Q**: Thứ 4 - Góp ý
   - **Cột R**: Thứ 5 - Đánh giá
   - **Cột S**: Thứ 5 - Món đề xuất
   - **Cột T**: Thứ 5 - Góp ý
   - **Cột U**: Thứ 6 - Đánh giá
   - **Cột V**: Thứ 6 - Món đề xuất
   - **Cột W**: Thứ 6 - Góp ý
   - **Cột X**: Góp ý chung

---

## BƯỚC 2: TẠO GOOGLE APPS SCRIPT WEBHOOK (MIỄN PHÍ)

1. Trên thanh công cụ của Google Sheet, bấm vào: **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
2. Xóa hết mã cũ trong file `Mã.gs` và **dán đoạn mã sau vào**:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var opinionText = function(val) {
      if (val === 'dong_thuan') return 'Đồng thuận';
      if (val === 'khong_dong_thuan') return 'Không đồng thuận';
      if (val === 'doi_mon') return 'Đổi món';
      return val || '';
    };

    // Thêm 1 dòng mới với dữ liệu khảo sát
    sheet.appendRow([
      data.id || '',
      data.submittedAt || new Date().toLocaleString("vi-VN"),
      data.evaluatorName || '',
      data.evaluatorType || '',
      data.schoolName || '',
      data.schoolCode || '',
      data.studentClass || '',
      data.phone || '',
      opinionText(data.thu_2_opinion),
      data.thu_2_suggested || '',
      data.thu_2_comment || '',
      opinionText(data.thu_3_opinion),
      data.thu_3_suggested || '',
      data.thu_3_comment || '',
      opinionText(data.thu_4_opinion),
      data.thu_4_suggested || '',
      data.thu_4_comment || '',
      opinionText(data.thu_5_opinion),
      data.thu_5_suggested || '',
      data.thu_5_comment || '',
      opinionText(data.thu_6_opinion),
      data.thu_6_suggested || '',
      data.thu_6_comment || '',
      data.generalFeedback || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Bấm nút **Lưu** (biểu tượng đĩa mềm hoặc `Ctrl + S`).
4. Bấm nút **Triển khai (Deploy)** ở góc trên bên phải -> chọn **Tùy chọn triển khai mới (New deployment)**.
5. Tại biểu tượng bánh răng ⚙️ (Chọn loại), chọn **Ứng dụng web (Web app)**.
6. Cấu hình như sau:
   - **Mô tả**: `SIBA Survey Webhook`
   - **Thực thi dưới dạng (Execute as)**: `Tôi (địa chỉ email của bạn)`
   - **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)** *(Rất quan trọng để form từ Vercel gửi vào được)*.
7. Bấm **Triển khai (Deploy)** -> Cấp quyền cho Script nếu Google hỏi.
8. Sao chép lại đường link **URL ứng dụng web** (Có dạng: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## BƯỚC 3: CẤU HÌNH TRÊN VERCEL

Khi bạn deploy dự án trên Vercel:

1. Vào dự án của bạn trên [Vercel Dashboard](https://vercel.com).
2. Vào **Settings** -> **Environment Variables**.
3. Thêm biến mới:
   - **Key**: `VITE_GOOGLE_SHEETS_WEBHOOK_URL`
   - **Value**: Dán đường dẫn URL Webhook bạn vừa copy ở Bước 2.
4. Bấm **Save** và bấm **Redeploy**.

---

## TÍNH NĂNG DỰ PHÒNG AN TOÀN ĐÃ CÓ TRONG WEB:
- Ngay cả khi bạn **chưa cấu hình Google Sheets** hoặc đường truyền mạng chập chờn, hệ thống luôn **tự động lưu vào bộ nhớ dự phòng (LocalStorage)**.
- Phía cuối trang có nút **"Quản trị / Xuất dữ liệu Excel (CSV)"** giúp bộ phận vận hành SIBA có thể xem danh sách và tải file Excel toàn bộ dữ liệu khảo sát về máy bất cứ lúc nào!
