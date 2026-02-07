import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Bell, ChevronLeft, ChevronRight, Cake, Users, X, Heart, Star, Globe } from 'lucide-react';
import { Birthday, UpcomingBirthday } from './types';
import { getNextSolarBirthday, getHoliday, solarToLunar } from './utils/lunar';

type LangCode = 'zh-CN' | 'en' | 'zh-TW';

const translations = {
  'zh-CN': {
    title: '生日记',
    slogan: '不忘每一个重要日子',
    recent: '最近提醒',
    buddies: '生日列表',
    add: '新增小伙伴',
    check: '检查提醒',
    showHolidays: '显示节日',
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
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    close: '关闭',
    yearLabel: '年',
    monthLabel: '月',
    newYear: '元旦',
    springFestival: '春节',
    qingming: '清明节',
    laborDay: '劳动节',
    dragonBoat: '端午节',
    midAutumn: '中秋节',
    nationalDay: '国庆节',
    childrenDay: '儿童节',
    lanternFestival: '元宵节',
    doubleNinth: '重阳节',
    newYearEve: '除夕'
  },
  'en': {
    title: 'Birthday Note',
    slogan: 'Never miss a special day',
    recent: 'Upcoming',
    buddies: 'Buddies',
    add: 'New Buddy',
    check: 'Check',
    showHolidays: 'Holidays',
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
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    close: 'Close',
    yearLabel: '',
    monthLabel: '',
    newYear: 'New Year',
    springFestival: 'Spring Festival',
    qingming: 'Qingming',
    laborDay: 'Labor Day',
    dragonBoat: 'Dragon Boat',
    midAutumn: 'Mid-Autumn',
    nationalDay: 'National Day',
    childrenDay: 'Children\'s Day',
    lanternFestival: 'Lantern Festival',
    doubleNinth: 'Double Ninth',
    newYearEve: 'New Year\'s Eve'
  },
  'zh-TW': {
    title: '生日記',
    slogan: '不忘每一個重要日子',
    recent: '最近提醒',
    buddies: '小夥伴們',
    add: '新增小夥伴',
    check: '檢查提醒',
    showHolidays: '顯示節日',
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
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    close: '關閉',
    yearLabel: '年',
    monthLabel: '月',
    newYear: '元旦',
    springFestival: '春節',
    qingming: '清明節',
    laborDay: '勞動節',
    dragonBoat: '端午節',
    midAutumn: '中秋節',
    nationalDay: '國慶節',
    childrenDay: '兒童節',
    lanternFestival: '元宵節',
    doubleNinth: '重陽節',
    newYearEve: '除夕'
  }
};

