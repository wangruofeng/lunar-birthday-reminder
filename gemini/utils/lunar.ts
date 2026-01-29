import { Lunar, Solar } from 'lunar-javascript';

/**
 * 计算某个农历生日在指定农历年份对应的公历日期
 *
 * @param lunarMonth 农历月（1-12）
 * @param lunarDay   农历日（1-30）
 * @param targetLunarYear 目标农历年份（例如 2025）
 * @returns 公历日期 YYYY-MM-DD
 */
export function getSolarBirthdayFromLunar(
  lunarMonth: number,
  lunarDay: number,
  targetLunarYear: number
): string {
  // 普通生日几乎都不是闰月，统一 false
  const lunar = Lunar.fromYmd(
    targetLunarYear,
    lunarMonth,
    lunarDay,
    false
  );

  const solar = lunar.getSolar();
  const year = solar.getYear();
  const month = String(solar.getMonth()).padStart(2, '0');
  const day = String(solar.getDay()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function solarToLunar(date: Date) {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  return {
    month: lunar.getMonth(),
    day: lunar.getDay(),
    monthName: lunar.getMonthInChinese() + '月',
    dayName: lunar.getDayInChinese(),
    isFirstDayOfMonth: lunar.getDay() === 1
  };
}

/**
 * Robustly finds the next occurrence of a lunar birthday in solar time.
 */
export function getNextSolarBirthday(lunarMonth: number, lunarDay: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentSolarYear = today.getFullYear();
  
  // We check dates in a range of solar years to ensure we catch the next occurrence
  const years = [currentSolarYear - 1, currentSolarYear, currentSolarYear + 1];
  const candidates = years.map(y => {
    const l = Lunar.fromYmd(y, lunarMonth, lunarDay);
    const s = l.getSolar();
    return new Date(s.getYear(), s.getMonth() - 1, s.getDay());
  });

  const upcoming = candidates
    .filter(d => d.getTime() >= today.getTime())
    .sort((a, b) => a.getTime() - b.getTime());

  // Return the closest upcoming date, or the first one if all are in the past (safety)
  return upcoming[0] || candidates[1];
}

/**
 * 2026年中国法定节假日安排（国务院办公厅通知）
 */
const HOLIDAYS_2026: Array<{ key: string; start: string; end: string }> = [
  { key: 'newYear', start: '2026-01-01', end: '2026-01-03' },
  { key: 'springFestival', start: '2026-02-15', end: '2026-02-23' },
  { key: 'qingming', start: '2026-04-04', end: '2026-04-06' },
  { key: 'laborDay', start: '2026-05-01', end: '2026-05-05' },
  { key: 'dragonBoat', start: '2026-06-19', end: '2026-06-21' },
  { key: 'midAutumn', start: '2026-09-25', end: '2026-09-27' },
  { key: 'nationalDay', start: '2026-10-01', end: '2026-10-07' },
];

/**
 * 检查日期是否在指定范围内（包含起始和结束日期）
 */
function isDateInRange(date: Date, startStr: string, endStr: string): boolean {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return dateStr >= startStr && dateStr <= endStr;
}

export function getHoliday(date: Date): string | null {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const year = solar.getYear();
  
  // 优先检查2026年法定节假日
  if (year === 2026) {
    for (const holiday of HOLIDAYS_2026) {
      if (isDateInRange(date, holiday.start, holiday.end)) {
        return holiday.key;
      }
    }
  }
  
  // Solar Holidays (通用规则，作为后备)
  const m = solar.getMonth();
  const d = solar.getDay();
  const solarStr = `${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  
  if (solarStr === '01-01') return 'newYear';
  if (solarStr === '05-01') return 'laborDay';
  if (solarStr === '06-01') return 'childrenDay';
  if (solarStr >= '10-01' && solarStr <= '10-07') return 'nationalDay';

  // Lunar Holidays (通用规则)
  const lm = lunar.getMonth();
  const ld = lunar.getDay();
  
  if (lm === 1 && ld >= 1 && ld <= 7) return 'springFestival';
  if (lm === 1 && ld === 15) return 'lanternFestival';
  if (lm === 5 && ld === 5) return 'dragonBoat';
  if (lm === 8 && ld === 15) return 'midAutumn';
  if (lm === 9 && ld === 9) return 'doubleNinth';
  
  // New Year's Eve
  const tomorrow = new Date(date.getTime() + 86400000);
  const tomorrowLunar = Solar.fromDate(tomorrow).getLunar();
  if (tomorrowLunar.getMonth() === 1 && tomorrowLunar.getDay() === 1) return 'newYearEve';

  return null;
}
