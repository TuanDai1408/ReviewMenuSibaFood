import { School, DayMenuItem, MenuGroup, WeekDefinition, WeekId } from '../types';

export const COMPANY_INFO = {
  name: 'CÔNG TY CỔ PHẦN CƠM NGON SIBA',
  shortName: 'SIBA FOOD CATERING',
  brandName: 'Cơm Ngon SIBA',
  headquarters: 'Tầng 2, Tòa nhà Oxygen, 628C Võ Nguyên Giáp, Phường An Khánh, Thành Phố Hồ Chí Minh',
  hotline: '1800 6263',
  email: 'cskh@sibafood.vn',
  website: 'www.sibafood.vn',
};

// Danh sách các điểm trường theo yêu cầu người dùng:
// 1. Menu của điểm trường An Thượng và An Khánh
// 2. Menu của các trường Đa Phúc
export const SCHOOLS_LIST: School[] = [
  // Nhóm 1: Điểm trường An Thượng & An Khánh
  {
    id: 'an_thuong',
    code: '2026855812',
    name: 'Trường Tiểu học An Thượng',
    address: 'Ngõ 1057, đường 72, Thôn Ngãi Cầu, Xã An Thượng, Huyện Hoài Đức, Hà Nội',
    menuGroup: 'an_khanh',
    groupLabel: 'Khu vực An Thượng & An Khánh',
    schoolYear: '2026–2027',
  },
  {
    id: 'an_khanh',
    code: '2026855815',
    name: 'Trường Tiểu học An Khánh',
    address: 'Thôn Ngự Câu, Xã An Khánh, Huyện Hoài Đức, Hà Nội',
    menuGroup: 'an_khanh',
    groupLabel: 'Khu vực An Thượng & An Khánh',
    schoolYear: '2026–2027',
  },
  // Nhóm 2: Các trường Xã Đa Phúc
  {
    id: 'da_phuc_th',
    code: '2026856529',
    name: 'Trường Tiểu học Đa Phúc',
    address: 'Thôn Xuân Giang, Xã Đa Phúc, Huyện Sóc Sơn, TP Hà Nội',
    menuGroup: 'da_phuc',
    groupLabel: 'Khu vực Đa Phúc',
    schoolYear: '2026–2027',
  },
  {
    id: 'da_phuc_chu_van_an',
    code: '2026856601',
    name: 'Trường TH và THCS Chu Văn An',
    address: 'Thôn Ngô Đạo, Xã Đa Phúc, Huyện Sóc Sơn, TP Hà Nội',
    menuGroup: 'da_phuc',
    groupLabel: 'Khu vực Đa Phúc',
    schoolYear: '2026–2027',
  },
  {
    id: 'da_phuc_le_quy_don',
    code: '2026856796',
    name: 'Trường Tiểu học và THCS Lê Quý Đôn',
    address: 'Thôn Bắc Phú, Xã Đa Phúc, Huyện Sóc Sơn, TP Hà Nội',
    menuGroup: 'da_phuc',
    groupLabel: 'Khu vực Đa Phúc',
    schoolYear: '2026–2027',
  },
];