const App: React.FC = () => {
    const [lang, setLang] = React.useState<LangCode>(() => {
        const saved = localStorage.getItem('app_lang');
        return (saved as LangCode) || 'zh-CN';
    });

    const t = (key: keyof typeof translations['zh-CN']): string => {
        const val = translations[lang][key];
        return Array.isArray(val) ? val.join(', ') : val as string;
    };

    const tList = (key: keyof typeof translations['zh-CN']): string[] => {
        const val = translations[lang][key];
        return Array.isArray(val) ? val : [val as string];
    };

    const [birthdays, setBirthdays] = React.useState<Birthday[]>(() => {
        try {
            const saved = localStorage.getItem('birthdays');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    
    const [viewDate, setViewDate] = React.useState(new Date());
    const [showHolidays, setShowHolidays] = React.useState(true);
    const [showForm, setShowForm] = React.useState(false);
    const [reminders, setReminders] = React.useState<(UpcomingBirthday & { age: number })[]>([]);
    const [selectedBirthday, setSelectedBirthday] = React.useState<(UpcomingBirthday & { age: number }) | null>(null);

    const calculateReminders = React.useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfToday = today.getTime();

        const upcoming = birthdays.map(b => {
            const solar = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
            const diff = Math.ceil((solar.getTime() - startOfToday) / (1000 * 60 * 60 * 24));
            const age = solar.getFullYear() - b.lunarDate.year;
            return { ...b, solarDate: solar, daysRemaining: diff, age };
        }).filter(b => b.daysRemaining >= 0 && b.daysRemaining <= 14)
          .sort((a, b) => a.daysRemaining - b.daysRemaining);

        setReminders(upcoming);
    }, [birthdays]);

    React.useEffect(() => {
        localStorage.setItem('birthdays', JSON.stringify(birthdays));
        calculateReminders();
    }, [birthdays, calculateReminders]);

    React.useEffect(() => {
        localStorage.setItem('app_lang', lang);
    }, [lang]);

    const addBirthday = (name: string, relationship: string, year: number, month: number, day: number) => {
        const newBday: Birthday = {
            id: crypto.randomUUID(),
            name,
            relationship,
            lunarDate: { year, month, day }
        };
        setBirthdays(prev => [...prev, newBday]);
        setShowForm(false);
    };

    const deleteBirthday = (id: string) => {
        if (confirm(t('deleteConfirm'))) {
            setBirthdays(prev => prev.filter(b => b.id !== id));
        }
    };

    const navigateToBirthday = (b: Birthday) => {
        const solar = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
        setViewDate(new Date(solar.getFullYear(), solar.getMonth(), 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentLocale = lang === 'en' ? 'en-US' : lang === 'zh-TW' ? 'zh-TW' : 'zh-CN';

    const formatCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const weekDay = today.getDay();
        const weekDays = tList('weekDays');
        
        if (lang === 'en') {
            return `${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${weekDays[weekDay]}`;
        } else {
            return `${year}${t('yearLabel')}${month}${t('monthLabel')}${day}${t('unitDay')} ${weekDays[weekDay]}`;
        }
    };

    return (
        <div className="h-screen max-w-screen-2xl mx-auto p-3 md:p-4 flex flex-col gap-3 overflow-hidden" data-testid="app-container">
            <header className="flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-lg px-4 py-2.5 rounded-2xl cute-shadow border-2 border-white flex-shrink-0 gap-3" data-testid="app-header">
                <div className="flex items-center gap-2.5">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="bg-pink-100 p-2 rounded-full shadow-inner"
                    >
                        <Cake className="text-pink-500" size={24} />
                    </motion.div>
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight" data-testid="app-title">
                            {t('title')}
                        </h1>
                        <p className="text-xs text-pink-500/90 font-medium mt-0.5 tracking-wide" data-testid="app-slogan">
                            {t('slogan')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-full px-1 py-0.5 border border-white shadow-inner">
                        <Globe size={12} className="mx-1.5 text-slate-400" />
                        <button onClick={() => setLang('zh-CN')} className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${lang === 'zh-CN' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'}`}>简</button>
                        <button onClick={() => setLang('zh-TW')} className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${lang === 'zh-TW' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'}`}>繁</button>
                        <button onClick={() => setLang('en')} className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${lang === 'en' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'}`}>EN</button>
                    </div>
                    <div className="hidden md:block text-xs text-pink-500 font-semibold bg-pink-50 px-3 py-1 rounded-full border border-pink-100 shadow-sm">
                        ✨ {formatCurrentDate()}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start flex-1 min-h-0">
                {/* Sidebar (3 columns) */}
                <div className="lg:col-span-3 flex flex-col gap-3 overflow-hidden" data-testid="sidebar">
                    <section className="bg-white rounded-2xl p-4 cute-shadow border-2 border-white flex-shrink-0">
                        <h2 className="text-base font-semibold mb-3 flex items-center gap-1.5 text-slate-800">
                            <Bell className="text-orange-400" size={16} /> {t('recent')}
                        </h2>
                        <div className="space-y-2 overflow-y-auto max-h-[140px] custom-scrollbar pr-1.5" data-testid="reminders-list">
                            {reminders.length > 0 ? reminders.map(r => (
                                <motion.div key={r.id} onClick={() => setSelectedBirthday(r)} className={`p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${r.daysRemaining === 0 ? 'bg-pink-50 border-pink-100' : 'bg-orange-50 border-orange-100'}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-sm truncate">{r.name}</span>
                                            <span className="text-xs font-medium opacity-80">{t('willBe')} {r.age}{t('ageSuffix')}</span>
                                        </div>
                                        <span className={`text-xs font-medium tracking-wide px-2 py-0.5 rounded-full shadow-sm ${r.daysRemaining === 0 ? 'bg-pink-500 text-white animate-pulse ring-1 ring-pink-400/30' : 'bg-orange-400 text-white ring-1 ring-orange-300/30'}`}>
                                            {r.daysRemaining === 0 ? t('todayTag') : `${r.daysRemaining}${t('later')}`}
                                        </span>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-4 text-slate-400 text-sm font-medium">{t('noReminders')}</div>
                            )}
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl p-4 cute-shadow border-2 border-white flex-1 flex flex-col min-h-0">
                        <h2 className="text-base font-semibold mb-3 flex items-center gap-1.5 text-slate-800">
                            <Users className="text-blue-400" size={16} /> {t('buddies')}
                        </h2>
                        <div className="overflow-y-auto flex-1 custom-scrollbar space-y-1.5 pr-1.5 mb-3 min-h-0" data-testid="birthdays-list">
                            {birthdays.map(b => {
                                const solarDate = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
                                return (
                                    <div key={b.id} onClick={() => navigateToBirthday(b)} className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-slate-50/30" data-testid={`birthday-item-${b.id}`}>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-700 truncate">{b.name}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <p className="text-xs text-slate-500 font-medium">{t('lunar')} {b.lunarDate.month}/{b.lunarDate.day}</p>
                                                <p className="text-xs text-slate-400 font-medium">{t('solar')} {solarDate.getMonth() + 1}/{solarDate.getDate()}</p>
                                            </div>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); deleteBirthday(b.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-400 rounded-full transition-all" data-testid={`delete-button-${b.id}`}>
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <button onClick={() => setShowForm(true)} className="w-full bg-pink-500 text-white py-2.5 rounded-full flex items-center justify-center gap-1.5 font-semibold text-xs shadow-lg shadow-pink-100" data-testid="add-birthday-button">
                                <Plus size={14} strokeWidth={3} /> {t('add')}
                            </button>
                        </div>
                    </section>
                </div>

                {/* Calendar (9 columns) */}
                <div className="lg:col-span-9 h-full">
                    <section className="bg-white rounded-3xl p-4 cute-shadow border-2 border-white h-full flex flex-col" data-testid="calendar-section">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 flex-shrink-0">
                            <h2 className="text-xl font-semibold text-slate-800">
                                {lang === 'en' ? viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }) : `${viewDate.getFullYear()}${t('yearLabel')} ${viewDate.getMonth() + 1}${t('monthLabel')}`}
                            </h2>
                            <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 cursor-pointer">
                                    <input type="checkbox" checked={showHolidays} onChange={e => setShowHolidays(e.target.checked)} className="rounded text-pink-500" size={12} />
                                    {t('showHolidays')}
                                </label>
                                <div className="flex bg-slate-100 rounded-full px-1 py-0.5 border border-slate-200">
                                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 hover:bg-white rounded-full transition-all"><ChevronLeft size={14} /></button>
                                    <button onClick={() => setViewDate(new Date())} className="px-2 text-xs font-semibold">{t('today')}</button>
                                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 hover:bg-white rounded-full transition-all"><ChevronRight size={14} /></button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden rounded-2xl">
                            <div className="calendar-grid h-full min-w-[600px] border-l border-t border-pink-50">
                                {tList('weekDays').map(d => (
                                    <div key={d} className="py-2 text-center text-xs font-semibold text-pink-300 uppercase bg-pink-50/10 border-r border-b border-pink-50 flex-shrink-0">
                                        {d}
                                    </div>
                                ))}
                                <CalendarGrid 
                                    viewDate={viewDate} 
                                    birthdays={birthdays} 
                                    showHolidays={showHolidays} 
                                    lang={lang}
                                    t={t}
                                    onBirthdayClick={(b, age) => {
                                        const solar = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
                                        const diff = Math.ceil((solar.getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
                                        setSelectedBirthday({...b, solarDate: solar, daysRemaining: diff, age});
                                    }}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedBirthday && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBirthday(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-6 w-full max-w-sm cute-shadow border-4 border-white relative" onClick={e => e.stopPropagation()}>
                            <button 
                                onClick={() => setSelectedBirthday(null)} 
                                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                aria-label={t('close')}
                            >
                                <X size={20} />
                            </button>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-3"><Cake className="text-pink-500" size={32} /></div>
                                <h3 className="text-2xl font-semibold text-slate-800">{selectedBirthday.name}</h3>
                                <p className="text-pink-500 font-semibold mt-1 text-xs">{selectedBirthday.relationship} · {selectedBirthday.age}{t('ageSuffix')}</p>
                                <div className="mt-4 w-full space-y-2">
                                    <div className="bg-slate-50 rounded-2xl p-3 flex justify-between items-start">
                                        <div className="flex flex-col text-left">
                                            <p className="text-xs font-semibold text-slate-400 mb-1">{t('lunar')}</p>
                                            <p className="font-semibold text-sm">{selectedBirthday.lunarDate.month}/{selectedBirthday.lunarDate.day}</p>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <p className="text-xs font-semibold text-slate-400 mb-1">{t('solar')}</p>
                                            <p className="font-semibold text-sm">{selectedBirthday.solarDate.getMonth()+1}/{selectedBirthday.solarDate.getDate()}</p>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-2xl font-semibold text-white text-base ${selectedBirthday.daysRemaining === 0 ? 'bg-pink-500' : 'bg-orange-400'}`}>
                                        {selectedBirthday.daysRemaining === 0 ? t('todayTag') : `${t('upcoming')} ${selectedBirthday.daysRemaining}${t('later')}`}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 w-full max-w-sm cute-shadow border-4 border-white" onClick={e => e.stopPropagation()}>
                            <h2 className="text-xl font-semibold mb-4">{t('add')}</h2>
                            <form onSubmit={e => {
                                e.preventDefault();
                                const d = new FormData(e.currentTarget);
                                addBirthday(d.get('n') as string, d.get('r') as string, parseInt(d.get('y') as string), parseInt(d.get('m') as string), parseInt(d.get('d') as string));
                            }} className="space-y-3" data-testid="add-birthday-form">
                                <input required name="n" placeholder={t('name')} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-semibold text-sm" data-testid="input-name" />
                                <input required name="r" placeholder={t('rel')} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-semibold text-sm" data-testid="input-relation" />
                                <input required name="y" type="number" defaultValue={new Date().getFullYear()} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-semibold text-sm" data-testid="input-year" />
                                <div className="grid grid-cols-2 gap-3">
                                    <select name="m" className="px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-semibold text-sm" data-testid="select-month">
                                        {Array.from({length:12}).map((_,i)=><option key={i} value={i+1}>{i+1}{t('monthLabel')}</option>)}
                                    </select>
                                    <select name="d" className="px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-semibold text-sm" data-testid="select-day">
                                        {Array.from({length:30}).map((_,i)=><option key={i} value={i+1}>{i+1}{t('unitDay')}</option>)}
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-full border-2 border-slate-100 text-slate-400 font-semibold text-sm">{t('cancel')}</button>
                                    <button type="submit" className="flex-1 py-2 rounded-full bg-pink-500 text-white font-semibold text-sm">{t('submit')}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CalendarGrid: React.FC<{ viewDate: Date; birthdays: Birthday[]; showHolidays: boolean; lang: LangCode; t: (key: keyof typeof translations['zh-CN']) => string; onBirthdayClick: (b: Birthday, age: number) => void; }> = ({ viewDate, birthdays, showHolidays, lang, t, onBirthdayClick }) => {
    const cells = React.useMemo(() => {
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth();
        const first = new Date(y, m, 1).getDay();
        const count = new Date(y, m + 1, 0).getDate();
        const res = [];
        for (let i = 0; i < first; i++) res.push(null);
        for (let i = 1; i <= count; i++) {
            const date = new Date(y, m, i);
            const lunar = solarToLunar(date);
            const holiday = showHolidays ? getHoliday(date) : null;
            const bdays = birthdays.map(b => {
                const s = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
                const age = s.getFullYear() - b.lunarDate.year;
                return (b.lunarDate.month === lunar.month && b.lunarDate.day === lunar.day) ? { ...b, age } : null;
            }).filter(Boolean) as (Birthday & { age: number })[];
            res.push({ date, lunar, holiday, bdays });
        }
        return res;
    }, [viewDate, birthdays, showHolidays, lang]);

    return (
        <>
            {cells.map((c, i) => (
                <div key={i} className={`min-h-[70px] p-1.5 border-r border-b border-pink-50 flex flex-col group ${!c ? 'bg-slate-50/20' : 'hover:bg-pink-50/10'}`}>
                    {c && (
                        <>
                            <div className="flex justify-between items-start mb-0.5">
                                <div className="flex flex-col">
                                    <span className={`text-base font-semibold w-7 h-7 flex items-center justify-center rounded-md ${c.date.toDateString() === new Date().toDateString() ? 'bg-pink-500 text-white' : 'text-slate-800'}`}>{c.date.getDate()}</span>
                                    <span className={`text-xs font-medium mt-0.5 ml-1 ${c.lunar.isFirstDayOfMonth ? 'text-pink-500' : 'text-slate-400'}`}>{c.lunar.isFirstDayOfMonth ? c.lunar.monthName : c.lunar.dayName}</span>
                                </div>
                                {c.holiday && <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100 whitespace-nowrap">{t(c.holiday as keyof typeof translations['zh-CN'])}</span>}
                            </div>
                            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-0.5">
                                {c.bdays.map(b => (
                                    <div key={b.id} onClick={() => onBirthdayClick(b, b.age)} className="bg-pink-100/70 text-pink-700 text-xs font-semibold p-0.5 px-1.5 rounded-md cursor-pointer hover:bg-pink-200/80 transition-colors truncate">
                                        🎂 {b.name} ({b.age}{lang === 'en' ? 'y' : t('ageSuffix')})
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </>
    );
};

export default App;