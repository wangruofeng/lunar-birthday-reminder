'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Birthday } from '@/types/birthday';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthdays: Birthday[];
  date: Date;
}

export default function BirthdayModal({
  isOpen,
  onClose,
  birthdays,
  date,
}: BirthdayModalProps) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 计算年龄
  const getAge = (birthYear: number): number => {
    return year - birthYear;
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
                  <div>
                    <h2 className="text-2xl font-bold">生日记</h2>
                    <p className="text-blue-100 mt-1">
                      {month}月{day}日 · {year}年
                    </p>
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

              {/* 内容 */}
              <div className="p-6">
                {birthdays.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-3">🎉</div>
                    <p>今天没有人过生日</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {birthdays.map((birthday, index) => (
                      <motion.div
                        key={birthday.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100"
                      >
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ delay: index * 0.2, duration: 0.6 }}
                          className="text-4xl"
                        >
                          🎂
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {birthday.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {birthday.relationship}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="text-gray-500">
                              出生：{birthday.lunarYear}年（农历{birthday.lunarMonth}月{birthday.lunarDay}日）
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-pink-600">
                            {getAge(birthday.lunarYear)}
                          </div>
                          <div className="text-sm text-gray-500">岁</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* 底部 */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  关闭
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