// MENU THÁNG 9 - Xã An Khánh (Áp dụng cho điểm trường An Thượng và An Khánh - Không có tráng miệng)
// Áp dụng cho thời gian sắp tới
export const MENU_AN_KHANH: DayMenuItem[] = [
  {
    dayId: 'thu_2',
    dayName: 'Thứ 2',
    dateStr: '14/09/2026',
    mainDish: 'Thịt rim chả mỡ',
    mainDishPortion: '40g thịt + 40g chả mỡ',
    sideDish: 'Mọc kho rau củ',
    sideDishPortion: '40g mọc + 20g rau củ',
    vegDish: 'Cải chíp xào',
    vegDishPortion: '70g',
    soupDish: 'Canh bí đỏ',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_3',
    dayName: 'Thứ 3',
    dateStr: '15/09/2026',
    mainDish: 'Chả cá kho thơm',
    mainDishPortion: '80g',
    sideDish: 'Thịt băm xào giá đỗ',
    sideDishPortion: '50g',
    vegDish: 'Cải thảo luộc',
    vegDishPortion: '70g',
    soupDish: 'Canh bầu',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_4',
    dayName: 'Thứ 4',
    dateStr: '16/09/2026',
    mainDish: 'Thịt xào đậu que',
    mainDishPortion: '45g thịt + 35g đậu que',
    sideDish: 'Chả trứng',
    sideDishPortion: '60g',
    vegDish: 'Su su xào cà rốt',
    vegDishPortion: '70g',
    soupDish: 'Canh mồng tơi',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_5',
    dayName: 'Thứ 5',
    dateStr: '17/09/2026',
    mainDish: 'Gà tẩm bột chiên',
    mainDishPortion: '80g gà',
    sideDish: 'Khoai tây xào thịt băm',
    sideDishPortion: '50g',
    vegDish: 'Cải ngọt luộc',
    vegDishPortion: '70g',
    soupDish: 'Canh bí xanh',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_6',
    dayName: 'Thứ 6',
    dateStr: '18/09/2026',
    mainDish: 'Thịt xào chua ngọt',
    mainDishPortion: '45g thịt + 35g rau củ',
    sideDish: 'Đậu hũ chiên xốt cà',
    sideDishPortion: '60g',
    vegDish: 'Bắp cải xào',
    vegDishPortion: '70g',
    soupDish: 'Canh cải ngọt',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
];

// MENU THÁNG 9 - Xã Đa Phúc (Áp dụng cho các phân hiệu trường Đa Phúc)
// Tuần 2: Từ 14/09 đến 18/09
export const MENU_DA_PHUC: DayMenuItem[] = [
  {
    dayId: 'thu_2',
    dayName: 'Thứ 2',
    dateStr: '14/09/2026',
    mainDish: 'Thịt rim chả mỡ',
    mainDishPortion: '40g thịt + 40g chả mỡ',
    sideDish: 'Mọc kho rau củ',
    sideDishPortion: '40g mọc + 20g rau củ',
    vegDish: 'Cải chíp xào',
    vegDishPortion: '70g',
    soupDish: 'Canh bí đỏ',
    ricePortion: 'Cơm trắng 240g',
    dessert: 'Sữa trái cây',
  },
  {
    dayId: 'thu_3',
    dayName: 'Thứ 3',
    dateStr: '15/09/2026',
    mainDish: 'Chả cá kho thơm',
    mainDishPortion: '80g',
    sideDish: 'Thịt băm xào giá đỗ',
    sideDishPortion: '50g',
    vegDish: 'Cải thảo luộc',
    vegDishPortion: '70g',
    soupDish: 'Canh bầu',
    ricePortion: 'Cơm trắng 240g',
    dessert: 'Bánh sandwich chà bông',
  },
  {
    dayId: 'thu_4',
    dayName: 'Thứ 4',
    dateStr: '16/09/2026',
    mainDish: 'Thịt xào đậu que',
    mainDishPortion: '45g thịt + 35g đậu que',
    sideDish: 'Chả trứng',
    sideDishPortion: '60g',
    vegDish: 'Su su xào cà rốt',
    vegDishPortion: '70g',
    soupDish: 'Canh mồng tơi',
    ricePortion: 'Cơm trắng 240g',
    dessert: 'Sữa tươi Ba Vì',
  },
  {
    dayId: 'thu_5',
    dayName: 'Thứ 5',
    dateStr: '17/09/2026',
    mainDish: 'Gà tẩm bột chiên',
    mainDishPortion: '80g gà',
    sideDish: 'Thịt băm rim chua ngọt',
    sideDishPortion: '60g',
    vegDish: 'Cải ngọt luộc',
    vegDishPortion: '70g',
    soupDish: 'Canh bí xanh',
    ricePortion: 'Cơm trắng 240g',
    dessert: 'Sữa Kun lúa mạch',
  },
  {
    dayId: 'thu_6',
    dayName: 'Thứ 6',
    dateStr: '18/09/2026',
    mainDish: 'Thịt xào chua ngọt',
    mainDishPortion: '45g thịt + 35g rau củ',
    sideDish: 'Đậu hũ chiên xốt cà',
    sideDishPortion: '60g',
    vegDish: 'Bắp cải xào',
    vegDishPortion: '70g',
    soupDish: 'Canh cải ngọt',
    ricePortion: 'Cơm trắng 240g',
    dessert: 'Bánh mì nhân bơ sữa',
  },
];

export function getMenuByGroup(group: MenuGroup): DayMenuItem[] {
  if (group === 'da_phuc') {
    return MENU_DA_PHUC;
  }
  return MENU_AN_KHANH;
}

// ==========================================
// DANH SÁCH CÁC TUẦN KHẢO SÁT THỰC ĐƠN
// ==========================================
export const WEEKS_LIST: WeekDefinition[] = [
  {
    id: 'tuan_1',
    name: 'Tuần 1',
    dateRange: '14/09 – 18/09/2026',
    startDateStr: '14/09/2026',
    endDateStr: '18/09/2026',
    isUniversal: false,
    note: 'Thực đơn phân theo nhóm trường (Khu vực An Thượng & An Khánh / Khu vực Đa Phúc)',
  },
  {
    id: 'tuan_2',
    name: 'Tuần 2',
    dateRange: '21/09 – 25/09/2026',
    startDateStr: '21/09/2026',
    endDateStr: '25/09/2026',
    isUniversal: true,
    note: 'Áp dụng chung đồng nhất cho tất cả các điểm trường',
  },
  {
    id: 'tuan_3',
    name: 'Tuần 3',
    dateRange: '28/09 – 02/10/2026',
    startDateStr: '28/09/2026',
    endDateStr: '02/10/2026',
    isUniversal: true,
    note: 'Áp dụng chung đồng nhất cho tất cả các điểm trường',
  },
];

// ==========================================
// THỰC ĐƠN TUẦN 2 (21–25/09/2026)
// Áp dụng chung cho tất cả các điểm trường
// ==========================================
export const MENU_TUAN_2: DayMenuItem[] = [
  {
    dayId: 'thu_2',
    dayName: 'Thứ 2',
    dateStr: '21/09/2026',
    mainDish: 'Thịt kho tàu',
    mainDishPortion: '80g',
    sideDish: 'Xúc xích xào rau củ',
    sideDishPortion: '30g+30g',
    vegDish: 'Bắp cải cà rốt xào',
    vegDishPortion: '70g',
    soupDish: 'Canh mướp tôm bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_3',
    dayName: 'Thứ 3',
    dateStr: '22/09/2026',
    mainDish: 'Cánh gà chiên mắm',
    mainDishPortion: '110g',
    sideDish: 'Mọc viên sốt cà chua',
    sideDishPortion: '60g',
    vegDish: 'Cải thảo luộc',
    vegDishPortion: '70g',
    soupDish: 'Canh bí xanh thịt bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_4',
    dayName: 'Thứ 4',
    dateStr: '23/09/2026',
    mainDish: 'Tôm rảo rim thịt',
    mainDishPortion: '35g+35g',
    sideDish: 'Đậu hũ tẩm hành chiên giòn',
    sideDishPortion: '60g',
    vegDish: 'Rau muống xào',
    vegDishPortion: '70g',
    soupDish: 'Canh bắp cải tôm bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_5',
    dayName: 'Thứ 5',
    dateStr: '24/09/2026',
    mainDish: 'Gà phi lê xào rau củ',
    mainDishPortion: '45g+35g',
    sideDish: 'Thịt bằm rim mặn',
    sideDishPortion: '60g',
    vegDish: 'Bầu luộc',
    vegDishPortion: '70g',
    soupDish: 'Canh bí đỏ thịt băm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_6',
    dayName: 'Thứ 6',
    dateStr: '25/09/2026',
    mainDish: 'Bò băm sốt cà chua',
    mainDishPortion: '60g',
    sideDish: 'Trứng đúc thịt bằm',
    sideDishPortion: '60g',
    vegDish: 'Su su cà rốt xào',
    vegDishPortion: '70g',
    soupDish: 'Canh cải ngọt thịt bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
];

// ==========================================
// THỰC ĐƠN TUẦN 3 (28/09–02/10/2026)
// Áp dụng chung cho tất cả các điểm trường
// ==========================================
export const MENU_TUAN_3: DayMenuItem[] = [
  {
    dayId: 'thu_2',
    dayName: 'Thứ 2',
    dateStr: '28/09/2026',
    mainDish: 'Má gà roti',
    mainDishPortion: '80g',
    sideDish: 'Trứng luộc chiên sốt cà',
    sideDishPortion: '60g',
    vegDish: 'Rau muống xào',
    vegDishPortion: '70g',
    soupDish: 'Canh bí đao thịt bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_3',
    dayName: 'Thứ 3',
    dateStr: '29/09/2026',
    mainDish: 'Thịt tẩm bột chiên',
    mainDishPortion: '70g',
    sideDish: 'Bò xay xào khoai tây',
    sideDishPortion: '25g+45g',
    vegDish: 'Bầu luộc',
    vegDishPortion: '70g',
    soupDish: 'Canh mồng tơi tôm bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_4',
    dayName: 'Thứ 4',
    dateStr: '30/09/2026',
    mainDish: 'Tôm rim mặn ngọt',
    mainDishPortion: '55g',
    sideDish: 'Thịt băm xào củ quả',
    sideDishPortion: '40g+30g',
    vegDish: 'Su su cà rốt xào tỏi',
    vegDishPortion: '70g',
    soupDish: 'Canh rau ngót thịt bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_5',
    dayName: 'Thứ 5',
    dateStr: '01/10/2026',
    mainDish: 'Thịt heo kho rau củ',
    mainDishPortion: '45g+35g',
    sideDish: 'Đậu hũ xốt tứ xuyên',
    sideDishPortion: '60g',
    vegDish: 'Bắp cải cà rốt xào',
    vegDishPortion: '70g',
    soupDish: 'Canh bí đỏ thịt băm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
  {
    dayId: 'thu_6',
    dayName: 'Thứ 6',
    dateStr: '02/10/2026',
    mainDish: 'Cá rô phi chiên bột xù',
    mainDishPortion: '80g',
    sideDish: 'Trứng hấp thịt',
    sideDishPortion: '60g',
    vegDish: 'Đậu cove cà rốt xào',
    vegDishPortion: '70g',
    soupDish: 'Canh bắp cải tôm bằm (40g+5g)',
    ricePortion: 'Cơm trắng 220g',
    dessert: '',
  },
];

export function getWeekById(weekId: string): WeekDefinition {
  return WEEKS_LIST.find((w) => w.id === weekId) || WEEKS_LIST[0];
}

export function getMenuByWeekAndGroup(weekId: WeekId, group: MenuGroup): DayMenuItem[] {
  if (weekId === 'tuan_2') {
    return MENU_TUAN_2;
  }
  if (weekId === 'tuan_3') {
    return MENU_TUAN_3;
  }
  // tuan_1
  return getMenuByGroup(group);
}

export function getGroupName(group: MenuGroup): string {
  if (group === 'da_phuc') {
    return 'Thực đơn Xã Đa Phúc (Định lượng cơm 240g, Món phụ Thứ 5: Thịt băm rim chua ngọt, Có tráng miệng)';
  }
  return 'Thực đơn Xã An Khánh & An Thượng (Định lượng cơm 220g, Món phụ Thứ 5: Khoai tây xào thịt băm, Không có tráng miệng)';
}

export function getMenuDescription(weekId: WeekId, group: MenuGroup): string {
  if (weekId === 'tuan_2') {
    return 'Thực đơn Tuần 2 (21–25/09/2026) • Áp dụng chung đồng nhất cho tất cả các điểm trường (Cơm trắng 220g)';
  }
  if (weekId === 'tuan_3') {
    return 'Thực đơn Tuần 3 (28/09–02/10/2026) • Áp dụng chung đồng nhất cho tất cả các điểm trường (Cơm trắng 220g)';
  }
  return getGroupName(group);
}
