import React from 'react';
import { Utensils, MapPin, Building2, Phone, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../data/schoolsAndMenus';

export const HeaderBanner: React.FC = () => {
  return (
    <header className="rounded-3xl overflow-hidden shadow-2xl bg-white border border-emerald-100">
      {/* Visual Hero Banner with Warm Catering Atmosphere */}
      <div className="relative h-60 sm:h-72 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 flex flex-col justify-end p-6 sm:p-8 text-white overflow-hidden">
        {/* Background Image with Warm Food Vibe */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80')`
          }}
        />
        
        {/* Soft lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/60 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-bold tracking-wide uppercase mb-3">
            <Utensils className="w-4 h-4 text-emerald-300" />
            <span>{COMPANY_INFO.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
            Khảo Sát Thực Đơn Bán Trú Học Đường
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base font-medium flex items-center gap-1.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            Đồng hành cùng sự phát triển toàn diện & bữa ăn an toàn, dinh dưỡng của học sinh
          </p>
        </div>
      </div>

      {/* Headquarter & Company Info strip */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 sm:px-8 py-3.5 text-xs sm:text-sm text-slate-600 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-slate-800">{COMPANY_INFO.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{COMPANY_INFO.headquarters}</span>
        </div>
      </div>

      {/* Greeting letter */}
      <div className="p-6 sm:p-8 bg-emerald-50/40 border-b border-emerald-100/60">
        <div className="prose prose-emerald max-w-none text-slate-700 leading-relaxed text-sm sm:text-base">
          <p className="font-bold text-emerald-900 text-base sm:text-lg mb-2">
            Kính gửi Quý Phụ huynh và Ban Giám hiệu nhà trường,
          </p>
          <p className="text-slate-600 text-sm sm:text-base">
            Để chuẩn bị chu đáo cho thực đơn bán trú tháng 9 (áp dụng từ <strong>14/09 đến 18/09</strong>), 
            <strong> {COMPANY_INFO.name}</strong> trân trọng gửi đến Quý vị danh sách thực đơn chi tiết theo từng điểm trường. 
            Mỗi ý kiến đồng thuận hoặc đề xuất điều chỉnh của Quý vị là cơ sở quý báu để chúng tôi nâng niu từng bữa ăn, 
            đảm bảo cân bằng vi chất và hợp khẩu vị của các con học sinh.
          </p>
        </div>
      </div>
    </header>
  );
};
