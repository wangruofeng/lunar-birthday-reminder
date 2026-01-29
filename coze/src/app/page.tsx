'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Birthday } from '@/types/birthday';
import { getBirthdays } from '@/utils/storage';
import AddBirthdayModal from '@/components/AddBirthdayModal';
import BirthdayList from '@/components/BirthdayList';
import ReminderPanel from '@/components/ReminderPanel';
import Calendar from '@/components/Calendar';

export default function BirthdayReminderApp() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [showHolidays, setShowHolidays] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [daysToLookAhead, setDaysToLookAhead] = useState(7);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 从 localStorage 加载数据
  useEffect(() => {
    const loaded = getBirthdays();
    setBirthdays(loaded);
  }, []);

  const handleAddBirthday = (birthday: Birthday) => {
    setBirthdays([...birthdays, birthday]);
  };

  const handleDeleteBirthday = (id: string) => {
    setBirthdays(birthdays.filter((b) => b.id !== id));
  };

  const handleToggleHolidays = (show: boolean) => {
    setShowHolidays(show);
  };

  const handleToggleReminders = (show?: boolean) => {
    if (show !== undefined) {
      setShowReminders(show);
    } else {
      setShowReminders(true);
    }
  };

  const handleDaysChange = (days: number) => {
    setDaysToLookAhead(days);
    setShowReminders(true); // 切换天数时自动展开提醒
  };

  // 处理点击生日，跳转到对应月份
  const handleBirthdayClick = (birthday: Birthday) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    // 先尝试使用保存的阳历月份
    // 如果这个月份已经过了（今天之后），则计算明年
    let targetMonth = birthday.solarMonth;
    let targetYear = currentYear;

    const solarDateThisYear = new Date(currentYear, targetMonth - 1, birthday.solarDay);
    const todayDate = new Date(currentYear, today.getMonth(), today.getDate());

    // 如果今年的生日已经过了，则使用明年的
    if (solarDateThisYear < todayDate) {
      targetYear = currentYear + 1;
    }

    // 跳转到对应月份
    setCurrentDate(new Date(targetYear, targetMonth - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">🎂</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">生日记</h1>
              <p className="text-sm text-gray-600">亲友生日不忘，重要时刻不错过</p>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* 左侧：提醒面板和列表 */}
          <div className="lg:col-span-1 space-y-4">
            <ReminderPanel
              birthdays={birthdays}
              showReminders={showReminders}
              onToggle={handleToggleReminders}
              daysToLookAhead={daysToLookAhead}
              onDaysChange={handleDaysChange}
            />

            {/* 添加生日按钮 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>添加生日</span>
              </motion.button>
            </motion.div>

            <BirthdayList
              birthdays={birthdays}
              onDelete={handleDeleteBirthday}
              onBirthdayClick={handleBirthdayClick}
            />
          </div>

          {/* 右侧：日历 */}
          <div className="lg:col-span-2">
            <Calendar
              birthdays={birthdays}
              showHolidays={showHolidays}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onToggleHolidays={handleToggleHolidays}
              onToggleReminders={() => handleToggleReminders()}
            />
          </div>
        </div>
      </main>

      {/* 添加生日弹框 */}
      <AddBirthdayModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBirthday}
      />

      {/* 页脚 */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>生日记 · 亲友生日不忘</p>
        </div>
      </footer>
    </div>
  );
}
