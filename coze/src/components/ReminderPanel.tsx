'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Birthday } from '@/types/birthday';
import { Lunar, Solar } from 'lunar-javascript';

interface ReminderPanelProps {
  birthdays: Birthday[];
  showReminders?: boolean;
  onToggle?: (show: boolean) => void;
  daysToLookAhead?: number;
  onDaysChange?: (days: number) => void;
}

interface UpcomingBirthday extends Birthday {
  daysUntil: number;
  solarDate: Date;
}

export default function ReminderPanel({ birthdays, showReminders: externalShowReminders, onToggle, daysToLookAhead = 7, onDaysChange }: ReminderPanelProps) {
  const [internalShowReminders, setInternalShowReminders] = useState(false);

  // 优先使用外部传入的状态，如果没有则使用内部状态
  const showReminders = externalShowReminders !== undefined ? externalShowReminders : internalShowReminders;
  const toggleReminders = onToggle || setInternalShowReminders;

  const getUpcomingBirthdays = (): UpcomingBirthday[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentYear = today.getFullYear();
    const upcoming: UpcomingBirthday[] = [];

    // 辅助函数：根据农历日期查找对应的阳历日期
    const findSolarByLunar = (year: number, lunarMonth: number, lunarDay: number): Date | null => {
      // 从1月1日开始遍历
      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 31; day++) {
          try {
            const solar = Solar.fromYmd(year, month, day);
            const lunar = solar.getLunar();

            if (lunar.getMonth() === lunarMonth && lunar.getDay() === lunarDay) {
              return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
            }
          } catch (e) {
            // 日期不存在，跳过
            continue;
          }
        }
      }
      return null;
    };

    birthdays.forEach((birthday) => {
      // 根据农历生日（lunarMonth, lunarDay）计算今年的阳历日期
      let solarDate = findSolarByLunar(currentYear, birthday.lunarMonth, birthday.lunarDay);

      // 如果今年没有找到这个农历日期，或者已经过了，则使用明年的
      if (!solarDate || solarDate < today) {
        const nextSolarDate = findSolarByLunar(currentYear + 1, birthday.lunarMonth, birthday.lunarDay);
        if (nextSolarDate) {
          solarDate = nextSolarDate;
        }
      }

      if (solarDate) {
        // 计算距离今天的天数
        const daysUntil = Math.floor((solarDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // 未来N天内（含今天）
        if (daysUntil >= 0 && daysUntil <= daysToLookAhead) {
          upcoming.push({
            ...birthday,
            daysUntil,
            solarDate,
          });
        }
      }
    });

    // 按天数排序
    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-semibold text-gray-900">近期提醒</h2>
          <div className="flex items-center space-x-3">
            <select
              value={daysToLookAhead}
              onChange={(e) => onDaysChange?.(parseInt(e.target.value))}
              className="text-xs font-medium border border-gray-200 rounded pl-0 pr-10 py-1 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[5.5rem] box-border"
            >
              <option value="3">3天</option>
              <option value="7">7天</option>
              <option value="14">14天</option>
              <option value="30">30天</option>
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleReminders(!showReminders)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
        >
          {showReminders ? '隐藏' : '查看提醒'}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {showReminders && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {upcomingBirthdays.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4 text-gray-500"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl mb-1"
                >
                  ✨
                </motion.div>
                <p className="text-sm">未来{daysToLookAhead}天内没有人过生日</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {upcomingBirthdays.map((birthday, index) => (
                  <motion.div
                    key={birthday.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-2xl"
                      >
                        🎂
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">{birthday.name}</h3>
                        <p className="text-sm text-gray-600">
                          {birthday.relationship}
                        </p>
                        <p className="text-xs text-gray-500">
                          农历{birthday.lunarMonth}月{birthday.lunarDay}日
                          {' · '}
                          阳历{birthday.solarDate.getFullYear()}年{birthday.solarDate.getMonth() + 1}月{birthday.solarDate.getDate()}日
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {birthday.daysUntil === 0 ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-block px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-medium"
                        >
                          今天！
                        </motion.span>
                      ) : birthday.daysUntil === 1 ? (
                        <span className="inline-block px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs font-medium">
                          明天
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-medium">
                          还有 {birthday.daysUntil} 天
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!showReminders && upcomingBirthdays.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-3 text-blue-600 font-medium text-sm"
        >
          {upcomingBirthdays.length} 人即将过生日
        </motion.div>
      )}
    </motion.div>
  );
}
