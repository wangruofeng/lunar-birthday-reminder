import solarlunar from 'solarlunar';

// 生日数据结构仅存农历月日，按当前 / 指定年份计算对应公历生日

export function lunarBirthdayToNextSolar({ lunarMonth, lunarDay }, fromDate = new Date()) {
  const year = fromDate.getFullYear();
  let candidate = lunarToSolar(year, lunarMonth, lunarDay);

  if (!candidate) return null;

  const candidateDate = new Date(candidate.year, candidate.month - 1, candidate.day);
  if (candidateDate < startOfDay(fromDate)) {
    const next = lunarToSolar(year + 1, lunarMonth, lunarDay);
    if (!next) return null;
    return new Date(next.year, next.month - 1, next.day);
  }

  return candidateDate;
}

export function lunarToSolar(year, lunarMonth, lunarDay) {
  try {
    const res = solarlunar.lunar2solar(year, lunarMonth, lunarDay);
    if (!res || !res.cYear) return null;
    return { year: res.cYear, month: res.cMonth, day: res.cDay };
  } catch {
    return null;
  }
}

// 公历 → 农历，用于日历上展示当天对应的农历日期
export function solarToLunar(date) {
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const res = solarlunar.solar2lunar(year, month, day);
    // solarlunar 返回对象包含：monthCn (农历月份中文，如"正月")、dayCn (农历日期，如"初一")
    if (res && res.monthCn && res.dayCn) {
      return res;
    }
    return null;
  } catch {
    return null;
  }
}

export function daysBetween(dateA, dateB) {
  const a = startOfDay(dateA).getTime();
  const b = startOfDay(dateB).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// 计算某年某月的所有天
export function getMonthMatrix(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const firstWeekday = firstDay.getDay(); // 0-6, 周日为 0

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const cells = [];

  // 前置空位（上个月）
  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrevMonth - firstWeekday + 1 + i;
    cells.push({
      date: new Date(year, monthIndex - 1, day),
      inCurrentMonth: false
    });
  }

  // 当前月
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(year, monthIndex, d),
      inCurrentMonth: true
    });
  }

  // 补足到 6 行 * 7 列
  const total = 42;
  const nextDays = total - cells.length;
  const nextMonth = new Date(year, monthIndex + 1, 1);
  for (let i = 0; i < nextDays; i++) {
    cells.push({
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1),
      inCurrentMonth: false
    });
  }

  return cells;
}

// 固定节假日（每年日期相同）
const FIXED_HOLIDAYS = {
  '01-01': '元旦',
  '05-01': '劳动节',
  '10-01': '国庆节',
  '10-02': '国庆节',
  '10-03': '国庆节'
};

// 按年份存储的节假日范围（包含调休后的完整假期）
// 格式：{ year: { 'MM-DD': '节日名称', ... } }
const YEARLY_HOLIDAYS = {
  2026: {
    // 元旦：2026年1月1日（周四）至1月3日（周六）
    '01-01': '元旦',
    '01-02': '元旦',
    '01-03': '元旦',
    // 春节：2026年2月15日（农历腊月二十八，周日）至2月23日（农历正月初七，周一）
    '02-15': '春节',
    '02-16': '春节',
    '02-17': '春节',
    '02-18': '春节',
    '02-19': '春节',
    '02-20': '春节',
    '02-21': '春节',
    '02-22': '春节',
    '02-23': '春节',
    // 清明节：2026年4月4日（周六）至4月6日（周一）
    '04-04': '清明节',
    '04-05': '清明节',
    '04-06': '清明节',
    // 劳动节：2026年5月1日（周五）至5月5日（周二）
    '05-01': '劳动节',
    '05-02': '劳动节',
    '05-03': '劳动节',
    '05-04': '劳动节',
    '05-05': '劳动节',
    // 端午节：2026年6月19日（周五）至6月21日（周日）
    '06-19': '端午节',
    '06-20': '端午节',
    '06-21': '端午节',
    // 中秋节：2026年9月25日（周五）至9月27日（周日）
    '09-25': '中秋节',
    '09-26': '中秋节',
    '09-27': '中秋节',
    // 国庆节：2026年10月1日（周四）至10月7日（周三）
    '10-01': '国庆节',
    '10-02': '国庆节',
    '10-03': '国庆节',
    '10-04': '国庆节',
    '10-05': '国庆节',
    '10-06': '国庆节',
    '10-07': '国庆节'
  }
};

// 这里预置部分近年春节日期（仅春节第一天），用于未配置完整假期范围的年份
const SPRING_FESTIVAL_BY_YEAR = {
  2024: '02-10',
  2025: '01-29',
  2027: '02-07'
};

export function getHolidayName(date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const key = `${month}-${day}`;
  const year = date.getFullYear();

  // 优先检查按年份配置的完整假期范围
  if (YEARLY_HOLIDAYS[year] && YEARLY_HOLIDAYS[year][key]) {
    return YEARLY_HOLIDAYS[year][key];
  }

  // 检查固定节假日（适用于所有年份）
  if (FIXED_HOLIDAYS[key]) return FIXED_HOLIDAYS[key];

  // 检查春节（仅检查第一天，用于未配置完整假期范围的年份）
  const sf = SPRING_FESTIVAL_BY_YEAR[year];
  if (sf && sf === key) return '春节';

  return null;
}

