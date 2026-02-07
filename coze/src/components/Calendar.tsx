'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Birthday } from '@/types/birthday';
import CalendarCell from './CalendarCell';
import BirthdayModal from './BirthdayModal';
import { isSameDay } from '@/utils/lunarToSolar';
import { Solar, Lunar } from 'lunar-javascript';

interface CalendarProps {
  birthdays: Birthday[];
  showHolidays: boolean;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  onToggleHolidays?: (show: boolean) => void;
  onToggleReminders?: () => void;
}

export default function Calendar({ birthdays, showHolidays, currentDate: externalDate, onDateChange, onToggleHolidays, onToggleReminders }: CalendarProps) {
  const [internalDate, setInternalDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBirthdays, setSelectedBirthdays] = useState<Birthday[]>([]);

  // 使用外部传入的日期，如果没有则使用内部状态
  const currentDate = externalDate || internalDate;
  const setCurrentDate = onDateChange || setInternalDate;

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 获取当月第一天是星期几（0-6，0是周日）
  const firstDay = new Date(year, month, 1).getDay();
  // 获取当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // 处理点击日期单元格
  const handleCellClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    const dayBirthdays = getBirthdaysForDay(day);

    setSelectedDate(clickedDate);
    setSelectedBirthdays(dayBirthdays);
    setModalOpen(true);
  };

  // 获取某一天有生日的列表（按照农历匹配）
  const getBirthdaysForDay = (day: number): Birthday[] => {
    // 将阳历日期转换为农历日期
    const solar = Solar.fromYmd(year, month + 1, day);
    const lunar = solar.getLunar();
    const lunarMonth = lunar.getMonth();
    const lunarDay = lunar.getDay();

    // 查找农历生日匹配的人
    return birthdays.filter((birthday) => {
      return birthday.lunarMonth === lunarMonth && birthday.lunarDay === lunarDay;
    });
  };

  // 获取空白天数（月初的空白格子，周日为第一天）
  const emptyDays = firstDay;

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      onMouseEnter={() => onToggleReminders && onToggleReminders()}
    >
      {/* 头部导航 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {year}年 {month + 1}月
        </h2>
        <div className="flex items-center space-x-2">
          {/* 节假日开关 */}
          <div className="flex items-center space-x-2 pr-2 border-r border-gray-300">
            <span className="text-sm text-gray-600">节假日</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleHolidays && onToggleHolidays(!showHolidays)}
              className={`
                relative w-10 h-5 rounded-full transition-colors duration-200
                ${showHolidays ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            >
              <motion.div
                animate={{ x: showHolidays ? 16 : 2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md"
              />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousMonth}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            上一月
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToday}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
          >
            今天
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextMonth}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            下一月
          </motion.button>
        </div>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-2">
        {/* 空白天数 */}
        {Array.from({ length: emptyDays }).map((_, index) => (
          <div key={`empty-${index}`} className="min-h-16" />
        ))}

        {/* 日期格子 */}
        <AnimatePresence mode="popLayout">
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const cellDate = new Date(year, month, day);
            const isToday = isSameDay(cellDate, today);
            const dayBirthdays = getBirthdaysForDay(day);

            return (
              <motion.div
                key={`${year}-${month}-${day}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarCell
                  day={day}
                  isToday={isToday}
                  birthdays={dayBirthdays}
                  showHolidays={showHolidays}
                  month={month + 1}
                  year={year}
                  onClick={handleCellClick}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 生日详情弹窗 */}
      {selectedDate && (
        <BirthdayModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          birthdays={selectedBirthdays}
          date={selectedDate}
        />
      )}
    </motion.div>
  );
}
