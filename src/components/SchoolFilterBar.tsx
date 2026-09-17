import React from 'react';
import { School2, CheckCircle2, CalendarDays, Sparkles, Check } from 'lucide-react';
import { SCHOOLS_LIST, WEEKS_LIST } from '../data/schoolsAndMenus';
import { School, WeekId, WeekDefinition } from '../types';

interface SchoolFilterBarProps {
  selectedSchoolId: string;
  onSelectSchool: (schoolId: string) => void;
  selectedSchool?: School;
  selectedWeekId: WeekId;
  onSelectWeek: (weekId: WeekId) => void;
  currentWeek: WeekDefinition;
}

export const SchoolFilterBar: React.FC<SchoolFilterBarProps> = ({
  selectedSchoolId,
  onSelectSchool,
  selectedSchool,
  selectedWeekId,
  onSelectWeek,
  currentWeek,
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-300 p-4 sm:p-6 shadow-sm space-y-5">
      
      {/* 1. FILTER CHỌN TUẦN THỰC ĐƠN */}
      <div className="space-y-3 border-b border-emerald-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CalendarDays className="w-4 h-4" />
            </span>
            <span>1. Chọn tuần khảo sát thực đơn:</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            {currentWeek.isUniversal 
              ? '✨ Tuần này áp dụng chung toàn bộ các điểm trường' 
              : '⚡ Tuần này thực đơn theo nhóm điểm trường'}
          </span>
        </div>

        {/* 3 Tabs / Buttons chọn tuần */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {WEEKS_LIST.map((week) => {
            const isSelected = week.id === selectedWeekId;
            return (
              <button
                key={week.id}
                type="button"
                onClick={() => onSelectWeek(week.id)}
                className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-extrabold text-sm sm:text-base ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {week.name}
                  </span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                  )}
                </div>
                
                <div className="text-xs font-medium text-slate-600">
                  {week.dateRange}
                </div>

                <div className={`text-[11px] font-medium pt-1 border-t ${
                  isSelected ? 'border-emerald-200 text-emerald-700' : 'border-slate-100 text-slate-500'
                }`}>
                  {week.isUniversal ? 'Chung cho tất cả các trường' : 'Theo nhóm trường'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. FILTER CHỌN ĐIỂM TRƯỜNG */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor="school-filter-select" className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <School2 className="w-4 h-4" />
            </span>
            <span>2. Chọn điểm trường học sinh đang theo học:</span>
            <span className="text-rose-500 font-bold">*</span>
          </label>
          <span className="text-xs text-slate-500">
            {selectedSchool ? `Đã chọn: ${selectedSchool.name}` : 'Bắt buộc chọn trường'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8">
            <select
              id="school-filter-select"
              value={selectedSchoolId}
              onChange={(e) => onSelectSchool(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-emerald-400/90 bg-emerald-50/40 hover:bg-white focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all text-sm sm:text-base font-semibold text-slate-900 outline-none cursor-pointer"
            >
              <option value="">-- Vui lòng chọn điểm trường học của học sinh --</option>
              
              <optgroup label="📍 Khu vực Xã An Thượng & Xã An Khánh">
                {SCHOOLS_LIST.filter(s => s.menuGroup === 'an_khanh').map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="📍 Khu vực Xã Đa Phúc">
                {SCHOOLS_LIST.filter(s => s.menuGroup === 'da_phuc').map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {selectedSchool && (
            <div className="md:col-span-4 flex items-center gap-2 text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold block truncate">{selectedSchool.name}</span>
                <span className="text-slate-600 text-[11px] truncate block">
                  {currentWeek.isUniversal 
                    ? `Thực đơn ${currentWeek.name} chung toàn trường` 
                    : (selectedSchool.menuGroup === 'an_khanh' ? 'Menu Khu vực An Thượng & An Khánh' : 'Menu Khu vực Đa Phúc')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ghi chú ngữ cảnh áp dụng thực đơn */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          {currentWeek.isUniversal ? (
            <span>
              <strong>Lưu ý:</strong> Thực đơn <strong>{currentWeek.name} ({currentWeek.dateRange})</strong> được áp dụng thống nhất cho toàn bộ các điểm trường với định lượng cơm tiêu chuẩn 220g và cơ cấu dinh dưỡng cân đối.
            </span>
          ) : (
            <span>
              <strong>Lưu ý:</strong> Thực đơn <strong>{currentWeek.name} ({currentWeek.dateRange})</strong> áp dụng theo từng khu vực trường học (Xã An Thượng & An Khánh: cơm 220g; Xã Đa Phúc: cơm 240g kèm tráng miệng).
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
