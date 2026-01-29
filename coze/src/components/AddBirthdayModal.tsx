'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Birthday } from '@/types/birthday';
import { lunarToSolar } from '@/utils/lunarToSolar';
import { addBirthday } from '@/utils/storage';

interface AddBirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (birthday: Birthday) => void;
}

export default function AddBirthdayModal({
  isOpen,
  onClose,
  onAdd,
}: AddBirthdayModalProps) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [lunarYear, setLunarYear] = useState('');
  const [lunarMonth, setLunarMonth] = useState('');
  const [lunarDay, setLunarDay] = useState('');
  const [error, setError] = useState('');

  // 重置表单当弹框打开时
  useEffect(() => {
    if (isOpen) {
      setName('');
      setRelationship('');
      setLunarYear('');
      setLunarMonth('');
      setLunarDay('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !relationship || !lunarYear || !lunarMonth || !lunarDay) {
      setError('请填写所有字段');
      return;
    }

    const year = parseInt(lunarYear);
    const month = parseInt(lunarMonth);
    const day = parseInt(lunarDay);

    // 验证年份范围
    if (year < 1900 || year > 2100) {
      setError('年份请在 1900-2100 之间');
      return;
    }

    // 验证月份范围
    if (month < 1 || month > 12) {
      setError('月份请在 1-12 之间');
      return;
    }

    // 验证日期范围
    if (day < 1 || day > 30) {
      setError('日期请在 1-30 之间');
      return;
    }

    const solar = lunarToSolar(year, month, day);
    if (!solar) {
      setError('农历日期转换失败，请检查输入');
      return;
    }

    const newBirthday = addBirthday({
      name,
      relationship,
      lunarYear: year,
      lunarMonth: month,
      lunarDay: day,
      solarMonth: solar.month,
      solarDay: solar.day,
    });

    onAdd(newBirthday);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* 弹窗内容 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* 头部 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">🎂</span>
                    <div>
                      <h2 className="text-2xl font-bold">添加生日</h2>
                      <p className="text-blue-100 text-sm mt-1">
                        记录亲友的农历生日
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* 表单内容 */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* 错误提示 */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 姓名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="请输入姓名"
                    autoFocus
                  />
                </div>

                {/* 关系 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    与你的关系 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="如：父母、朋友、同事"
                  />
                </div>

                {/* 农历出生日期 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    农历出生日期 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input
                        type="number"
                        value={lunarYear}
                        onChange={(e) => setLunarYear(e.target.value)}
                        min="1900"
                        max="2100"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center"
                        placeholder="年"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">年份</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={lunarMonth}
                        onChange={(e) => setLunarMonth(e.target.value)}
                        min="1"
                        max="12"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center"
                        placeholder="月"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">月份</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={lunarDay}
                        onChange={(e) => setLunarDay(e.target.value)}
                        min="1"
                        max="30"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center"
                        placeholder="日"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">日期</p>
                    </div>
                  </div>
                </div>

                {/* 提示信息 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <div className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>
                      系统会自动将农历转换为阳历，并在日历中显示提醒
                    </p>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex space-x-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    添加
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
