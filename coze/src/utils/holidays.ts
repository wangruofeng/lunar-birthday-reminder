import { Lunar, Solar } from 'lunar-javascript';

/**
 * 节假日日期定义
 */
interface HolidayDate {
  month: number;
  day: number;
  label: string;
}

/**
 * 节假日组定义
 */
interface HolidayGroup {
  name: string;
  dates: HolidayDate[];
}

/**
 * 2024年节假日数据（根据国务院办公厅官方通知）
 * 信息来源：国务院办公厅关于2024年部分节假日安排的通知
 */
const HOLIDAY_DATA_2024: HolidayGroup[] = [
  {
    name: '元旦',
    dates: [
      { month: 1, day: 1, label: '元旦' }
    ]
  },
  {
    name: '春节',
    dates: [
      { month: 2, day: 10, label: '春节' },
      { month: 2, day: 11, label: '春节假期' },
      { month: 2, day: 12, label: '春节假期' },
      { month: 2, day: 13, label: '春节假期' },
      { month: 2, day: 14, label: '春节假期' },
      { month: 2, day: 15, label: '春节假期' },
      { month: 2, day: 16, label: '春节假期' },
      { month: 2, day: 17, label: '春节假期' }
    ]
  },
  {
    name: '清明节',
    dates: [
      { month: 4, day: 4, label: '清明节' },
      { month: 4, day: 5, label: '清明节假期' },
      { month: 4, day: 6, label: '清明节假期' }
    ]
  },
  {
    name: '劳动节',
    dates: [
      { month: 5, day: 1, label: '劳动节' },
      { month: 5, day: 2, label: '劳动节假期' },
      { month: 5, day: 3, label: '劳动节假期' },
      { month: 5, day: 4, label: '劳动节假期' },
      { month: 5, day: 5, label: '劳动节假期' }
    ]
  },
  {
    name: '端午节',
    dates: [
      { month: 6, day: 10, label: '端午节' }
    ]
  },
  {
    name: '中秋节',
    dates: [
      { month: 9, day: 15, label: '中秋节' },
      { month: 9, day: 16, label: '中秋节假期' },
      { month: 9, day: 17, label: '中秋节假期' }
    ]
  },
  {
    name: '国庆节',
    dates: [
      { month: 10, day: 1, label: '国庆节' },
      { month: 10, day: 2, label: '国庆节假期' },
      { month: 10, day: 3, label: '国庆节假期' },
      { month: 10, day: 4, label: '国庆节假期' },
      { month: 10, day: 5, label: '国庆节假期' },
      { month: 10, day: 6, label: '国庆节假期' },
      { month: 10, day: 7, label: '国庆节假期' }
    ]
  }
];

/**
 * 2025年节假日数据（根据国务院办公厅官方通知）
 * 信息来源：国务院办公厅关于2025年部分节假日安排的通知
 */
const HOLIDAY_DATA_2025: HolidayGroup[] = [
  {
    name: '元旦',
    dates: [
      { month: 1, day: 1, label: '元旦' }
    ]
  },
  {
    name: '春节',
    dates: [
      { month: 1, day: 28, label: '除夕' },
      { month: 1, day: 29, label: '春节' },
      { month: 1, day: 30, label: '春节假期' },
      { month: 1, day: 31, label: '春节假期' },
      { month: 2, day: 1, label: '春节假期' },
      { month: 2, day: 2, label: '春节假期' },
      { month: 2, day: 3, label: '春节假期' },
      { month: 2, day: 4, label: '春节假期' }
    ]
  },
  {
    name: '清明节',
    dates: [
      { month: 4, day: 4, label: '清明节' },
      { month: 4, day: 5, label: '清明节假期' },
      { month: 4, day: 6, label: '清明节假期' }
    ]
  },
  {
    name: '劳动节',
    dates: [
      { month: 5, day: 1, label: '劳动节' },
      { month: 5, day: 2, label: '劳动节假期' },
      { month: 5, day: 3, label: '劳动节假期' },
      { month: 5, day: 4, label: '劳动节假期' },
      { month: 5, day: 5, label: '劳动节假期' }
    ]
  },
  {
    name: '端午节',
    dates: [
      { month: 5, day: 31, label: '端午节' },
      { month: 6, day: 1, label: '端午节假期' },
      { month: 6, day: 2, label: '端午节假期' }
    ]
  },
  {
    name: '中秋节',
    dates: [
      { month: 10, day: 6, label: '中秋节' }
    ]
  },
  {
    name: '国庆节',
    dates: [
      { month: 10, day: 1, label: '国庆节' },
      { month: 10, day: 2, label: '国庆节假期' },
      { month: 10, day: 3, label: '国庆节假期' },
      { month: 10, day: 4, label: '国庆节假期' },
      { month: 10, day: 5, label: '国庆节假期' },
      { month: 10, day: 6, label: '国庆节假期' },
      { month: 10, day: 7, label: '国庆节假期' },
      { month: 10, day: 8, label: '国庆节假期' }
    ]
  }
];

