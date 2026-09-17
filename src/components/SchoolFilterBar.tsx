import React from 'react';
import { School2, MapPin, CheckCircle2 } from 'lucide-react';
import { SCHOOLS_LIST } from '../data/schoolsAndMenus';
import { School } from '../types';

interface SchoolFilterBarProps {
  selectedSchoolId: string;
  onSelectSchool: (schoolId: string) => void;
  selectedSchool?: School;
}

export const SchoolFilterBar: React.FC<SchoolFilterBarProps> = ({
  selectedSchoolId,
  onSelectSchool,
  selectedSchool,
}) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-300 p-4 sm:p-5 shadow-sm space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label htmlFor="school-filter-select" className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <School2 className="w-4 h-4" />
          </span>
          <span>Chọn điểm trường học sinh đang theo học:</span>
          <span className="text-rose-500 font-bold">*</span>
        </label>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          ⚡ Thực đơn bên dưới sẽ đổi theo trường
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
              <span className="text-slate-500 text-[11px] truncate block">
                {selectedSchool.menuGroup === 'an_khanh' ? 'Menu An Thượng & An Khánh' : 'Menu Phân hiệu Đa Phúc'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
