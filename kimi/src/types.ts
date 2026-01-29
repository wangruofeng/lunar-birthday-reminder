/**
 * 农历日期接口
 */
export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap?: boolean;
}

/**
 * 生日信息接口
 */
export interface Birthday {
  id: string;
  name: string;
  relationship: string;
  lunarDate: LunarDate;
}

/**
 * 即将到来的生日信息接口
 */
export interface UpcomingBirthday extends Birthday {
  solarDate: Date;
  daysRemaining: number;
}

/**
 * 支持的语言类型
 */
export type LangCode = 'zh-CN' | 'en' | 'zh-TW';

/**
 * 翻译接口
 */
export interface Translations {
  title: string;
  slogan: string;
  recent: string;
  buddies: string;
  add: string;
  check: string;
  showHolidays: string;
  today: string;
  later: string;
  willBe: string;
  ageSuffix: string;
  lunar: string;
  solar: string;
  rel: string;
  name: string;
  year: string;
  month: string;
  day: string;
  cancel: string;
  submit: string;
  deleteConfirm: string;
  noReminders: string;
  noBuddies: string;
  unitDay: string;
  unitMonth: string;
  unitYear: string;
  upcoming: string;
  todayTag: string;
  weekDays: string[];
}
