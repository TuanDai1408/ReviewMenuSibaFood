export type MenuGroup = 'an_khanh' | 'da_phuc';

export type WeekId = 'tuan_1' | 'tuan_2' | 'tuan_3';

export interface WeekDefinition {
  id: WeekId;
  name: string;
  dateRange: string;
  startDateStr: string;
  endDateStr: string;
  isUniversal: boolean;
  note?: string;
}

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
  weekId: string;
  weekName: string;
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

export type UserRole = 'admin' | 'viewer';
export type AccessStatus = 'approved' | 'pending' | 'rejected';

export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: AccessStatus;
  requestedAt?: string;
  approvedAt?: string;
}

export interface AccessRequest {
  id: string;
  email: string;
  name: string;
  role: string;
  requestedAt: string;
  status: AccessStatus;
  approvedAt?: string;
  note?: string;
}
