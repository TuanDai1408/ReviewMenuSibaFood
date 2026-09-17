import { SurveySubmission } from '../types';

const STORAGE_KEY = 'siba_survey_submissions';
const WEBHOOK_STORAGE_KEY = 'siba_google_sheets_webhook_url';

export function getWebhookUrl(): string {
  // 1. Check user custom set in browser localStorage
  const savedUrl = localStorage.getItem(WEBHOOK_STORAGE_KEY);
  if (savedUrl && savedUrl.trim()) {
    return savedUrl.trim();
  }
  // 2. Check VITE_GOOGLE_SHEETS_WEBHOOK_URL env variable (set on Vercel)
  const envObj = (import.meta as unknown as { env?: Record<string, string> }).env;
  return envObj?.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';
}

export function saveWebhookUrl(url: string): void {
  localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
}

export function getSavedSubmissions(): SurveySubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse saved submissions', err);
    return [];
  }
}

export function saveSubmissionLocally(submission: SurveySubmission): void {
  try {
    const current = getSavedSubmissions();
    const updated = [submission, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save submission locally', err);
  }
}

export async function sendSubmissionToWebhook(submission: SurveySubmission): Promise<{ success: boolean; message?: string }> {
  // Always persist locally as backup first
  saveSubmissionLocally(submission);

  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) {
    // No webhook configured yet, saved to local database only
    return {
      success: true,
      message: 'Đã lưu an toàn vào bộ nhớ nội bộ (Chưa cấu hình Google Sheets URL)',
    };
  }

  try {
    // Flatten payload for Google Sheets row mapping
    const payload = {
      id: submission.id,
      submittedAt: submission.submittedAt,
      evaluatorName: submission.evaluatorName,
      evaluatorType: submission.evaluatorType === 'phu_huynh' 
        ? 'Phụ huynh' 
        : submission.evaluatorType === 'giao_vien' 
        ? 'Giáo viên / BGH' 
        : 'Khác',
      schoolName: submission.schoolName,
      schoolCode: submission.schoolCode,
      studentClass: submission.studentClass || '',
      phone: submission.phone || '',
      thu_2_opinion: submission.dayFeedbacks.thu_2?.opinion || '',
      thu_2_suggested: submission.dayFeedbacks.thu_2?.suggestedDish || '',
      thu_2_comment: submission.dayFeedbacks.thu_2?.comment || '',
      thu_3_opinion: submission.dayFeedbacks.thu_3?.opinion || '',
      thu_3_suggested: submission.dayFeedbacks.thu_3?.suggestedDish || '',
      thu_3_comment: submission.dayFeedbacks.thu_3?.comment || '',
      thu_4_opinion: submission.dayFeedbacks.thu_4?.opinion || '',
      thu_4_suggested: submission.dayFeedbacks.thu_4?.suggestedDish || '',
      thu_4_comment: submission.dayFeedbacks.thu_4?.comment || '',
      thu_5_opinion: submission.dayFeedbacks.thu_5?.opinion || '',
      thu_5_suggested: submission.dayFeedbacks.thu_5?.suggestedDish || '',
      thu_5_comment: submission.dayFeedbacks.thu_5?.comment || '',
      thu_6_opinion: submission.dayFeedbacks.thu_6?.opinion || '',
      thu_6_suggested: submission.dayFeedbacks.thu_6?.suggestedDish || '',
      thu_6_comment: submission.dayFeedbacks.thu_6?.comment || '',
      generalFeedback: submission.generalFeedback || '',
    };

    // Google Apps Script requires text/plain or no-cors
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Đã gửi trực tiếp về Google Sheets thành công',
    };
  } catch (err) {
    console.warn('Webhook post failed, submission preserved locally', err);
    return {
      success: true,
      message: 'Đã lưu an toàn trên máy (Lỗi kết nối Webhook mạng)',
    };
  }
}

export function exportSubmissionsToCSV(): void {
  const submissions = getSavedSubmissions();
  if (submissions.length === 0) {
    alert('Hiện chưa có dữ liệu đánh giá nào được lưu.');
    return;
  }

  const headers = [
    'Mã phiếu',
    'Thời gian gửi',
    'Người đánh giá',
    'Đối tượng',
    'Điểm trường',
    'Mã trường',
    'Học sinh / Lớp',
    'Số điện thoại',
    'T2 Đánh giá',
    'T2 Món đề xuất',
    'T2 Góp ý',
    'T3 Đánh giá',
    'T3 Món đề xuất',
    'T3 Góp ý',
    'T4 Đánh giá',
    'T4 Món đề xuất',
    'T4 Góp ý',
    'T5 Đánh giá',
    'T5 Món đề xuất',
    'T5 Góp ý',
    'T6 Đánh giá',
    'T6 Món đề xuất',
    'T6 Góp ý',
    'Góp ý chung'
  ];

  const opinionText = (op?: string) => {
    if (op === 'dong_thuan') return 'Đồng thuận';
    if (op === 'khong_dong_thuan') return 'Không đồng thuận';
    if (op === 'doi_mon') return 'Đổi món';
    return '';
  };

  const rows = submissions.map(s => [
    `"${s.id}"`,
    `"${s.submittedAt}"`,
    `"${s.evaluatorName}"`,
    `"${s.evaluatorType === 'phu_huynh' ? 'Phụ huynh' : s.evaluatorType === 'giao_vien' ? 'Giáo viên/BGH' : 'Khác'}"`,
    `"${s.schoolName}"`,
    `"${s.schoolCode}"`,
    `"${s.studentClass || ''}"`,
    `"${s.phone || ''}"`,
    `"${opinionText(s.dayFeedbacks.thu_2?.opinion)}"`,
    `"${s.dayFeedbacks.thu_2?.suggestedDish || ''}"`,
    `"${s.dayFeedbacks.thu_2?.comment || ''}"`,
    `"${opinionText(s.dayFeedbacks.thu_3?.opinion)}"`,
    `"${s.dayFeedbacks.thu_3?.suggestedDish || ''}"`,
    `"${s.dayFeedbacks.thu_3?.comment || ''}"`,
    `"${opinionText(s.dayFeedbacks.thu_4?.opinion)}"`,
    `"${s.dayFeedbacks.thu_4?.suggestedDish || ''}"`,
    `"${s.dayFeedbacks.thu_4?.comment || ''}"`,
    `"${opinionText(s.dayFeedbacks.thu_5?.opinion)}"`,
    `"${s.dayFeedbacks.thu_5?.suggestedDish || ''}"`,
    `"${s.dayFeedbacks.thu_5?.comment || ''}"`,
    `"${opinionText(s.dayFeedbacks.thu_6?.opinion)}"`,
    `"${s.dayFeedbacks.thu_6?.suggestedDish || ''}"`,
    `"${s.dayFeedbacks.thu_6?.comment || ''}"`,
    `"${(s.generalFeedback || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Khao_Sat_SIBA_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
