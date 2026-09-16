import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Send, 
  Sparkles, 
  CheckCheck, 
  TableProperties, 
  FileText, 
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { HeaderBanner } from './components/HeaderBanner';
import { GeneralInfoStep } from './components/GeneralInfoStep';
import { WeeklyMenuTable } from './components/WeeklyMenuTable';
import { DayFeedbackCard } from './components/DayFeedbackCard';
import { SuccessView } from './components/SuccessView';
import { 
  SCHOOLS_LIST, 
  COMPANY_INFO, 
  getMenuByGroup, 
  getGroupName 
} from './data/schoolsAndMenus';
import { DayFeedback, OpinionType, SurveySubmission } from './types';

export default function App() {
  // Form State
  const [evaluatorType, setEvaluatorType] = useState<'phu_huynh' | 'giao_vien' | 'khac'>('phu_huynh');
  const [fullName, setFullName] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('an_thuong'); // Default to An Thuong to showcase menu immediately
  const [studentClass, setStudentClass] = useState('');
  const [phone, setPhone] = useState('');

  // Feedbacks for each day (thu_2, thu_3, thu_4, thu_5, thu_6)
  const [dayFeedbacks, setDayFeedbacks] = useState<Record<string, DayFeedback>>({
    thu_2: { dayId: 'thu_2', opinion: 'dong_thuan', suggestedDish: '', comment: '' },
    thu_3: { dayId: 'thu_3', opinion: 'dong_thuan', suggestedDish: '', comment: '' },
    thu_4: { dayId: 'thu_4', opinion: 'dong_thuan', suggestedDish: '', comment: '' },
    thu_5: { dayId: 'thu_5', opinion: 'dong_thuan', suggestedDish: '', comment: '' },
    thu_6: { dayId: 'thu_6', opinion: 'dong_thuan', suggestedDish: '', comment: '' },
  });

  const [generalFeedback, setGeneralFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<SurveySubmission | null>(null);
  const [validationError, setValidationError] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);

  // Selected School & Dynamic Menu
  const selectedSchool = useMemo(() => {
    return SCHOOLS_LIST.find((s) => s.id === selectedSchoolId) || SCHOOLS_LIST[0];
  }, [selectedSchoolId]);

  // Current menu according to school selection
  const currentMenu = useMemo(() => {
    return getMenuByGroup(selectedSchool.menuGroup);
  }, [selectedSchool]);

  // Change opinion for a day
  const handleOpinionChange = (dayId: string, opinion: OpinionType) => {
    setDayFeedbacks((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        dayId,
        opinion,
      },
    }));
    setValidationError('');
  };

  // Change suggested dish
  const handleSuggestedDishChange = (dayId: string, dish: string) => {
    setDayFeedbacks((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        suggestedDish: dish,
      },
    }));
    setValidationError('');
  };

  // Change day comment
  const handleCommentChange = (dayId: string, comment: string) => {
    setDayFeedbacks((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        comment,
      },
    }));
  };

  // Quick action: Agree with all days
  const handleAgreeAll = () => {
    setDayFeedbacks((prev) => {
      const updated: Record<string, DayFeedback> = {};
      currentMenu.forEach((day) => {
        updated[day.dayId] = {
          dayId: day.dayId,
          opinion: 'dong_thuan',
          suggestedDish: '',
          comment: prev[day.dayId]?.comment || '',
        };
      });
      return updated;
    });
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchoolId) {
      setValidationError('Vui lòng chọn Điểm trường học áp dụng thực đơn.');
      return;
    }

    if (!fullName.trim()) {
      setValidationError('Vui lòng nhập Họ và tên của bạn.');
      return;
    }

    // Check if any day is missing opinion
    for (const day of currentMenu) {
      const fb = dayFeedbacks[day.dayId];
      if (!fb || !fb.opinion) {
        setValidationError(`Vui lòng chọn ý kiến đánh giá cho ngày ${day.dayName}.`);
        return;
      }
      if (fb.opinion === 'doi_mon' && (!fb.suggestedDish || !fb.suggestedDish.trim())) {
        setValidationError(`Quý vị đã chọn "Đổi món" cho ${day.dayName}, vui lòng nhập tên món muốn đổi sang.`);
        return;
      }
    }

    setValidationError('');

    const newSubmission: SurveySubmission = {
      id: `SIBA-${Date.now()}`,
      submittedAt: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      evaluatorType,
      evaluatorName: fullName.trim(),
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.name,
      schoolCode: selectedSchool.code,
      studentClass: studentClass.trim() || undefined,
      phone: phone.trim() || undefined,
      dayFeedbacks,
      generalFeedback: generalFeedback.trim(),
    };

    setSubmissionData(newSubmission);
    setIsSubmitted(true);

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmissionData(null);
    setFullName('');
    setStudentClass('');
    setPhone('');
    setGeneralFeedback('');
    handleAgreeAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-700 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* Header & Corporate Banner */}
        <HeaderBanner />

        {isSubmitted && submissionData ? (
          <SuccessView submission={submissionData} onReset={handleReset} />
        ) : (
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-200/80">
            
            {/* Context Notice on Menu Switching */}
            <div className="bg-emerald-50/80 border-b border-emerald-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-extrabold text-emerald-800">
                    Thực Đơn Tự Động Đồng Bộ Theo Điểm Trường
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    {selectedSchool ? `${selectedSchool.name}` : 'Chưa chọn trường'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedSchool && getGroupName(selectedSchool.menuGroup)}
                  </div>
                </div>
              </div>

              {/* Action: View full week spreadsheet table */}
              <button
                type="button"
                onClick={() => setShowTableModal(!showTableModal)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold hover:bg-emerald-50 transition-all shadow-xs cursor-pointer"
              >
                <TableProperties className="w-4 h-4 text-emerald-600" />
                <span>{showTableModal ? 'Ẩn bảng tổng hợp' : 'Xem bảng thực đơn tuần'}</span>
              </button>
            </div>

            {/* Expandable Weekly Menu Table */}
            {showTableModal && (
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 animate-in fade-in duration-300">
                <WeeklyMenuTable 
                  menuItems={currentMenu} 
                  selectedSchool={selectedSchool}
                />
              </div>
            )}

            {/* The Main Survey Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-10">
              
              {/* Part 1: General Info & School Selection */}
              <GeneralInfoStep
                evaluatorType={evaluatorType}
                setEvaluatorType={setEvaluatorType}
                fullName={fullName}
                setFullName={setFullName}
                selectedSchoolId={selectedSchoolId}
                onSelectSchool={(id) => setSelectedSchoolId(id)}
                studentClass={studentClass}
                setStudentClass={setStudentClass}
                phone={phone}
                setPhone={setPhone}
                selectedSchool={selectedSchool}
              />

              {/* Part 2: Detailed Meal Feedback */}
              <section id="section-detailed-feedback" className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-200">
                      2
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Đánh giá chi tiết thực đơn tuần
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Tuần 2 (Từ 14/09 đến 18/09) - Buổi trưa chính
                      </p>
                    </div>
                  </div>

                  {/* Fast action button: Agree with all */}
                  <button
                    type="button"
                    onClick={handleAgreeAll}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 text-xs sm:text-sm font-bold transition-all border border-emerald-300 self-start sm:self-center cursor-pointer"
                    title="Chọn Đồng thuận cho tất cả 5 ngày"
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-700" />
                    <span>Đồng thuận cả tuần (1 chạm)</span>
                  </button>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Vui lòng tích chọn ý kiến của Quý vị đối với từng bữa ăn bên dưới. 
                    Nếu chọn <strong>"Đổi món"</strong>, Quý vị có thể điền tên món ăn mong muốn để chúng tôi tổng hợp và điều chỉnh thực đơn phù hợp nhất.
                  </span>
                </div>

                {/* Day Feedback Cards */}
                <div className="space-y-6">
                  {currentMenu.map((dayMenu, index) => (
                    <DayFeedbackCard
                      key={dayMenu.dayId}
                      dayMenu={dayMenu}
                      feedback={dayFeedbacks[dayMenu.dayId] || { dayId: dayMenu.dayId, opinion: '' }}
                      onChangeOpinion={handleOpinionChange}
                      onChangeSuggestedDish={handleSuggestedDishChange}
                      onChangeComment={handleCommentChange}
                      index={index}
                    />
                  ))}
                </div>
              </section>

              {/* Part 3: General Suggestions */}
              <section id="section-general-comments" className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-200">
                    3
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Ý kiến đóng góp chung</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Góp ý về khẩu vị, định lượng, vệ sinh an toàn thực phẩm hoặc tác phong phục vụ
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Quý vị có góp ý gì thêm về chất lượng phục vụ, định lượng suất ăn hay an toàn thực phẩm không?
                  </label>
                  <textarea
                    id="textarea-general-feedback"
                    rows={4}
                    value={generalFeedback}
                    onChange={(e) => setGeneralFeedback(e.target.value)}
                    placeholder="Chia sẻ thêm ý kiến hoặc tâm tư của Quý vị để SIBA nâng niu từng bữa ăn của học sinh..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm text-slate-800 resize-none"
                  />
                </div>
              </section>

              {/* Validation Warning if any */}
              {validationError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit Section */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dữ liệu khảo sát được bảo mật tuyệt đối bởi {COMPANY_INFO.name}.</span>
                </div>

                <button
                  id="button-submit-survey"
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Gửi Phiếu Đánh Giá</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer with exact Company Name and Registered Office */}
        <footer className="text-center text-xs text-slate-500 space-y-2 py-4 border-t border-slate-200/60">
          <p className="font-extrabold text-slate-700 text-sm tracking-wide">
            {COMPANY_INFO.name}
          </p>
          <p className="flex items-center justify-center gap-1 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Trụ sở: {COMPANY_INFO.headquarters}</span>
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-500 pt-1">
            <span>Hotline hỗ trợ: {COMPANY_INFO.hotline}</span>
            <span>•</span>
            <span>Email: {COMPANY_INFO.email}</span>
            <span>•</span>
            <span>Bản quyền © 2026 SIBA Bán Trú Học Đường</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
