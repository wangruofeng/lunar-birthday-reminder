import { Translations, LangCode } from '../types';

/**
 * 多语言翻译配置
 */
export const translations: Record<LangCode, Translations> = {
  'zh-CN': {
    title: '生日历',
    slogan: '农历生日，一个都不忘',
    recent: '最近提醒',
    buddies: '生日列表',
    add: '新增小伙伴',
    check: '检查提醒',
    showHolidays: '显示中国法定节假日',
    today: '今天',
    later: '天后',
    willBe: '将满',
    ageSuffix: '岁',
    lunar: '农历',
    solar: '阳历',
    rel: '关系',
    name: '姓名',
    year: '出生年份',
    month: '月份',
    day: '日期',
    cancel: '取消',
    submit: '好哒！',
    deleteConfirm: '确定要删除这条生日信息吗？( • ᴖ • ｡)',
    noReminders: '暂时没有小伙伴过生日哦~ 🎈',
    noBuddies: '快去添加你的第一个小伙伴吧！✨',
    unitDay: '日',
    unitMonth: '月',
    unitYear: '年',
    upcoming: '即将到来',
    todayTag: '🎉 今天！',
    weekDays: ['日', '一', '二', '三', '四', '五', '六']
  },
  'en': {
    title: 'Lunar B-Day',
    slogan: 'Never miss a lunar birthday',
    recent: 'Upcoming',
    buddies: 'Buddies',
    add: 'New Buddy',
    check: 'Check',
    showHolidays: 'Chinese Holidays',
    today: 'Today',
    later: 'd later',
    willBe: 'Will be',
    ageSuffix: 'yrs',
    lunar: 'Lunar',
    solar: 'Solar',
    rel: 'Relation',
    name: 'Name',
    year: 'Birth Year',
    month: 'Month',
    day: 'Day',
    cancel: 'Cancel',
    submit: 'Save!',
    deleteConfirm: 'Delete this birthday? ( • ᴖ • ｡)',
    noReminders: 'No b-days coming up~ 🎈',
    noBuddies: 'Add your first buddy! ✨',
    unitDay: '',
    unitMonth: '',
    unitYear: '',
    upcoming: 'Upcoming',
    todayTag: '🎉 Today!',
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  'zh-TW': {
    title: '生日曆',
    slogan: '農曆生日，一個都不忘',
    recent: '最近提醒',
    buddies: '小夥伴們',
    add: '新增小夥伴',
    check: '檢查提醒',
    showHolidays: '顯示中國法定節假日',
    today: '今天',
    later: '天后',
    willBe: '將滿',
    ageSuffix: '歲',
    lunar: '農曆',
    solar: '陽曆',
    rel: '關係',
    name: '姓名',
    year: '出生年份',
    month: '月份',
    day: '日期',
    cancel: '取消',
    submit: '好噠！',
    deleteConfirm: '確定要刪除這條生日信息嗎？( • ᴖ • ｡)',
    noReminders: '暫時沒有小夥伴過生日哦~ 🎈',
    noBuddies: '快去添加你的第一個小夥伴吧！✨',
    unitDay: '日',
    unitMonth: '月',
    unitYear: '年',
    upcoming: '即將到来',
    todayTag: '🎉 今天！',
    weekDays: ['日', '一', '二', '三', '四', '五', '六']
  }
};

/**
 * 创建翻译钩子工厂函数
 */
export const createTranslationHook = (lang: LangCode) => {
  const t = (key: keyof Translations): string => {
    const val = translations[lang][key];
    return Array.isArray(val) ? val.join(', ') : val as string;
  };

  const tList = (key: keyof Translations): string[] => {
    const val = translations[lang][key];
    return Array.isArray(val) ? val : [val as string];
  };

  return { t, tList };
};