/**
 * 2026年节假日数据（根据国务院办公厅官方通知）
 * 信息来源：国务院办公厅关于2026年部分节假日安排的通知（国办发明电〔2025〕16号）
 */
const HOLIDAY_DATA_2026: HolidayGroup[] = [
  {
    name: '元旦',
    dates: [
      { month: 1, day: 1, label: '元旦' },
      { month: 1, day: 2, label: '元旦假期' },
      { month: 1, day: 3, label: '元旦假期' }
    ]
  },
  {
    name: '春节',
    dates: [
      { month: 2, day: 15, label: '除夕' },
      { month: 2, day: 16, label: '春节' },
      { month: 2, day: 17, label: '春节假期' },
      { month: 2, day: 18, label: '春节假期' },
      { month: 2, day: 19, label: '春节假期' },
      { month: 2, day: 20, label: '春节假期' },
      { month: 2, day: 21, label: '春节假期' },
      { month: 2, day: 22, label: '春节假期' },
      { month: 2, day: 23, label: '春节假期' }
    ]
  },
  {
    name: '清明节',
    dates: [
      { month: 4, day: 4, label: '清明节' },
      { month: 4, day: 5, label: '清明节假期' },
      { month: 4, day: 6, label: '清明节假期' }
    ]
  },
  {
    name: '劳动节',
    dates: [
      { month: 5, day: 1, label: '劳动节' },
      { month: 5, day: 2, label: '劳动节假期' },
      { month: 5, day: 3, label: '劳动节假期' },
      { month: 5, day: 4, label: '劳动节假期' },
      { month: 5, day: 5, label: '劳动节假期' }
    ]
  },
  {
    name: '端午节',
    dates: [
      { month: 6, day: 19, label: '端午节' },
      { month: 6, day: 20, label: '端午节假期' },
      { month: 6, day: 21, label: '端午节假期' }
    ]
  },
  {
    name: '中秋节',
    dates: [
      { month: 9, day: 25, label: '中秋节' },
      { month: 9, day: 26, label: '中秋节假期' },
      { month: 9, day: 27, label: '中秋节假期' }
    ]
  },
  {
    name: '国庆节',
    dates: [
      { month: 10, day: 1, label: '国庆节' },
      { month: 10, day: 2, label: '国庆节假期' },
      { month: 10, day: 3, label: '国庆节假期' },
      { month: 10, day: 4, label: '国庆节假期' },
      { month: 10, day: 5, label: '国庆节假期' },
      { month: 10, day: 6, label: '国庆节假期' },
      { month: 10, day: 7, label: '国庆节假期' }
    ]
  }
];

/**
 * 2027年节假日数据（预测）
 * 注意：2027年的具体安排需等待国务院办公厅通知
 */
const HOLIDAY_DATA_2027: HolidayGroup[] = [
  {
    name: '元旦',
    dates: [
      { month: 1, day: 1, label: '元旦' }
    ]
  },
  {
    name: '春节',
    dates: [
      { month: 2, day: 6, label: '除夕' },
      { month: 2, day: 7, label: '春节' },
      { month: 2, day: 8, label: '春节假期' },
      { month: 2, day: 9, label: '春节假期' },
      { month: 2, day: 10, label: '春节假期' },
      { month: 2, day: 11, label: '春节假期' },
      { month: 2, day: 12, label: '春节假期' }
    ]
  }
];

/**
 * 获取指定年份的节假日数据
 * @param year 年份
 * @returns 节假日数据
 */
function getHolidayData(year: number): HolidayGroup[] {
  // 支持的年份列表（有预定义数据的年份）
  if (year === 2024) {
    return HOLIDAY_DATA_2024;
  }
  if (year === 2025) {
    return HOLIDAY_DATA_2025;
  }
  if (year === 2026) {
    return HOLIDAY_DATA_2026;
  }
  if (year === 2027) {
    return HOLIDAY_DATA_2027;
  }
  // 其他年份使用通用计算
  return [];
}

