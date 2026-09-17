import React, { useState } from 'react';
import { Calendar, Apple, Soup, UtensilsCrossed, ChevronLeft, ChevronRight, LayoutGrid, Table } from 'lucide-react';
import { DayMenuItem, School, WeekDefinition } from '../types';

interface WeeklyMenuTableProps {
  menuItems: DayMenuItem[];
  selectedSchool?: School;
  currentWeek?: WeekDefinition;
}

export const WeeklyMenuTable: React.FC<WeeklyMenuTableProps> = ({
  menuItems,
  selectedSchool,
  currentWeek,
}) => {
  const [activeDayTab, setActiveDayTab] = useState<string>(menuItems[0]?.dayId || 'thu_2');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const activeDay = menuItems.find(m => m.dayId === activeDayTab) || menuItems[0];
  const hasAnyDessert = menuItems.some(m => Boolean(m.dessert && m.dessert.trim()));

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 sm:px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-emerald-200 shrink-0" />
          <div>
            <h3 className="font-bold text-base sm:text-lg leading-tight">
              Bảng Tổng Hợp Thực Đơn Bán Trú {currentWeek ? `• ${currentWeek.name} (${currentWeek.dateRange})` : ''}
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              {currentWeek?.isUniversal ? (
                <span>Áp dụng chung đồng nhất cho toàn bộ các điểm trường • {selectedSchool?.name || ''}</span>
              ) : selectedSchool ? (
                `Áp dụng tại: ${selectedSchool.name} (${selectedSchool.groupLabel})`
              ) : (
                'Thực đơn chi tiết theo định lượng tiêu chuẩn SIBA'
              )}
            </p>
          </div>
        </div>

        {/* View Switcher for mobile/tablet */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <div className="inline-flex bg-white/20 backdrop-blur-xs p-0.5 rounded-lg border border-white/20 text-xs text-white">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-emerald-900 shadow-xs' : 'hover:bg-white/10'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Xem theo ngày</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-emerald-900 shadow-xs' : 'hover:bg-white/10'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Xem bảng lưới</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET FRIENDLY CARD-TABS VIEW (Default or on toggle) */}
      {viewMode === 'cards' && (
        <div className="p-3 sm:p-5 bg-slate-50/70">
          {/* Day Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {menuItems.map((item) => {
              const isActive = item.dayId === activeDayTab;
              return (
                <button
                  key={item.dayId}
                  type="button"
                  onClick={() => setActiveDayTab(item.dayId)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer flex flex-col items-center min-w-[72px] sm:min-w-[90px] border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <span>{item.dayName}</span>
                  <span className={`text-[10px] font-normal ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.dateStr.slice(0, 5)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Card */}
          {activeDay && (
            <div className="mt-3 bg-white rounded-2xl border border-emerald-200/80 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-slate-900 text-base sm:text-lg">
                    {activeDay.dayName} ({activeDay.dateStr})
                  </span>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                  {activeDay.ricePortion}
                </span>
              </div>

              {/* Dish Items Grid for Active Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase block mb-0.5">
                      Món chính
                    </span>
                    <strong className="text-slate-900 text-sm sm:text-base">{activeDay.mainDish}</strong>
                  </div>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded text-emerald-700 font-medium border border-emerald-200 shrink-0">
                    ĐL: {activeDay.mainDishPortion}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-800 uppercase block mb-0.5">
                      Món phụ
                    </span>
                    <strong className="text-slate-900 text-sm sm:text-base">{activeDay.sideDish}</strong>
                  </div>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded text-amber-700 font-medium border border-amber-200 shrink-0">
                    ĐL: {activeDay.sideDishPortion}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 uppercase block mb-0.5">
                      Rau củ xào/luộc
                    </span>
                    <strong className="text-slate-900">{activeDay.vegDish}</strong>
                  </div>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded text-slate-600 font-medium border border-slate-200 shrink-0">
                    ĐL: {activeDay.vegDishPortion}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-800 uppercase block mb-0.5">
                      Món canh
                    </span>
                    <strong className="text-slate-900">{activeDay.soupDish}</strong>
                  </div>
                </div>

                {activeDay.dessert && (
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 sm:col-span-2 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-rose-800 uppercase block mb-0.5">
                        Tráng miệng
                      </span>
                      <strong className="text-slate-900">{activeDay.dessert}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL RESPONSIVE SCROLLABLE TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-amber-100/70 text-slate-800 font-bold border-b border-amber-200">
                <th className="py-3 px-3 w-28 bg-amber-200/60 sticky left-0 z-10 shadow-xs">Loại món</th>
                {menuItems.map((item) => (
                  <th key={item.dayId} className="py-3 px-3 text-center min-w-[140px] border-l border-amber-200/80">
                    <div className="font-extrabold text-slate-900">{item.dayName}</div>
                    <div className="text-[11px] font-normal text-slate-600">{item.dateStr}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* 1. Món chính */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200 shadow-xs">
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
                <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200 shadow-xs">
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
                <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200 shadow-xs">
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
                <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200 shadow-xs">
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
                <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200 shadow-xs">
                  <span className="text-slate-700">Cơm trắng</span>
                </td>
                {menuItems.map((item) => (
                  <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                    <div className="font-semibold text-emerald-800">{item.ricePortion}</div>
                  </td>
                ))}
              </tr>

              {/* 6. Tráng miệng (Chỉ hiển thị nếu có điểm trường áp dụng tráng miệng) */}
              {hasAnyDessert && (
                <tr className="hover:bg-slate-50/80 transition-colors bg-amber-50/30">
                  <td className="py-3 px-3 font-semibold text-slate-800 bg-slate-50 sticky left-0 z-10 border-r border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <Apple className="w-3.5 h-3.5" />
                      <span>Tráng miệng</span>
                    </div>
                  </td>
                  {menuItems.map((item) => (
                    <td key={item.dayId} className="py-3 px-3 text-center border-l border-slate-200 align-top">
                      {item.dessert ? (
                        <div className="font-bold text-amber-900 bg-amber-100/70 py-1 px-2 rounded-md inline-block">
                          {item.dessert}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-[12px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <span className="text-slate-600 font-medium italic">
          * Ghi chú: Ảnh minh hoạ món chính & món phụ theo ngày cần đầu bếp xác nhận.
        </span>
        <span className="text-slate-400">Đơn vị tính định lượng: gram (g)</span>
      </div>
    </div>
  );
};
