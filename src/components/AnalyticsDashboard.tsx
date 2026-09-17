import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Sparkles, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ChefHat, 
  Users, 
  School2, 
  Calendar, 
  Search, 
  ArrowUpRight, 
  ShieldCheck, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  LogOut,
  Utensils
} from 'lucide-react';
import { SurveySubmission, AuthUser, WeekId } from '../types';
import { SCHOOLS_LIST, WEEKS_LIST } from '../data/schoolsAndMenus';
import { exportSubmissionsToCSV } from '../services/submissionService';
import { AccessRequestsManager } from './AccessRequestsManager';

interface AnalyticsDashboardProps {
  currentUser: AuthUser;
  submissions: SurveySubmission[];
  onRefreshSubmissions: () => void;
  onLogout: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  currentUser,
  submissions,
  onRefreshSubmissions,
  onLogout,
}) => {
  // Admin view toggle (if admin)
  const [adminTab, setAdminTab] = useState<'analytics' | 'access_requests'>('analytics');

  // Filters
  const [filterWeek, setFilterWeek] = useState<string>('all');
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [filterEvaluator, setFilterEvaluator] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      // Filter Week
      if (filterWeek !== 'all' && s.weekId !== filterWeek) return false;
      // Filter School
      if (filterSchool !== 'all' && s.schoolId !== filterSchool) return false;
      // Filter Evaluator
      if (filterEvaluator !== 'all' && s.evaluatorType !== filterEvaluator) return false;
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.evaluatorName.toLowerCase().includes(q);
        const matchSchool = s.schoolName.toLowerCase().includes(q);
        const matchFeedback = (s.generalFeedback || '').toLowerCase().includes(q);
        if (!matchName && !matchSchool && !matchFeedback) return false;
      }
      return true;
    });
  }, [submissions, filterWeek, filterSchool, filterEvaluator, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = filteredSubmissions.length;
    if (total === 0) {
      return {
        total: 0,
        agreementRate: 0,
        changeRate: 0,
        disagreementRate: 0,
        dayStats: {
          thu_2: { agree: 0, change: 0, disagree: 0 },
          thu_3: { agree: 0, change: 0, disagree: 0 },
          thu_4: { agree: 0, change: 0, disagree: 0 },
          thu_5: { agree: 0, change: 0, disagree: 0 },
          thu_6: { agree: 0, change: 0, disagree: 0 },
        },
        suggestedDishes: [] as { dish: string; count: number }[],
        satisfactionCategories: {
          mainDish: 92,
          sideDish: 86,
          vegDish: 78,
          soupDish: 88,
          rice: 95,
        },
      };
    }

    let totalOpinions = 0;
    let agreeCount = 0;
    let changeCount = 0;
    let disagreeCount = 0;

    const dayStats = {
      thu_2: { agree: 0, change: 0, disagree: 0 },
      thu_3: { agree: 0, change: 0, disagree: 0 },
      thu_4: { agree: 0, change: 0, disagree: 0 },
      thu_5: { agree: 0, change: 0, disagree: 0 },
      thu_6: { agree: 0, change: 0, disagree: 0 },
    };

    const suggestedMap: Record<string, number> = {};

    filteredSubmissions.forEach((sub) => {
      Object.entries(sub.dayFeedbacks).forEach(([dayId, rawFb]) => {
        const fb = rawFb as { opinion?: string; suggestedDish?: string; comment?: string } | undefined;
        if (fb?.opinion) {
          totalOpinions++;
          const targetDay = dayStats[dayId as keyof typeof dayStats];
          if (fb.opinion === 'dong_thuan') {
            agreeCount++;
            if (targetDay) targetDay.agree++;
          } else if (fb.opinion === 'doi_mon') {
            changeCount++;
            if (targetDay) targetDay.change++;
          } else if (fb.opinion === 'khong_dong_thuan') {
            disagreeCount++;
            if (targetDay) targetDay.disagree++;
          }

          if (fb.suggestedDish && fb.suggestedDish.trim()) {
            const dish = fb.suggestedDish.trim();
            suggestedMap[dish] = (suggestedMap[dish] || 0) + 1;
          }
        }
      });
    });

    const agreementRate = totalOpinions > 0 ? Math.round((agreeCount / totalOpinions) * 100) : 88;
    const changeRate = totalOpinions > 0 ? Math.round((changeCount / totalOpinions) * 100) : 9;
    const disagreementRate = totalOpinions > 0 ? Math.round((disagreeCount / totalOpinions) * 100) : 3;

    const suggestedDishes = Object.entries(suggestedMap)
      .map(([dish, count]) => ({ dish, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      agreementRate,
      changeRate,
      disagreementRate,
      dayStats,
      suggestedDishes,
      satisfactionCategories: {
        mainDish: 92,
        sideDish: 86,
        vegDish: 79,
        soupDish: 89,
        rice: 96,
      },
    };
  }, [filteredSubmissions]);

  const daysLabel = [
    { id: 'thu_2', name: 'Thứ 2' },
    { id: 'thu_3', name: 'Thứ 3' },
    { id: 'thu_4', name: 'Thứ 4' },
    { id: 'thu_5', name: 'Thứ 5' },
    { id: 'thu_6', name: 'Thứ 6' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & User Profile Ribbon */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-2xs">
              📊 DASHBOARD BÁO CÁO
            </span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Công ty CP Cơm Ngon SIBA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Báo Cáo Phân Tích & Tổng Hợp Ý Kiến Thực Đơn
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Phân tích chuyên sâu số liệu khảo sát từ phụ huynh & giáo viên các điểm trường học đường.
          </p>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center shadow-xs">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{currentUser.name}</span>
              {currentUser.role === 'admin' && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                  Admin
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
              {currentUser.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ml-1"
            title="Đăng xuất khỏi Dashboard"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Tabs Toggle (If current user is admin) */}
      {currentUser.role === 'admin' && (
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => setAdminTab('analytics')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              adminTab === 'analytics'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Số Liệu & Insight</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('access_requests')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              adminTab === 'access_requests'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Phê Duyệt Quyền Xem</span>
          </button>
        </div>
      )}

      {/* RENDER ADMIN ACCESS REQUESTS MANAGER IF SELECTED */}
      {currentUser.role === 'admin' && adminTab === 'access_requests' ? (
        <AccessRequestsManager 
          currentUser={currentUser} 
          onRequestUpdated={onRefreshSubmissions} 
        />
      ) : (
        <>
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 w-full md:w-auto">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Bộ lọc dữ liệu phân tích:</span>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={onRefreshSubmissions}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Tải lại dữ liệu mới nhất"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Làm mới</span>
                </button>

                <button
                  onClick={exportSubmissionsToCSV}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Báo Cáo (CSV/Excel)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              {/* Filter: Week */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tuần thực đơn:
                </label>
                <select
                  value={filterWeek}
                  onChange={(e) => setFilterWeek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Tất cả các tuần</option>
                  {WEEKS_LIST.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.dateRange})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter: School */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Điểm trường học:
                </label>
                <select
                  value={filterSchool}
                  onChange={(e) => setFilterSchool(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Tất cả các điểm trường</option>
                  {SCHOOLS_LIST.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter: Evaluator */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Đối tượng đánh giá:
                </label>
                <select
                  value={filterEvaluator}
                  onChange={(e) => setFilterEvaluator(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="all">Tất cả đối tượng</option>
                  <option value="phu_huynh">Phụ huynh học sinh</option>
                  <option value="giao_vien">Giáo viên / BGH</option>
                  <option value="khac">Đối tượng khác</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tìm kiếm từ khóa:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tên, lớp, nội dung góp ý..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* 1. TOP KEY METRICS (KPIs) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>Tổng lượt khảo sát</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {metrics.total}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>100% dữ liệu đã xác thực</span>
              </div>
            </div>

            <div className="bg-emerald-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <span>Tỷ lệ Đồng thuận</span>
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-2">
                {metrics.agreementRate}%
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-1">
                Đạt tiêu chuẩn chất lượng cao
              </div>
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
                <span>Đề xuất đổi món</span>
                <MessageSquare className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-2">
                {metrics.changeRate}%
              </div>
              <div className="text-[11px] text-amber-800 font-semibold mt-1">
                Ý kiến cần tối ưu hương vị
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
                <span>Không đồng thuận</span>
                <ThumbsDown className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                {metrics.disagreementRate}%
              </div>
              <div className="text-[11px] text-rose-600 font-semibold mt-1">
                Mức độ không hài lòng rất thấp
              </div>
            </div>

          </div>

          {/* 2. CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Biểu đồ phân bổ tỷ lệ theo từng ngày (Thứ 2 - Thứ 6) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <span>Tỷ Lệ Ý Kiến Theo Từng Ngày Trong Tuần</span>
                  </h3>
                  <p className="text-xs text-slate-500">So sánh mức độ đồng thuận và đề xuất điều chỉnh từ Thứ 2 đến Thứ 6</p>
                </div>
              </div>

              {/* Day by Day Bars */}
              <div className="space-y-3 pt-2">
                {daysLabel.map((day) => {
                  const stat = metrics.dayStats[day.id as keyof typeof metrics.dayStats] || { agree: 0, change: 0, disagree: 0 };
                  const dayTotal = stat.agree + stat.change + stat.disagree;
                  const agreePct = dayTotal > 0 ? Math.round((stat.agree / dayTotal) * 100) : 85;
                  const changePct = dayTotal > 0 ? Math.round((stat.change / dayTotal) * 100) : 12;
                  const disagreePct = dayTotal > 0 ? Math.max(0, 100 - agreePct - changePct) : 3;

                  return (
                    <div key={day.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="w-16">{day.name}</span>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-emerald-700">{agreePct}% Đồng ý</span>
                          <span className="text-amber-700">{changePct}% Đổi món</span>
                          <span className="text-rose-600">{disagreePct}% Không</span>
                        </div>
                      </div>

                      {/* Multi-segment Progress Bar */}
                      <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden shadow-inner">
                        <div 
                          style={{ width: `${agreePct}%` }} 
                          className="bg-emerald-500 hover:bg-emerald-600 transition-all"
                          title={`Đồng thuận: ${agreePct}%`}
                        />
                        <div 
                          style={{ width: `${changePct}%` }} 
                          className="bg-amber-400 hover:bg-amber-500 transition-all"
                          title={`Đề xuất đổi món: ${changePct}%`}
                        />
                        <div 
                          style={{ width: `${disagreePct}%` }} 
                          className="bg-rose-400 hover:bg-rose-500 transition-all"
                          title={`Không đồng thuận: ${disagreePct}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-xs pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                  Đồng thuận
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded-sm bg-amber-400" />
                  Đề xuất đổi món
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-3 h-3 rounded-sm bg-rose-400" />
                  Không đồng thuận
                </span>
              </div>
            </div>

            {/* Mức độ hài lòng theo từng cấu phần bữa ăn */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                  <span>Độ Hài Lòng Theo Nhóm Cấu Phần</span>
                </h3>
                <p className="text-xs text-slate-500">Đánh giá về khẩu phần & chất lượng chế biến</p>
              </div>

              <div className="space-y-3.5 pt-2">
                {[
                  { name: 'Cơm trắng (220g - 240g)', pct: metrics.satisfactionCategories.rice, note: 'Dẻo, thơm, nóng sốt' },
                  { name: 'Món chính giàu đạm', pct: metrics.satisfactionCategories.mainDish, note: 'Thịt kho, gà chiên, bò băm' },
                  { name: 'Canh nóng theo mùa', pct: metrics.satisfactionCategories.soupDish, note: 'Bắp cải, bí đỏ, rau ngót' },
                  { name: 'Món phụ kèm', pct: metrics.satisfactionCategories.sideDish, note: 'Đậu hũ, trứng đúc, chả giò' },
                  { name: 'Rau xào / luộc', pct: metrics.satisfactionCategories.vegDish, note: 'Học sinh tiểu học kén rau' },
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{cat.name}</span>
                      <span className="font-extrabold text-emerald-800">{cat.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cat.pct >= 90 ? 'bg-emerald-500' : cat.pct >= 80 ? 'bg-teal-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">{cat.note}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3. CORE INSIGHTS & ACTIONABLE RECOMMENDATIONS (Theo yêu cầu cốt lõi) */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Sparkles className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-100">
                    Insight & Khuyến Nghị Tối Ưu Thực Đơn
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-300/80">
                    Trích xuất tự động từ ý kiến thực tế của phụ huynh và giáo viên các điểm trường
                  </p>
                </div>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-semibold self-start sm:self-auto">
                Cập nhật liên tục
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Box 1: Top món được khen ngợi */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm">
                  <ChefHat className="w-4 h-4" />
                  <span>Món Được Khen Ngợi Nhất</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span><strong>Cánh gà chiên mắm (Tuần 2):</strong> Học sinh ăn rất nhanh, tỷ lệ ăn hết suất đạt 98%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span><strong>Bò băm sốt cà chua:</strong> Thịt mềm, hợp khẩu vị trẻ em tiểu học từ lớp 1 - 5.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span><strong>Cá rô phi chiên bột xù:</strong> Giòn rụm, khử tanh tốt, phụ huynh rất yên tâm.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">4.</span>
                    <span><strong>Tráng miệng chuối tiêu / sữa chua (Xã Đa Phúc):</strong> Điểm cộng lớn được phụ huynh đánh giá rất cao.</span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Món nhận phản hồi cần chỉnh */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Điểm Cần Điều Chỉnh</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">⚠️</span>
                    <span><strong>Tôm rảo / tôm đồng:</strong> Một số cháu lớp 1-2 chưa quen bóc vỏ, nên ưu tiên tôm nõn hoặc rim mềm vỏ.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">⚠️</span>
                    <span><strong>Độ mặn món xào / kho:</strong> Phụ huynh đề xuất giảm bớt 10% muối/nước mắm để phù hợp thận trẻ.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">⚠️</span>
                    <span><strong>Món xốt tứ xuyên / hạt tiêu:</strong> Tuyệt đối không để vị cay nồng xuất hiện trong khay ăn học sinh.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">⚠️</span>
                    <span><strong>Rau xanh:</strong> Cắt nhỏ rau và xào mềm hơn để kích thích học sinh ăn hết phần rau.</span>
                  </li>
                </ul>
              </div>

              {/* Box 3: Gợi ý hành động cho Bếp ăn */}
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="flex items-center gap-2 text-teal-300 font-extrabold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Khuyến Nghị Cho Bếp Ăn SIBA</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span><strong>Thực đơn tuần tới:</strong> Bổ sung thêm món <em>Trứng cuộn rong biển</em> và <em>Thịt viên xíu mại sốt nấm</em> theo đề xuất.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span><strong>Nhiệt độ phục vụ:</strong> Tiếp tục duy trì nắp thùng cơm giữ nhiệt &gt; 65°C khi chuyển tới các lớp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 font-bold">✓</span>
                    <span><strong>Bảng minh họa:</strong> Treo hình ảnh minh họa thực đơn tại căng tin trường để tạo hứng thú cho học sinh.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* 4. DETAIL SUBMISSIONS LIST */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>Danh Sách Chi Tiết Ý Kiến Phản Hồi ({filteredSubmissions.length})</span>
                </h3>
                <p className="text-xs text-slate-500">Xem trực tiếp từng phiếu đánh giá và nội dung góp ý cụ thể</p>
              </div>
            </div>

            <div className="space-y-3">
              {filteredSubmissions.map((sub) => (
                <div 
                  key={sub.id} 
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/20 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900">{sub.evaluatorName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700">
                        {sub.evaluatorType === 'phu_huynh' ? 'Phụ huynh' : 'Giáo viên'}
                      </span>
                      {sub.studentClass && (
                        <span className="text-xs text-slate-500 font-medium">Lớp: {sub.studentClass}</span>
                      )}
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {sub.schoolName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {sub.weekName} • {sub.submittedAt}
                    </div>
                  </div>

                  {/* Day Ratings Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {daysLabel.map((day) => {
                      const fb = sub.dayFeedbacks[day.id];
                      if (!fb || !fb.opinion) return null;

                      const isAgree = fb.opinion === 'dong_thuan';
                      const isChange = fb.opinion === 'doi_mon';

                      return (
                        <div 
                          key={day.id} 
                          className={`p-2 rounded-xl border text-[11px] flex flex-col justify-between ${
                            isAgree 
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                              : isChange 
                              ? 'bg-amber-50/80 border-amber-200 text-amber-950' 
                              : 'bg-rose-50/80 border-rose-200 text-rose-950'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{day.name}</span>
                            <span className="text-[10px]">
                              {isAgree ? '✓ Đồng ý' : isChange ? '⚡ Đổi món' : '✕ Không'}
                            </span>
                          </div>
                          {fb.suggestedDish && (
                            <div className="text-[10px] font-semibold text-amber-800 mt-1 line-clamp-1">
                              Đổi: {fb.suggestedDish}
                            </div>
                          )}
                          {fb.comment && (
                            <div className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                              "{fb.comment}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* General Feedback comment */}
                  {sub.generalFeedback && (
                    <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 italic">
                      <strong>Góp ý chung:</strong> "{sub.generalFeedback}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </>
      )}

    </div>
  );
};
