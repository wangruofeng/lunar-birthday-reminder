'use client';

import { motion } from 'framer-motion';
import { Birthday } from '@/types/birthday';
import { getHolidayName } from '@/utils/holidays';
import { Solar, Lunar } from 'lunar-javascript';

interface CalendarCellProps {
  day: number;
  isToday: boolean;
  birthdays: Birthday[];
  showHolidays: boolean;
  month: number;
  year: number;
  onClick: (day: number) => void;
}

export default function CalendarCell({
  day,
  isToday,
  birthdays,
  showHolidays,
  month,
  year,
  onClick,
}: CalendarCellProps) {
  const holidayName = showHolidays ? getHolidayName(month, day, year) : null;

  // 计算阴历日期
  const lunarDate = (() => {
    try {
      const solar = Solar.fromYmd(year, month, day);
      const lunar = solar.getLunar();
      const lunarMonth = lunar.getMonthInChinese();
      const lunarDay = lunar.getDayInChinese();
      return `${lunarMonth}月${lunarDay}`;
    } catch (error) {
      return null;
    }
  })();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(day)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`
        relative min-h-20 p-2 rounded-lg border
        ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-100'}
        hover:border-blue-200 hover:bg-gray-50 transition-all cursor-pointer
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            text-sm font-medium
            ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}
          `}
        >
          {day}
        </span>
        {isToday && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
          />
        )}
      </div>

      {/* 阴历日期 */}
      {lunarDate && (
        <div className="text-xs text-gray-400 mb-1">{lunarDate}</div>
      )}

      <div className="space-y-1">
        {birthdays.map((birthday) => (
          <motion.div
            key={birthday.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-1 text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded"
          >
            <span>🎂</span>
            <span className="truncate max-w-12">{birthday.name}</span>
          </motion.div>
        ))}

        {holidayName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center space-x-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded"
          >
            <span>🎉</span>
            <span className="truncate max-w-12">{holidayName}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
