'use client';

import { Birthday } from '@/types/birthday';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteBirthday } from '@/utils/storage';

interface BirthdayListProps {
  birthdays: Birthday[];
  onDelete: (id: string) => void;
  onBirthdayClick?: (birthday: Birthday) => void;
}

export default function BirthdayList({ birthdays, onDelete, onBirthdayClick }: BirthdayListProps) {
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个生日吗？')) {
      deleteBirthday(id);
      onDelete(id);
    }
  };

  const handleBirthdayClick = (birthday: Birthday) => {
    if (onBirthdayClick) {
      onBirthdayClick(birthday);
    }
  };

  if (birthdays.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500"
      >
        <p>还没有添加任何生日</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <h2 className="text-base font-semibold text-gray-900 mb-3">生日列表</h2>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {birthdays.map((birthday) => {
            // 参考 cursor 项目：直接在 map 中计算，简单高效
            const today = new Date();
            const currentYear = today.getFullYear();

            // 计算今年的生日日期
            let thisYearBirthdayYear: number;
            const thisYearDate = new Date(currentYear, birthday.solarMonth - 1, birthday.solarDay);
            const todayDate = new Date(currentYear, today.getMonth(), today.getDate());

            if (thisYearDate >= todayDate) {
              thisYearBirthdayYear = currentYear;
            } else {
              thisYearBirthdayYear = currentYear + 1;
            }

            const thisYearBirthdayText = `${thisYearBirthdayYear}年${birthday.solarMonth}月${birthday.solarDay}日`;

            return (
              <motion.div
                key={birthday.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleBirthdayClick(birthday)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🎂</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-base truncate">{birthday.name}</h3>
                      <span className="text-sm text-gray-600 flex-shrink-0">{birthday.relationship}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        农历{birthday.lunarMonth}月{birthday.lunarDay}日
                      </span>
                      <span className="text-gray-400">
                        {thisYearBirthdayText}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(birthday.id);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors p-1.5 flex-shrink-0"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
