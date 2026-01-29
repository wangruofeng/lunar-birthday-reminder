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

/**
 * 将公历日期转换为农历日期
 * @param date 公历日期
 * @returns 农历日期信息
 */
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
 * 获取下一个农历生日对应的公历日期
 * @param lunarMonth 农历月
 * @param lunarDay 农历日
 * @returns 下一个生日的公历日期
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
 * 2026年中国法定节假日安排
 * 数据来源：国务院办公厅关于2026年部分节假日安排的通知（国办发明电〔2025〕16号）
 */
const HOLIDAYS_2026: Array<{
  name: string;
  start: Date;
  end: Date;
}> = [
  // 元旦：2026年1月1日（周四）至1月3日（周六），3天
  { name: '元旦', start: new Date(2026, 0, 1), end: new Date(2026, 0, 3) },
  // 春节：2026年2月15日（农历腊月二十八，周日）至2月23日（农历正月初七，周一），9天
  { name: '春节', start: new Date(2026, 1, 15), end: new Date(2026, 1, 23) },
  // 清明节：2026年4月4日（周六）至4月6日（周一），3天
  { name: '清明节', start: new Date(2026, 3, 4), end: new Date(2026, 3, 6) },
  // 劳动节：2026年5月1日（周五）至5月5日（周二），5天
  { name: '劳动节', start: new Date(2026, 4, 1), end: new Date(2026, 4, 5) },
  // 端午节：2026年6月19日（周五）至6月21日（周日），3天
  { name: '端午节', start: new Date(2026, 5, 19), end: new Date(2026, 5, 21) },
  // 中秋节：2026年9月25日（周五）至9月27日（周日），3天
  { name: '中秋节', start: new Date(2026, 8, 25), end: new Date(2026, 8, 27) },
  // 国庆节：2026年10月1日（周四）至10月7日（周三），7天
  { name: '国庆节', start: new Date(2026, 9, 1), end: new Date(2026, 9, 7) },
];

/**
 * 检查日期是否在指定范围内（忽略时间部分）
 */
function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
}

/**
 * 获取指定日期的节日名称
 * @param date 公历日期
 * @returns 节日名称或 null
 */
export function getHoliday(date: Date): string | null {
  const year = date.getFullYear();
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  // 检查2026年法定节假日
  if (year === 2026) {
    for (const holiday of HOLIDAYS_2026) {
      if (isDateInRange(date, holiday.start, holiday.end)) {
        return holiday.name;
      }
    }
  }

  // 传统固定公历节日（适用于所有年份）
  const m = solar.getMonth();
  const d = solar.getDay();
  const solarStr = `${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

  if (solarStr === '01-01') return '元旦';
  if (solarStr === '05-01') return '劳动节';
  if (solarStr === '06-01') return '儿童节';
  if (solarStr >= '10-01' && solarStr <= '10-07') return '国庆节';

  // 传统农历节日（适用于所有年份）
  const lm = lunar.getMonth();
  const ld = lunar.getDay();

  // 春节（农历正月初一至初七）
  if (lm === 1 && ld >= 1 && ld <= 7) return '春节';
  // 元宵节（农历正月十五）
  if (lm === 1 && ld === 15) return '元宵节';
  // 端午节（农历五月初五）
  if (lm === 5 && ld === 5) return '端午节';
  // 中秋节（农历八月十五）
  if (lm === 8 && ld === 15) return '中秋节';
  // 重阳节（农历九月初九）
  if (lm === 9 && ld === 9) return '重阳节';

  // 除夕（农历腊月最后一天，即农历正月初一的前一天）
  const tomorrow = new Date(date.getTime() + 86400000);
  const tomorrowLunar = Solar.fromDate(tomorrow).getLunar();
  if (tomorrowLunar.getMonth() === 1 && tomorrowLunar.getDay() === 1) return '除夕';

  return null;
}
