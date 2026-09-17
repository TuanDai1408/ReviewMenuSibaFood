import { AuthUser, AccessRequest, AccessStatus } from '../types';
import { getWebhookUrl } from './submissionService';

export const ADMIN_EMAIL = 'trantuandai2508@gmail.com';

const AUTH_USER_KEY = 'siba_auth_current_user';
const ACCESS_REQUESTS_KEY = 'siba_access_requests';

// Initial pre-configured seed requests so Admin has demo items if needed
const DEFAULT_REQUESTS: AccessRequest[] = [
  {
    id: 'req_001',
    email: 'nguyenvana.parent@gmail.com',
    name: 'Nguyễn Văn An (Bố cháu Minh Khang)',
    role: 'Phụ huynh học sinh lớp 3A',
    requestedAt: '15/09/2026 09:30',
    status: 'pending',
    note: 'Xin quyền xem báo cáo khảo sát thực đơn để tham vấn cho ban đại diện phụ huynh.',
  },
  {
    id: 'req_002',
    email: 'bgh.anthuong@gmail.com',
    name: 'Cô Lê Thu Hà - BGH Trường TH An Thượng',
    role: 'Ban Giám Hiệu Trường',
    requestedAt: '15/09/2026 14:15',
    status: 'approved',
    approvedAt: '15/09/2026 15:00',
    note: 'Kiểm tra tỷ lệ học sinh ăn hết suất và đánh giá chất lượng bữa ăn.',
  }
];

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse current user', err);
    return null;
  }
}

export function saveCurrentUser(user: AuthUser | null): void {
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
  } else {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAccessRequests(): AccessRequest[] {
  try {
    const raw = localStorage.getItem(ACCESS_REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(DEFAULT_REQUESTS));
      return DEFAULT_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse access requests', err);
    return DEFAULT_REQUESTS;
  }
}

export function saveAccessRequests(requests: AccessRequest[]): void {
  localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(requests));
}

export async function loginWithGoogle(email: string, name: string, avatarUrl?: string): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();

  // 1. If it's the Admin email, automatically grant full admin approval immediately
  if (isAdmin) {
    const adminUser: AuthUser = {
      email: cleanEmail,
      name: name.trim() || 'Trần Tuấn Đại (Admin)',
      avatar: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Admin')}`,
      role: 'admin',
      status: 'approved',
      requestedAt: new Date().toLocaleString('vi-VN'),
      approvedAt: new Date().toLocaleString('vi-VN'),
    };
    saveCurrentUser(adminUser);
    return adminUser;
  }

  // 2. Check if this email was already approved in requests list
  const allRequests = getAccessRequests();
  const existingReq = allRequests.find((r) => r.email.toLowerCase() === cleanEmail);

  let status: AccessStatus = 'pending';
  let approvedAt: string | undefined;

  if (existingReq) {
    status = existingReq.status;
    approvedAt = existingReq.approvedAt;
  } else {
    // Create new pending access request
    const newReq: AccessRequest = {
      id: `req_${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || 'Người dùng Google',
      role: 'Khách hàng / Phụ huynh',
      requestedAt: new Date().toLocaleString('vi-VN'),
      status: 'pending',
      note: 'Yêu cầu xem báo cáo số liệu phân tích Dashboard qua tài khoản Google',
    };
    const updatedRequests = [newReq, ...allRequests];
    saveAccessRequests(updatedRequests);

    // Forward access request to Google Sheet webhook
    forwardRequestToWebhook(newReq);
  }

  const user: AuthUser = {
    email: cleanEmail,
    name: name.trim() || 'Người dùng Google',
    avatar: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`,
    role: 'viewer',
    status,
    requestedAt: existingReq?.requestedAt || new Date().toLocaleString('vi-VN'),
    approvedAt,
  };

  saveCurrentUser(user);
  return user;
}

export async function forwardRequestToWebhook(req: AccessRequest): Promise<void> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    const payload = {
      action: 'REQUEST_DASHBOARD_ACCESS',
      requestId: req.id,
      email: req.email,
      name: req.name,
      role: req.role,
      requestedAt: req.requestedAt,
      status: req.status,
      note: req.note || '',
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Could not forward access request to webhook', err);
  }
}

export async function approveRequest(requestId: string): Promise<void> {
  const requests = getAccessRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const nowStr = new Date().toLocaleString('vi-VN');
  requests[index].status = 'approved';
  requests[index].approvedAt = nowStr;
  saveAccessRequests(requests);

  // If currently signed in user matches this email, update their state
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email.toLowerCase() === requests[index].email.toLowerCase()) {
    currentUser.status = 'approved';
    currentUser.approvedAt = nowStr;
    saveCurrentUser(currentUser);
  }

  // Notify webhook so Apps Script can trigger Gmail to user
  const webhookUrl = getWebhookUrl();
  if (webhookUrl) {
    try {
      const payload = {
        action: 'APPROVE_DASHBOARD_ACCESS',
        requestId,
        email: requests[index].email,
        name: requests[index].name,
        approvedAt: nowStr,
        message: 'Quyền xem Dashboard đã được phê duyệt bởi Quản trị viên.',
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Failed to notify webhook on approval', err);
    }
  }
}

export async function rejectRequest(requestId: string): Promise<void> {
  const requests = getAccessRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  requests[index].status = 'rejected';
  saveAccessRequests(requests);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email.toLowerCase() === requests[index].email.toLowerCase()) {
    currentUser.status = 'rejected';
    saveCurrentUser(currentUser);
  }
}

