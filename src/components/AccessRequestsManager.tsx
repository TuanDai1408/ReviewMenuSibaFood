import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, UserX, Trash2, Mail, ExternalLink, Code2, Copy, Check, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { AccessRequest, AuthUser } from '../types';
import { getAccessRequests, approveRequest, rejectRequest, deleteRequest, GOOGLE_APPS_SCRIPT_EMAIL_TRIGGER_CODE, ADMIN_EMAIL } from '../services/authService';

interface AccessRequestsManagerProps {
  currentUser: AuthUser;
  onRequestUpdated: () => void;
}

export const AccessRequestsManager: React.FC<AccessRequestsManagerProps> = ({
  currentUser,
  onRequestUpdated,
}) => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadRequests = () => {
    setRequests(getAccessRequests());
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: string, email: string) => {
    await approveRequest(id);
    loadRequests();
    onRequestUpdated();
    setActionSuccess(`Đã phê duyệt quyền xem thành công cho ${email}. Lệnh gửi email thông báo đã được phát đi!`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleReject = async (id: string, email: string) => {
    await rejectRequest(id);
    loadRequests();
    onRequestUpdated();
    setActionSuccess(`Đã chuyển trạng thái từ chối cho ${email}.`);
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Xác nhận xóa yêu cầu này khỏi danh sách?')) {
      await deleteRequest(id);
      loadRequests();
      onRequestUpdated();
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_EMAIL_TRIGGER_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Admin: {ADMIN_EMAIL}
            </span>
            <span className="text-xs text-slate-500">Phân quyền bảo mật</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Quản Lý Phê Duyệt Quyền Xem Báo Cáo
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Chỉ những tài khoản được Quản trị viên duyệt mới có thể truy cập số liệu chi tiết.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScriptModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>Mã Apps Script gửi Mail</span>
          </button>
          <button
            onClick={loadRequests}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
            title="Làm mới danh sách"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-amber-900">
          <div className="text-xs font-semibold">Đang chờ duyệt</div>
          <div className="text-2xl font-black mt-1 text-amber-700">{pendingCount} yêu cầu</div>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-emerald-900">
          <div className="text-xs font-semibold">Đã được cấp quyền</div>
          <div className="text-2xl font-black mt-1 text-emerald-700">{approvedCount} tài khoản</div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-slate-700 col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold">Tổng số yêu cầu</div>
          <div className="text-2xl font-black mt-1 text-slate-900">{requests.length} lượt</div>
        </div>
      </div>

      {/* Success alert */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Requests Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Họ tên / Email</th>
              <th className="p-3.5">Đối tượng & Ghi chú</th>
              <th className="p-3.5">Thời gian gửi</th>
              <th className="p-3.5">Trạng thái</th>
              <th className="p-3.5 text-right">Thao tác duyệt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';

              return (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{req.name}</div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{req.email}</span>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800">{req.role}</span>
                    {req.note && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                        "{req.note}"
                      </p>
                    )}
                  </td>

                  <td className="p-3.5 text-slate-600 text-xs whitespace-nowrap">
                    {req.requestedAt}
                  </td>

                  <td className="p-3.5 whitespace-nowrap">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Đã duyệt
                      </span>
                    ) : req.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Từ chối
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                        Chờ duyệt
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                    {!isApproved ? (
                      <button
                        onClick={() => handleApprove(req.id, req.email)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                        title="Duyệt quyền và gửi email thông báo"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Duyệt quyền</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(req.id, req.email)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-50 text-amber-700 font-semibold text-xs transition-all cursor-pointer"
                        title="Tạm ngưng quyền truy cập"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Thu hồi</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(req.id)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                      title="Xóa bản ghi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Apps Script Helper Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-base">Google Apps Script Tự Động Gửi Email Phản Hồi</h4>
              </div>
              <button
                onClick={() => setShowScriptModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              <p>
                Để Google Sheet tự động gửi email từ chính hộp thư Gmail của bạn (<strong>{ADMIN_EMAIL}</strong>) khi bạn bấm Duyệt trên web hoặc tích chọn trên Sheet, hãy dán đoạn mã này vào <strong>Extensions &gt; Apps Script</strong>:
              </p>

              <div className="relative">
                <button
                  onClick={handleCopyScript}
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã sao chép' : 'Sao chép mã'}</span>
                </button>
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-72">
                  {GOOGLE_APPS_SCRIPT_EMAIL_TRIGGER_CODE}
                </pre>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                <strong>Đặc điểm:</strong> Khi bạn bấm "Duyệt quyền" tại bảng trên, web sẽ gửi tín hiệu POST tới webhook của Google Apps Script với mã lệnh <code>APPROVE_DASHBOARD_ACCESS</code>, kích hoạt hàm <code>MailApp.sendEmail</code> gửi thư thông báo tới người dùng ngay lập tức!
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowScriptModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700 cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
