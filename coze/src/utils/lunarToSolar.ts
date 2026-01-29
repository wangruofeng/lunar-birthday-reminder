import { Lunar, Solar } from 'lunar-javascript';

/**
 * 农历转阳历
 * @param lunarYear 农历年份（如 1990）
 * @param lunarMonth 农历月份（1-12）
 * @param lunarDay 农历日期（1-30）
 * @returns 阳历日期对象 { year, month, day }
 */
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number) {
  try {
    const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
    const solar = lunar.getSolar();
    return {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
    };
  } catch (error) {
    console.error('农历转换失败:', error);
    return null;
  }
}

/**
 * 判断两个日期是否是同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 获取两个日期之间的天数差
 */
export function getDaysDiff(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((date2.getTime() - date1.getTime()) / oneDay);
  return diffDays;
}

/**
 * 判断日期是否在未来7天内（含今天）
 */
export function isWithinNext7Days(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffDays = getDaysDiff(today, targetDate);
  return diffDays >= 0 && diffDays <= 6;
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 计算下一年的阳历生日日期
 * @param solarMonth 阳历月份
 * @param solarDay 阳历日期
 * @returns 下一年的阳历生日日期
 */
export function getNextYearBirthday(solarMonth: number, solarDay: number): Date {
  const today = new Date();
  const thisYearBirthday = new Date(today.getFullYear(), solarMonth - 1, solarDay);
  
  // 如果今年的生日已经过了，返回明年的生日
  if (thisYearBirthday < today) {
    return new Date(today.getFullYear() + 1, solarMonth - 1, solarDay);
  }
  
  return thisYearBirthday;
}
