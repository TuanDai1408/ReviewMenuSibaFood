import React from 'react';
import { School2, User, BookOpen, GraduationCap, MapPin, CheckCircle2, Phone } from 'lucide-react';
import { SCHOOLS_LIST } from '../data/schoolsAndMenus';
import { School } from '../types';

interface GeneralInfoProps {
  evaluatorType: string;
  setEvaluatorType: (val: 'phu_huynh' | 'giao_vien' | 'khac') => void;
  fullName: string;
  setFullName: (val: string) => void;
  selectedSchoolId: string;
  onSelectSchool: (schoolId: string) => void;
  studentClass: string;
  setStudentClass: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  selectedSchool?: School;
}

export const GeneralInfoStep: React.FC<GeneralInfoProps> = ({
  evaluatorType,
  setEvaluatorType,
  fullName,
  setFullName,
  selectedSchoolId,
  onSelectSchool,
  studentClass,
  setStudentClass,
  phone,
  setPhone,
  selectedSchool,
}) => {
  return (
    <section id="section-general-info" className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-200">
          1
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Thông tin người đánh giá & Điểm trường</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Chọn đúng điểm trường để hệ thống hiển thị thực đơn tương ứng của trường đó
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* 1. Người đánh giá */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Người đánh giá</span>
            <span className="text-rose-500">*</span>
          </label>
          <select
            id="select-evaluator-type"
            value={evaluatorType}
            onChange={(e) => setEvaluatorType(e.target.value as 'phu_huynh' | 'giao_vien' | 'khac')}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-medium text-slate-800 outline-none"
          >
            <option value="">-- Chọn đối tượng khảo sát --</option>
            <option value="phu_huynh">Phụ huynh học sinh</option>
            <option value="giao_vien">Giáo viên / Ban Giám hiệu Nhà trường</option>
            <option value="khac">Cán bộ Y tế / Ban đại diện phụ huynh</option>
          </select>
        </div>

        {/* 2. Họ và tên */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Họ và tên của bạn</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            id="input-fullname"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ và tên đầy đủ..."
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm text-slate-800 outline-none"
          />
        </div>

        {/* 3. Chọn điểm trường (Trọng tâm câu hỏi) */}
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <School2 className="w-4 h-4 text-emerald-600" />
              <span>Điểm trường học áp dụng thực đơn</span>
              <span className="text-rose-500">*</span>
            </span>
            <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Menu thay đổi tự động theo trường
            </span>
          </label>

          <select
            id="select-school"
            value={selectedSchoolId}
            onChange={(e) => onSelectSchool(e.target.value)}
            required
            className="w-full px-4 py-3.5 rounded-xl border-2 border-emerald-300 bg-emerald-50/30 hover:bg-white focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 transition-all text-sm sm:text-base font-semibold text-slate-800 outline-none cursor-pointer"
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

        {/* School Info Badge Card when selected */}
        {selectedSchool && (
          <div className="sm:col-span-2 p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-950 text-base">{selectedSchool.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedSchool.address}</span>
              </div>
            </div>

            <div className="shrink-0 bg-white px-3 py-1.5 rounded-lg border border-emerald-300/80 shadow-xs text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {selectedSchool.menuGroup === 'an_khanh' 
                ? 'Thực đơn: An Thượng & An Khánh' 
                : 'Thực đơn: Phân hiệu Đa Phúc'}
            </div>
          </div>
        )}

        {/* 4. Tên học sinh / Lớp */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Tên học sinh / Lớp</span>
            <span className="text-xs text-slate-400 font-normal">(Nếu có)</span>
          </label>
          <input
            id="input-student-class"
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="VD: Nguyễn Bảo An - Lớp 3A1"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm text-slate-800 outline-none"
          />
        </div>

        {/* 5. Số điện thoại liên hệ */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Số điện thoại liên hệ</span>
            <span className="text-xs text-slate-400 font-normal">(Để hỗ trợ khi cần)</span>
          </label>
          <input
            id="input-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="VD: 0912 xxx xxx"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm text-slate-800 outline-none"
          />
        </div>
      </div>
    </section>
  );
};
