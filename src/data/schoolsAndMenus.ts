import { School, DayMenuItem, MenuGroup } from '../types';

export const COMPANY_INFO = {
  name: 'CÔNG TY CỔ PHẦN CƠM NGON SIBA',
  shortName: 'SIBA FOOD CATERING',
  brandName: 'Cơm Ngon SIBA',
  headquarters: 'Tầng 2, Tòa nhà Oxygen, 628C Võ Nguyên Giáp, Phường An Khánh, Thành Phố Hồ Chí Minh',
  hotline: '1900 888 238',
  email: 'cskh@sibafood.vn',
  website: 'www.sibafood.vn',
};

// Danh sách các điểm trường theo yêu cầu người dùng:
// 1. Menu của điểm trường An Thượng và An Khánh
// 2. Menu của các phân hiệu trường Đa Phúc (ngoài trường An Thượng)
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
  // Nhóm 2: Các phân hiệu trường Đa Phúc
  {
    id: 'da_phuc_th',
    code: '2026856529',
    name: 'Trường Tiểu học Đa Phúc',
    address: 'Thôn Xuân Giang, Xã Đa Phúc, Huyện Sóc Sơn, TP Hà Nội',
    menuGroup: 'da_phuc',
    groupLabel: 'Phân hiệu trường Đa Phúc',
    schoolYear: '2026–2027',
  },
  {
    id: 'da_phuc_chu_van_an',
    code: '2026856601',
    name: 'Trường TH và THCS Chu Văn An (Phân hiệu Đa Phúc)',
    address: 'Thôn Ngô Đạo, Xã Đa Phúc, Huyện Sóc Sơn, TP Hà Nội',
    menuGroup: 'da_phuc',
    groupLabel: 'Phân hiệu trường Đa Phúc',
    schoolYear: '2026–2027',
  },
  {
    id: 'da_phuc_le_quy_don',
    code: '2026856796',
    name: 'Trường Tiểu học và THCS Lê Quý Đôn (Phân hiệu Đa Phúc)',
    address: 'Thôn Bắc Phú, Xã Đa Phúc, Huyện Sóc Sơn, TP Hà Nội',
    menuGroup: 'da_phuc',
    groupLabel: 'Phân hiệu trường Đa Phúc',
    schoolYear: '2026–2027',
  },
];

// MENU THÁNG 9 - Xã An Khánh (Áp dụng cho điểm trường An Thượng và An Khánh)
// Tuần 2: Từ 14/09 đến 18/09
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
    ricePortion: 'Cơm trắng 220g',
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
    ricePortion: 'Cơm trắng 220g',
    dessert: 'Sữa tươi Ba Vì',
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
    ricePortion: 'Cơm trắng 220g',
    dessert: 'Bánh mì nhân bơ sữa',
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

export function getGroupName(group: MenuGroup): string {
  if (group === 'da_phuc') {
    return 'Thực đơn Xã Đa Phúc (Định lượng cơm 240g, Món phụ Thứ 5: Thịt băm rim chua ngọt)';
  }
  return 'Thực đơn Xã An Khánh & An Thượng (Định lượng cơm 220g, Món phụ Thứ 5: Khoai tây xào thịt băm)';
}
