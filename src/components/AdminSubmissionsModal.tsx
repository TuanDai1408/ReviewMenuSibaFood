import React, { useState, useEffect } from 'react';
import { X, Download, Database, CheckCircle, ExternalLink, Link as LinkIcon, Trash2, Eye } from 'lucide-react';
import { 
  getSavedSubmissions, 
  exportSubmissionsToCSV, 
  getWebhookUrl, 
  saveWebhookUrl 
} from '../services/submissionService';
import { SurveySubmission } from '../types';

interface AdminSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSubmissionsModal: React.FC<AdminSubmissionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
  const [webhookUrl, setWebhookInput] = useState('');
  const [isSavedWebhook, setIsSavedWebhook] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SurveySubmission | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmissions(getSavedSubmissions());
      setWebhookInput(getWebhookUrl());
      setIsSavedWebhook(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookUrl(webhookUrl);
    setIsSavedWebhook(true);
    setTimeout(() => setIsSavedWebhook(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Quý vị có chắc chắn muốn xóa toàn bộ dữ liệu khảo sát đã lưu trên trình duyệt này?')) {
      localStorage.removeItem('siba_survey_submissions');
      setSubmissions([]);
      setSelectedSub(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl">Quản Lý Dữ Liệu Khảo Sát Bán Trú</h3>
              <p className="text-xs text-slate-400">
                Tổng số phiếu đã tiếp nhận: <strong className="text-emerald-400">{submissions.length} phiếu</strong>
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          
          {/* Section: Webhook URL Settings */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <LinkIcon className="w-4 h-4 text-emerald-600" />
                <span>Cấu hình Google Sheets Webhook URL (Tự động đẩy dữ liệu sang Excel Online)</span>
              </div>
              {isSavedWebhook && (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Đã lưu cấu hình
                </span>
              )}
            </div>
            
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Dán URL Google Apps Script Webhook của bạn vào đây. Khi phụ huynh bấm Gửi, dữ liệu sẽ tự động nhảy vào Google Sheets của bạn. 
              (Hoặc đặt biến môi trường <code>VITE_GOOGLE_SHEETS_WEBHOOK_URL</code> trên Vercel).
            </p>

            <form onSubmit={handleSaveWebhook} className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Lưu kết nối
              </button>
            </form>
          </div>

          {/* Action Bar: Export & Clear */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="font-bold text-slate-800 text-base">
              Danh sách phiếu đánh giá gần đây
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportSubmissionsToCSV}
                disabled={submissions.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Xuất file Excel (CSV)</span>
              </button>

              {submissions.length > 0 && (
                <button
                  onClick={handleClearData}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                  title="Xóa dữ liệu trên trình duyệt này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa lịch sử</span>
                </button>
              )}
            </div>
          </div>

          {/* Submissions List / Table */}
          {submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Database className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">Chưa có phiếu khảo sát nào</p>
              <p className="text-xs text-slate-400 mt-1">Khi khách hàng hoặc phụ huynh gửi phiếu đánh giá, dữ liệu sẽ hiển thị ở đây.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3">Người đánh giá</th>
                      <th className="py-2.5 px-3">Điểm trường</th>
                      <th className="py-2.5 px-3">Lớp / HS</th>
                      <th className="py-2.5 px-3 text-center">T2</th>
                      <th className="py-2.5 px-3 text-center">T3</th>
                      <th className="py-2.5 px-3 text-center">T4</th>
                      <th className="py-2.5 px-3 text-center">T5</th>
                      <th className="py-2.5 px-3 text-center">T6</th>
                      <th className="py-2.5 px-3 text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map((sub) => {
                      const tagClass = (op?: string) => {
                        if (op === 'dong_thuan') return 'text-emerald-700 bg-emerald-50';
                        if (op === 'khong_dong_thuan') return 'text-rose-700 bg-rose-50';
                        if (op === 'doi_mon') return 'text-amber-700 bg-amber-50';
                        return 'text-slate-400';
                      };
                      return (
                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            {sub.submittedAt}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {sub.evaluatorName}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {sub.evaluatorType === 'phu_huynh' ? 'Phụ huynh' : 'Giáo viên/BGH'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 max-w-[180px] truncate" title={sub.schoolName}>
                            {sub.schoolName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                            {sub.studentClass || '—'}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${tagClass(sub.dayFeedbacks.thu_2?.opinion)}`}>
                              {sub.dayFeedbacks.thu_2?.opinion === 'dong_thuan' ? 'OK' : sub.dayFeedbacks.thu_2?.opinion === 'doi_mon' ? 'Đổi' : 'K'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${tagClass(sub.dayFeedbacks.thu_3?.opinion)}`}>
                              {sub.dayFeedbacks.thu_3?.opinion === 'dong_thuan' ? 'OK' : sub.dayFeedbacks.thu_3?.opinion === 'doi_mon' ? 'Đổi' : 'K'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${tagClass(sub.dayFeedbacks.thu_4?.opinion)}`}>
                              {sub.dayFeedbacks.thu_4?.opinion === 'dong_thuan' ? 'OK' : sub.dayFeedbacks.thu_4?.opinion === 'doi_mon' ? 'Đổi' : 'K'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${tagClass(sub.dayFeedbacks.thu_5?.opinion)}`}>
                              {sub.dayFeedbacks.thu_5?.opinion === 'dong_thuan' ? 'OK' : sub.dayFeedbacks.thu_5?.opinion === 'doi_mon' ? 'Đổi' : 'K'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${tagClass(sub.dayFeedbacks.thu_6?.opinion)}`}>
                              {sub.dayFeedbacks.thu_6?.opinion === 'dong_thuan' ? 'OK' : sub.dayFeedbacks.thu_6?.opinion === 'doi_mon' ? 'Đổi' : 'K'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedSub(sub)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed View Modal of single submission */}
          {selectedSub && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800">
                  Chi tiết phiếu #{selectedSub.id} - {selectedSub.evaluatorName}
                </span>
                <button
                  onClick={() => setSelectedSub(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Đóng
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><strong>Trường:</strong> {selectedSub.schoolName} ({selectedSub.schoolCode})</div>
                <div><strong>Học sinh / Lớp:</strong> {selectedSub.studentClass || 'Không ghi'}</div>
                <div><strong>Số điện thoại:</strong> {selectedSub.phone || 'Không ghi'}</div>
                <div><strong>Thời gian gửi:</strong> {selectedSub.submittedAt}</div>
              </div>

              {selectedSub.generalFeedback && (
                <div className="text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                  <strong className="text-slate-700 block mb-1">Góp ý chung:</strong>
                  <p className="text-slate-600 whitespace-pre-wrap">{selectedSub.generalFeedback}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Đóng bảng quản trị
          </button>
        </div>

      </div>
    </div>
  );
};