/**
 * 从预定义数据中查找节假日
 * @param month 阳历月份（1-12）
 * @param day 阳历日期（1-31）
 * @param year 年份
 * @returns 节日名称，如果不是节假日则返回 null
 */
function findHolidayFromData(month: number, day: number, year: number): string | null {
  const holidayData = getHolidayData(year);
  for (const group of holidayData) {
    for (const date of group.dates) {
      if (date.month === month && date.day === day) {
        return date.label;
      }
    }
  }
  return null;
}

/**
 * 通用计算节假日（适用于没有预定义数据的年份）
 * @param solarMonth 阳历月份（1-12）
 * @param solarDay 阳历日期（1-31）
 * @param year 年份
 * @returns 节日名称，如果不是节假日则返回 null
 */
function calculateHolidayGeneric(solarMonth: number, solarDay: number, year: number): string | null {
  try {
    const solar = Solar.fromYmd(year, solarMonth, solarDay);
    const lunar = solar.getLunar();

    // 元旦（阳历1月1日）
    if (solarMonth === 1 && solarDay === 1) {
      return '元旦';
    }

    // 春节（农历正月初一）
    if (lunar.getMonth() === 1 && lunar.getDay() === 1) {
      return '春节';
    }

    // 清明节（简化处理：通常在4月4日或5日）
    if (solarMonth === 4 && (solarDay === 4 || solarDay === 5)) {
      return '清明节';
    }

    // 劳动节（阳历5月1日）
    if (solarMonth === 5 && solarDay === 1) {
      return '劳动节';
    }

    // 端午节（农历五月初五）
    if (lunar.getMonth() === 5 && lunar.getDay() === 5) {
      return '端午节';
    }

    // 中秋节（农历八月十五）
    if (lunar.getMonth() === 8 && lunar.getDay() === 15) {
      return '中秋节';
    }

    // 国庆节（阳历10月1日）
    if (solarMonth === 10 && solarDay === 1) {
      return '国庆节';
    }

    return null;
  } catch (error) {
    console.error('节假日计算失败:', error);
    return null;
  }
}

/**
 * 获取指定阳历日期的节假日名称
 * 优先使用预定义的准确数据，如果没有则使用通用计算
 * @param solarMonth 阳历月份（1-12）
 * @param solarDay 阳历日期（1-31）
 * @param year 年份
 * @returns 节日名称，如果不是节假日则返回 null
 */
export function getHolidayName(solarMonth: number, solarDay: number, year: number): string | null {
  // 首先尝试从预定义数据中查找
  const holidayFromData = findHolidayFromData(solarMonth, solarDay, year);
  if (holidayFromData) {
    return holidayFromData;
  }

  // 如果没有预定义数据，使用通用计算
  return calculateHolidayGeneric(solarMonth, solarDay, year);
}

/**
 * 判断指定日期是否为节假日
 * 支持2024-2027年的完整节假日数据，其他年份使用通用计算
 */
export function isHoliday(solarMonth: number, solarDay: number, year: number): boolean {
  return getHolidayName(solarMonth, solarDay, year) !== null;
}

/**
 * 获取指定年份的所有节假日日期列表
 * @param year 年份
 * @returns 节假日日期列表
 */
export function getAllHolidays(year: number): HolidayDate[] {
  const holidayData = getHolidayData(year);
  if (holidayData.length > 0) {
    // 使用预定义数据
    return holidayData.flatMap(group => group.dates);
  }

  // 生成通用节假日列表
  const holidays: HolidayDate[] = [];

  // 元旦
  holidays.push({ month: 1, day: 1, label: '元旦' });

  // 春节
  const chunjie = Lunar.fromYmd(year, 1, 1).getSolar();
  holidays.push({ month: chunjie.getMonth(), day: chunjie.getDay(), label: '春节' });

  // 清明节（简化）
  holidays.push({ month: 4, day: 4, label: '清明节' });

  // 劳动节
  holidays.push({ month: 5, day: 1, label: '劳动节' });

  // 端午节
  const duanwu = Lunar.fromYmd(year, 5, 5).getSolar();
  holidays.push({ month: duanwu.getMonth(), day: duanwu.getDay(), label: '端午节' });

  // 中秋节
  const zhongqiu = Lunar.fromYmd(year, 8, 15).getSolar();
  holidays.push({ month: zhongqiu.getMonth(), day: zhongqiu.getDay(), label: '中秋节' });

  // 国庆节
  holidays.push({ month: 10, day: 1, label: '国庆节' });

  return holidays;
}
