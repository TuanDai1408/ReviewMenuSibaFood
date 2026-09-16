import React from 'react';
import { ThumbsUp, ThumbsDown, ArrowLeftRight, Lightbulb, MessageSquare, Check, Sparkles } from 'lucide-react';
import { DayMenuItem, DayFeedback, OpinionType } from '../types';

interface DayFeedbackCardProps {
  dayMenu: DayMenuItem;
  feedback: DayFeedback;
  onChangeOpinion: (dayId: string, opinion: OpinionType) => void;
  onChangeSuggestedDish: (dayId: string, dish: string) => void;
  onChangeComment: (dayId: string, comment: string) => void;
  index: number;
}

export const DayFeedbackCard: React.FC<DayFeedbackCardProps> = ({
  dayMenu,
  feedback,
  onChangeOpinion,
  onChangeSuggestedDish,
  onChangeComment,
  index,
}) => {
  const currentOpinion = feedback?.opinion || '';
  const suggestedDish = feedback?.suggestedDish || '';
  const comment = feedback?.comment || '';

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Day Title & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            {index + 1}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Thực đơn {dayMenu.dayName}: Bữa trưa chính
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {dayMenu.dateStr}
          </span>
        </div>

        {currentOpinion && (
          <div className="text-xs font-bold self-start sm:self-center">
            {currentOpinion === 'dong_thuan' && (
              <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Đã chọn: Đồng thuận
              </span>
            )}
            {currentOpinion === 'khong_dong_thuan' && (
              <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ThumbsDown className="w-3.5 h-3.5" /> Đã chọn: Không đồng thuận
              </span>
            )}
            {currentOpinion === 'doi_mon' && (
              <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ArrowLeftRight className="w-3.5 h-3.5" /> Đã chọn: Đổi món
              </span>
            )}
          </div>
        )}
      </div>

      {/* Dish details banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 sm:p-4 mb-4 text-sm text-slate-700">
        <div className="font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Chi tiết khẩu phần ăn dự kiến:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs sm:text-sm mt-2">
          <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
            <span className="text-slate-500 font-medium">Món chính:</span>{' '}
            <strong className="text-slate-800">{dayMenu.mainDish}</strong>{' '}
            <span className="text-xs text-emerald-700">({dayMenu.mainDishPortion})</span>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
            <span className="text-slate-500 font-medium">Món phụ:</span>{' '}
            <strong className="text-slate-800">{dayMenu.sideDish}</strong>{' '}
            <span className="text-xs text-emerald-700">({dayMenu.sideDishPortion})</span>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
            <span className="text-slate-500 font-medium">Rau củ:</span>{' '}
            <strong className="text-slate-800">{dayMenu.vegDish}</strong>{' '}
            <span className="text-xs text-emerald-700">({dayMenu.vegDishPortion})</span>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
            <span className="text-slate-500 font-medium">Canh:</span>{' '}
            <strong className="text-slate-800">{dayMenu.soupDish}</strong>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
            <span className="text-slate-500 font-medium">Cơm:</span>{' '}
            <strong className="text-slate-800">{dayMenu.ricePortion}</strong>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/80 bg-amber-50/40">
            <span className="text-amber-800 font-medium">Tráng miệng:</span>{' '}
            <strong className="text-amber-900">{dayMenu.dessert}</strong>
          </div>
        </div>
      </div>

      {/* Evaluation Radio options */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2.5">
          Ý kiến của Quý vị đối với thực đơn {dayMenu.dayName}: <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Lựa chọn 1: Đồng thuận */}
          <label
            className={`cursor-pointer border-2 rounded-xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center transition-all ${
              currentOpinion === 'dong_thuan'
                ? 'border-emerald-500 bg-emerald-50/80 shadow-md shadow-emerald-100'
                : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name={`opinion_${dayMenu.dayId}`}
              value="dong_thuan"
              checked={currentOpinion === 'dong_thuan'}
              onChange={() => onChangeOpinion(dayMenu.dayId, 'dong_thuan')}
              className="sr-only"
              required
            />
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Đồng thuận</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Giữ nguyên thực đơn</span>
          </label>

          {/* Lựa chọn 2: Không đồng thuận */}
          <label
            className={`cursor-pointer border-2 rounded-xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center transition-all ${
              currentOpinion === 'khong_dong_thuan'
                ? 'border-rose-500 bg-rose-50/80 shadow-md shadow-rose-100'
                : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name={`opinion_${dayMenu.dayId}`}
              value="khong_dong_thuan"
              checked={currentOpinion === 'khong_dong_thuan'}
              onChange={() => onChangeOpinion(dayMenu.dayId, 'khong_dong_thuan')}
              className="sr-only"
            />
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-1.5">
              <ThumbsDown className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Không đồng thuận</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Không thích món này</span>
          </label>

          {/* Lựa chọn 3: Đổi món */}
          <label
            className={`cursor-pointer border-2 rounded-xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center transition-all ${
              currentOpinion === 'doi_mon'
                ? 'border-amber-500 bg-amber-50/80 shadow-md shadow-amber-100'
                : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name={`opinion_${dayMenu.dayId}`}
              value="doi_mon"
              checked={currentOpinion === 'doi_mon'}
              onChange={() => onChangeOpinion(dayMenu.dayId, 'doi_mon')}
              className="sr-only"
            />
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Đổi món</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Muốn đổi món khác</span>
          </label>
        </div>
      </div>

      {/* Input khi chọn Đổi món */}
      {currentOpinion === 'doi_mon' && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 transition-all duration-300">
          <label className="block text-sm font-bold text-amber-800 mb-1.5 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Quý vị muốn đổi sang món gì?</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={suggestedDish}
            onChange={(e) => onChangeSuggestedDish(dayMenu.dayId, e.target.value)}
            required
            placeholder="VD: Gà rán giòn, Thịt lợn sốt chua ngọt, Cá phi lê chiên xù..."
            className="w-full px-4 py-3 rounded-xl border border-amber-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm text-slate-800"
          />
          <p className="text-[11px] text-amber-700 mt-1">
            Gợi ý món thay thế giúp bộ phận dinh dưỡng SIBA điều chỉnh thực đơn phù hợp nhất với sở thích của các bé.
          </p>
        </div>
      )}

      {/* Góp ý riêng cho ngày này */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>Góp ý riêng cho bữa ăn {dayMenu.dayName} (không bắt buộc):</span>
        </label>
        <input
          type="text"
          value={comment}
          onChange={(e) => onChangeComment(dayMenu.dayId, e.target.value)}
          placeholder="VD: Xin ít cay, cần thái nhỏ thịt hơn cho các bé khối 1-2, thêm xốt..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs sm:text-sm text-slate-700"
        />
      </div>
    </div>
  );
};
