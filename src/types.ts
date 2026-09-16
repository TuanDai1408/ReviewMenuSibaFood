export type MenuGroup = 'an_khanh' | 'da_phuc';

export interface School {
  id: string;
  code: string;
  name: string;
  address: string;
  menuGroup: MenuGroup;
  groupLabel: string;
  schoolYear: string;
}

export interface DayMenuItem {
  dayId: string;
  dayName: string;
  dateStr: string;
  mainDish: string;
  mainDishPortion: string;
  sideDish: string;
  sideDishPortion: string;
  vegDish: string;
  vegDishPortion: string;
  soupDish: string;
  ricePortion: string;
  dessert: string;
}

export type OpinionType = 'dong_thuan' | 'khong_dong_thuan' | 'doi_mon';

export interface DayFeedback {
  dayId: string;
  opinion: OpinionType | '';
  suggestedDish?: string;
  comment?: string;
}

export interface SurveySubmission {
  id: string;
  submittedAt: string;
  evaluatorType: 'phu_huynh' | 'giao_vien' | 'khac';
  evaluatorName: string;
  schoolId: string;
  schoolName: string;
  schoolCode: string;
  studentClass?: string;
  phone?: string;
  dayFeedbacks: Record<string, DayFeedback>;
  generalFeedback: string;
}
