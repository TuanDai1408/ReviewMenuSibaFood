import React, { useState } from 'react';
import { Clock, ShieldAlert, Mail, RefreshCw, LogOut, ArrowLeft, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { AuthUser } from '../types';
import { getCurrentUser, logout, getAccessRequests, approveRequest, ADMIN_EMAIL } from '../services/authService';

interface PendingApprovalViewProps {
  currentUser: AuthUser;
  onRefresh: () => void;
  onGoToSurvey: () => void;
  onLogout: () => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({
  currentUser,
  onRefresh,
  onGoToSurvey,
  onLogout,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState('');

  const handleCheckStatus = () => {
    setIsChecking(true);
    setCheckMsg('');
    setTimeout(() => {
      const user = getCurrentUser();
      setIsChecking(false);
      if (user?.status === 'approved') {
        setCheckMsg('Chúc mừng! Tài khoản của bạn đã được phê duyệt thành công.');
        onRefresh();
      } else {
        setCheckMsg('Tài khoản vẫn đang trong danh sách chờ duyệt từ Quản trị viên.');
      }
    }, 600);
  };

  // Quick simulate approval button for testing convenience
  const handleSimulateApproval = async () => {
    const allReqs = getAccessRequests();
    const req = allReqs.find((r) => r.email.toLowerCase() === currentUser.email.toLowerCase());
    if (req) {
      await approveRequest(req.id);
      onRefresh();
    } else {
      // Direct approve
      currentUser.status = 'approved';
      currentUser.approvedAt = new Date().toLocaleString('vi-VN');
      localStorage.setItem('siba_auth_current_user', JSON.stringify(currentUser));
      onRefresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden">
        
        {/* Header banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 p-6 sm:p-8 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 text-white border border-white/30 shadow-inner">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Yêu Cầu Truy Cập Đang Chờ Phê Duyệt
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Hệ thống đã ghi nhận thông tin tài khoản Google của bạn và chuyển tiếp tới Ban Quản trị.
          </p>
        </div>

        {/* Account Details */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="font-bold text-slate-900 text-base">{currentUser.name}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Chờ duyệt
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.email}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Thời gian yêu cầu: {currentUser.requestedAt || 'Gần đây'}
              </p>
            </div>
          </div>

          {/* Workflow Explanation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Quy trình phê duyệt & cấp quyền:
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">1. Đã kết nối tài khoản Google</strong>
                  <span className="text-emerald-800 text-xs">Yêu cầu đã được gửi tự động về Google Sheets hệ thống.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">2. Quản trị viên xét duyệt</strong>
                  <span className="text-amber-800 text-xs">
                    Admin <strong>{ADMIN_EMAIL}</strong> sẽ tiến hành kiểm duyệt danh sách yêu cầu.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block">3. Nhận email thông báo</strong>
                  <span className="text-blue-800 text-xs">
                    Ngay sau khi được duyệt, hệ thống sẽ tự động gửi email phản hồi kèm liên kết mở khóa trực tiếp.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback message if any */}
          {checkMsg && (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{checkMsg}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleCheckStatus}
              disabled={isChecking}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>Kiểm tra lại trạng thái duyệt</span>
            </button>

            <button
              onClick={onGoToSurvey}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Form khảo sát</span>
            </button>

            <button
              onClick={onLogout}
              className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Đăng xuất tài khoản này"
            >
              <LogOut className="w-4 h-4" />
              <span>Đổi tài khoản</span>
            </button>
          </div>

          {/* Admin Simulation Tester Callout */}
          <div className="p-3 rounded-xl bg-slate-100 border border-dashed border-slate-300 text-center">
            <p className="text-[11px] text-slate-500">
              * Dành cho mục đích thử nghiệm preview:
            </p>
            <button
              type="button"
              onClick={handleSimulateApproval}
              className="mt-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>[Mô phỏng] Bấm vào đây để Admin duyệt nhanh quyền cho email này</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
