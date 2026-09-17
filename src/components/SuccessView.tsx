import React from 'react';
import { CheckCircle2, RotateCcw, Building2, MapPin, Phone, Mail, Award, Calendar, HeartHandshake } from 'lucide-react';
import { SurveySubmission } from '../types';
import { COMPANY_INFO } from '../data/schoolsAndMenus';

interface SuccessViewProps {
  submission: SurveySubmission;
  onReset: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  submission,
  onReset,
}) => {
  return (
    <div className="p-8 sm:p-12 text-center bg-white rounded-3xl shadow-xl border border-emerald-100">
      {/* Success Badge */}
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 text-white">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
        Phiếu Khảo Sát Đã Ghi Nhận Thành Công
      </span>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">
        Trân trọng cảm ơn Quý vị!
      </h2>

      <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
        Ý kiến đánh giá quý báu của Quý vị đối với thực đơn bán trú tại{' '}
        <strong className="text-emerald-800">{submission.schoolName}</strong> đã được chuyển trực tiếp đến Ban Dinh Dưỡng &amp; Vệ Sinh An Toàn Thực Phẩm của{' '}
        <strong>{COMPANY_INFO.name}</strong>.
      </p>

      {/* Summary Card */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-left max-w-lg mx-auto mb-8 text-sm">
        <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
          <span>Thông tin phiếu ghi nhận</span>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
            Mã: #{submission.id.slice(-6).toUpperCase()}
          </span>
        </h4>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Người đánh giá:</span>
            <span className="font-semibold text-slate-800">
              {submission.evaluatorName} (
              {submission.evaluatorType === 'phu_huynh'
                ? 'Phụ huynh'
                : submission.evaluatorType === 'giao_vien'
                ? 'Giáo viên/BGH'
                : 'Cán bộ trường'}
              )
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Tuần thực đơn:</span>
            <span className="font-semibold text-emerald-800 text-right">{submission.weekName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Điểm trường:</span>
            <span className="font-semibold text-emerald-800 text-right">{submission.schoolName}</span>
          </div>

          {submission.studentClass && (
            <div className="flex justify-between">
              <span className="text-slate-500">Học sinh / Lớp:</span>
              <span className="font-medium text-slate-800">{submission.studentClass}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-slate-500">Thời gian gửi:</span>
            <span className="text-slate-700">{submission.submittedAt}</span>
          </div>
        </div>

        {/* Days opinions summary */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-700 block mb-2">Đánh giá các bữa ăn trong tuần:</span>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[11px]">
            {(Object.entries(submission.dayFeedbacks) as [string, import('../types').DayFeedback][]).map(([dayId, item]) => {
              const labelMap: Record<string, string> = {
                thu_2: 'T2',
                thu_3: 'T3',
                thu_4: 'T4',
                thu_5: 'T5',
                thu_6: 'T6',
              };
              const colorMap: Record<string, string> = {
                dong_thuan: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                khong_dong_thuan: 'bg-rose-100 text-rose-800 border-rose-300',
                doi_mon: 'bg-amber-100 text-amber-800 border-amber-300',
              };
              return (
                <div key={dayId} className={`p-1.5 rounded border ${colorMap[item.opinion] || 'bg-slate-100 text-slate-600'}`}>
                  <div className="font-bold">{labelMap[dayId] || dayId}</div>
                  <div className="text-[9px] truncate">
                    {item.opinion === 'dong_thuan' ? 'Đồng thuận' : item.opinion === 'doi_mon' ? 'Đổi món' : 'Chưa ưng'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Gửi thêm đánh giá khác
        </button>
      </div>

      {/* Corporate signature */}
      <div className="mt-10 pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-1">
        <p className="font-bold text-slate-700">{COMPANY_INFO.name}</p>
        <p>{COMPANY_INFO.headquarters}</p>
        <p>Hotline hỗ trợ: {COMPANY_INFO.hotline} • Email: {COMPANY_INFO.email}</p>
      </div>
    </div>
  );
};
