import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Birthday, LangCode } from '../types';
import { solarToLunar, getHoliday, getNextSolarBirthday } from '../utils/lunar';

interface CalendarProps {
  viewDate: Date;
  birthdays: Birthday[];
  showHolidays: boolean;
  lang: LangCode;
  onViewDateChange: (date: Date) => void;
  onShowHolidaysChange: (show: boolean) => void;
  onBirthdayClick: (birthday: Birthday, age: number) => void;
  translations: {
    showHolidays: string;
    today: string;
    weekDays: string[];
  };
}

/**
 * 日历单元格数据接口
 */
interface CalendarCell {
  date: Date;
  lunar: {
    month: number;
    day: number;
    monthName: string;
    dayName: string;
    isFirstDayOfMonth: boolean;
  };
  holiday: string | null;
  bdays: Array<Birthday & { age: number }>;
}

/**
 * 日历网格组件
 */
const CalendarGrid: React.FC<{
  cells: (CalendarCell | null)[];
  onBirthdayClick: (birthday: Birthday & { age: number }) => void;
  lang: LangCode;
}> = ({ cells, lang }) => {
  return (
    <>
      {cells.map((c, i) => (
        <div
          key={i}
          className={`min-h-[95px] p-2 border-r border-b border-pink-50 flex flex-col group relative ${
            !c ? 'bg-slate-50/20' : 'hover:bg-pink-50/10'
          } ${c && c.bdays.length > 0 ? 'cursor-pointer' : ''}`}
        >
          {c && (
            <>
              <div className="flex justify-between items-start mb-1">
                <div className="flex flex-col">
                  <span
                    className={`text-base font-black w-8 h-8 flex items-center justify-center rounded-lg ${
                      c.date.toDateString() === new Date().toDateString()
                        ? 'bg-pink-500 text-white'
                        : 'text-slate-800'
                    }`}
                  >
                    {c.date.getDate()}
                  </span>
                  <span
                    className={`text-[12px] font-bold mt-0.5 leading-tight ${
                      c.lunar.isFirstDayOfMonth ? 'text-pink-500' : 'text-slate-400'
                    }`}
                  >
                    {c.lunar.isFirstDayOfMonth ? c.lunar.monthName : c.lunar.dayName}
                  </span>
                </div>
                {c.holiday && (
                  <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100 max-w-[45px] truncate">
                    {c.holiday}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar space-y-0.5">
                {c.bdays.map(b => (
                  <div
                    key={b.id}
                    className="group relative"
                    onMouseEnter={() => onBirthdayClick(b, b.age)}
                  >
                    <div className="bg-pink-100/70 text-pink-700 text-[11px] font-black p-1 px-2 rounded hover:bg-pink-200/80 transition-colors truncate">
                      🎂 {b.name} ({b.age}
                      {lang === 'en' ? 'y' : '岁'})
                    </div>
                    {/* Hover 显示的生日详情 */}
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-20 bg-slate-800 text-white text-[10px] font-black p-2 rounded-lg shadow-xl whitespace-nowrap min-w-[140px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-pink-300">{b.name}</span>
                        <span>{b.relationship}</span>
                        <span>农历 {b.lunarDate.month}/{b.lunarDate.day}</span>
                        <span>将满 {b.age}岁</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* 日期卡片 hover 弹框 - 显示该日期所有生日汇总 */}
              {c.bdays.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-30 bg-slate-800 text-white text-[11px] font-black p-3 rounded-lg shadow-2xl min-w-[180px] max-w-[220px] pointer-events-none">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-pink-300 text-xs font-black border-b border-slate-700 pb-1.5 mb-1">
                      {lang === 'en' ? '🎂 Birthdays' : '🎂 生日提醒'}
                    </div>
                    {c.bdays.map((b, idx) => (
                      <div key={b.id} className="flex flex-col gap-0.5 pb-1.5 border-b border-slate-700 last:border-0 last:pb-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-pink-300 font-black">{b.name}</span>
                          <span className="text-slate-400 text-[10px]">({b.age}{lang === 'en' ? 'y' : '岁'})</span>
                        </div>
                        <div className="text-slate-300 text-[10px]">{b.relationship}</div>
                        <div className="text-slate-400 text-[10px]">
                          {lang === 'en' ? 'Lunar' : '农历'} {b.lunarDate.month}/{b.lunarDate.day}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* 箭头指示器 */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
};

/**
 * 日历组件
 * 包含月份导航、星期标题和日期网格
 */
export const Calendar: React.FC<CalendarProps> = ({
  viewDate,
  birthdays,
  showHolidays,
  lang,
  onViewDateChange,
  onShowHolidaysChange,
  onBirthdayClick,
  translations
}) => {
  // 生成日历网格数据
  const cells = React.useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const first = new Date(y, m, 1).getDay();
    const count = new Date(y, m + 1, 0).getDate();
    const res: (CalendarCell | null)[] = [];

    // 填充月初空白
    for (let i = 0; i < first; i++) res.push(null);

    // 填充日期
    for (let i = 1; i <= count; i++) {
      const date = new Date(y, m, i);
      const lunar = solarToLunar(date);
      const holiday = showHolidays ? getHoliday(date) : null;

      // 查找该日期的生日
      const bdays = birthdays
        .map(b => {
          const s = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
          const age = s.getFullYear() - b.lunarDate.year;
          return b.lunarDate.month === lunar.month && b.lunarDate.day === lunar.day
            ? { ...b, age }
            : null;
        })
        .filter(Boolean) as Array<Birthday & { age: number }>;

      res.push({ date, lunar, holiday, bdays });
    }

    return res;
  }, [viewDate, birthdays, showHolidays]);

  return (
    <section className="bg-white rounded-[3rem] p-5 cute-shadow border-4 border-white min-h-[480px]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-2xl font-black text-slate-800">
          {lang === 'en'
            ? viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
            : `${viewDate.getFullYear()} 年 ${viewDate.getMonth() + 1} 月`}
        </h2>
        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={showHolidays}
              onChange={e => onShowHolidaysChange(e.target.checked)}
              className="rounded text-pink-500"
            />
            {translations.showHolidays}
          </label>
          <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200">
            <button
              onClick={() => onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="p-1.5 hover:bg-white rounded-full transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onViewDateChange(new Date())}
              className="px-3 text-xs font-black"
            >
              {translations.today}
            </button>
            <button
              onClick={() => onViewDateChange(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="p-1.5 hover:bg-white rounded-full transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl">
        <div className="calendar-grid min-w-[800px] border-l border-t border-pink-50">
          {translations.weekDays.map(d => (
            <div
              key={d}
              className="py-2 text-center text-[11px] font-black text-pink-300 uppercase bg-pink-50/10 border-r border-b border-pink-50"
            >
              {d}
            </div>
          ))}
          <CalendarGrid
            cells={cells}
            onBirthdayClick={onBirthdayClick}
            lang={lang}
          />
        </div>
      </div>
    </section>
  );
};
