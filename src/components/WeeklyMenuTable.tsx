import React from 'react';
import { Calendar, Apple, Soup, UtensilsCrossed, Sparkles } from 'lucide-react';
import { DayMenuItem, School } from '../types';

interface WeeklyMenuTableProps {
  menuItems: DayMenuItem[];
  selectedSchool?: School;
}

export const WeeklyMenuTable: React.FC<WeeklyMenuTableProps> = ({
  menuItems,
  selectedSchool,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-5 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-emerald-200" />
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              Bảng Tổng Hợp Thực Đơn Bán Trú Tuần 2 (Từ 14/09 đến 18/09)
            </h3>
            <p className="text-xs text-emerald-100">
              {selectedSchool 
                ? `Áp dụng tại: ${selectedSchool.name} (${selectedSchool.groupLabel})`
                : 'Thực đơn mẫu chi tiết theo định lượng dinh dưỡng tiêu chuẩn SIBA'}
            </p>
          </div>
        </div>

        <div className="text-xs bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-white font-medium self-start sm:self-center border border-white/20">
          Buổi Trưa Chính
        </div>
      </div>

      {/* Desktop / Tablet Full Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-amber-100/70 text-slate-800 font-bold border-b border-amber-200">
              <th className="py-3 px-3 w-28 bg-amber-200/60 sticky left-0 z-10">Loại món</th>
              {menuItems.map((item) => (
                <th key={item.dayId} className="py-3 px-3 text-center min-w-[150px] border-l border-amber-200/80">
                  <div className="font-extrabold text-slate-900">{item.dayName}</div>
                  <div className="text-[11px] font-normal text-slate-600">{item.dateStr}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* 1. Món chính */}
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Món chính</span>
                </div>
              </td>
              {menuItems.map((item) => (
                <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                  <div className="font-bold text-slate-800">{item.mainDish}</div>
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 mt-1 inline-block border border-emerald-200/60">
                    ĐL: {item.mainDishPortion}
                  </div>
                </td>
              ))}
            </tr>

            {/* 2. Món phụ */}
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                <span className="text-slate-700">Món phụ</span>
              </td>
              {menuItems.map((item) => {
                const isSpecialT5 = item.dayId === 'thu_5';
                return (
                  <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                    <div className={`font-semibold ${isSpecialT5 ? 'text-amber-800 font-bold' : 'text-slate-800'}`}>
                      {item.sideDish}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ĐL: {item.sideDishPortion}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 3. Rau xanh */}
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                <span className="text-slate-700">Rau củ</span>
              </td>
              {menuItems.map((item) => (
                <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                  <div className="text-slate-800 font-medium">{item.vegDish}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ĐL: {item.vegDishPortion}
                  </div>
                </td>
              ))}
            </tr>

            {/* 4. Món canh */}
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                <div className="flex items-center gap-1.5 text-teal-700">
                  <Soup className="w-3.5 h-3.5" />
                  <span>Món canh</span>
                </div>
              </td>
              {menuItems.map((item) => (
                <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                  <div className="text-slate-800 font-medium">{item.soupDish}</div>
                </td>
              ))}
            </tr>

            {/* 5. Cơm trắng */}
            <tr className="hover:bg-slate-50/80 transition-colors bg-emerald-50/20">
              <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                <span className="text-slate-700">Cơm trắng</span>
              </td>
              {menuItems.map((item) => (
                <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                  <div className="font-semibold text-emerald-800">{item.ricePortion}</div>
                </td>
              ))}
            </tr>

            {/* 6. Tráng miệng */}
            <tr className="hover:bg-slate-50/80 transition-colors bg-amber-50/30">
              <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <Apple className="w-3.5 h-3.5" />
                  <span>Tráng miệng</span>
                </div>
              </td>
              {menuItems.map((item) => (
                <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                  <div className="font-bold text-amber-900 bg-amber-100/70 py-1 px-2 rounded-md inline-block">
                    {item.dessert}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 text-[12px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Tiêu chuẩn định lượng và vi chất được kiểm định nghiêm ngặt theo quy định của Sở GD&ĐT và Bộ Y tế.
        </span>
        <span className="text-slate-400">Đơn vị tính: gram (g)</span>
      </div>
    </div>
  );
};