export async function deleteRequest(requestId: string): Promise<void> {
  const requests = getAccessRequests();
  const filtered = requests.filter((r) => r.id !== requestId);
  saveAccessRequests(filtered);
}

// Google Apps Script template code to handle automated email notifications on Google Sheet edit
export const GOOGLE_APPS_SCRIPT_EMAIL_TRIGGER_CODE = `
/**
 * HƯỚNG DẪN CẤU HÌNH GỬI EMAIL TỰ ĐỘNG KHI DUYỆT TRÊN GOOGLE SHEETS
 * 1. Mở file Google Sheets chứa dữ liệu khảo sát.
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Dán đoạn mã dưới đây vào file Code.gs và bấm Lưu.
 * 4. Tạo trigger OnEdit hoặc dùng hàm doPost như sau:
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Xử lý yêu cầu xin quyền xem Dashboard
    if (data.action === "REQUEST_DASHBOARD_ACCESS") {
      var sheetAccess = ss.getSheetByName("YeuCauQuyenXem") || ss.insertSheet("YeuCauQuyenXem");
      if (sheetAccess.getLastRow() === 0) {
        sheetAccess.appendRow(["Mã Yêu Cầu", "Họ Tên", "Email", "Thời Gian Yêu Cầu", "Trạng Thái", "Thời Gian Duyệt", "Ghi Chú"]);
        sheetAccess.getRange("1:1").setFontWeight("bold").setBackground("#d1fae5");
      }
      sheetAccess.appendRow([data.requestId, data.name, data.email, data.requestedAt, "CHỜ DUYỆT", "", data.note]);
      return ContentService.createTextOutput("SUCCESS_REQUEST_LOGGED");
    }

    // 2. Xử lý khi Admin bấm Duyệt trên Web (Tự động gửi email phản hồi)
    if (data.action === "APPROVE_DASHBOARD_ACCESS") {
      var subject = "✅ [Cơm Ngon SIBA] Quyền xem Báo cáo Phân tích Thực đơn đã được kích hoạt!";
      var htmlBody = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;'>" +
        "<h2 style='color: #059669;'>SIBA FOOD CATERING - THÔNG BÁO DUYỆT QUYỀN TRUY CẬP</h2>" +
        "<p>Xin chào <strong>" + data.name + "</strong>,</p>" +
        "<p>Quản trị viên hệ thống (<strong>trantuandai2508@gmail.com</strong>) đã phê duyệt yêu cầu truy cập Báo Cáo & Phân Tích Thực Đơn Bán Trú của bạn.</p>" +
        "<p>Bây giờ bạn có thể đăng nhập bằng tài khoản Google <strong>" + data.email + "</strong> để xem toàn bộ số liệu thống kê, biểu đồ hài lòng và các insight chất lượng bữa ăn.</p>" +
        "<div style='text-align: center; margin: 30px 0;'>" +
        "<a href='https://ais-dev-jv7k76k7cqugyhiq3r567r-249676637347.asia-southeast1.run.app' style='background-color: #059669; color: white; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;'>XEM DASHBOARD BÁO CÁO NGAY</a>" +
        "</div>" +
        "<p style='color: #64748b; font-size: 13px;'>Thời gian phê duyệt: " + data.approvedAt + "<br>Hotline hỗ trợ: 1800 6263</p>" +
        "</div>";

      MailApp.sendEmail({
        to: data.email,
        subject: subject,
        htmlBody: htmlBody
      });
      return ContentService.createTextOutput("EMAIL_SENT_SUCCESSFULLY");
    }

    // 3. Ghi nhận phiếu khảo sát thông thường
    var sheetSurvey = ss.getSheetByName("KhaoSatBanTru") || ss.getActiveSheet();
    if (sheetSurvey.getLastRow() === 0) {
      sheetSurvey.appendRow([
        "Mã phiếu", "Thời gian", "Tuần thực đơn", "Người đánh giá", "Đối tượng", "Điểm trường",
        "Mã trường", "Lớp", "SĐT", "T2 Đánh giá", "T2 Món đề xuất", "T2 Ý kiến",
        "T3 Đánh giá", "T3 Món đề xuất", "T3 Ý kiến", "T4 Đánh giá", "T4 Món đề xuất", "T4 Ý kiến",
        "T5 Đánh giá", "T5 Món đề xuất", "T5 Ý kiến", "T6 Đánh giá", "T6 Món đề xuất", "T6 Ý kiến", "Góp ý chung"
      ]);
      sheetSurvey.getRange("1:1").setFontWeight("bold").setBackground("#ecfdf5");
    }

    sheetSurvey.appendRow([
      data.id || "", data.submittedAt || "", data.weekName || "", data.evaluatorName || "", data.evaluatorType || "",
      data.schoolName || "", data.schoolCode || "", data.studentClass || "", data.phone || "",
      data.thu_2_opinion || "", data.thu_2_suggested || "", data.thu_2_comment || "",
      data.thu_3_opinion || "", data.thu_3_suggested || "", data.thu_3_comment || "",
      data.thu_4_opinion || "", data.thu_4_suggested || "", data.thu_4_comment || "",
      data.thu_5_opinion || "", data.thu_5_suggested || "", data.thu_5_comment || "",
      data.thu_6_opinion || "", data.thu_6_suggested || "", data.thu_6_comment || "",
      data.generalFeedback || ""
    ]);

    return ContentService.createTextOutput("SURVEY_LOGGED_SUCCESSFULLY");
  } catch(err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}
`;
