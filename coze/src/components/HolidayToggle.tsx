'use client';

import { motion } from 'framer-motion';

interface HolidayToggleProps {
  showHolidays: boolean;
  onToggle: (show: boolean) => void;
}

export default function HolidayToggle({ showHolidays, onToggle }: HolidayToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">显示节假日</h2>
          <p className="text-xs text-gray-500 mt-0.5">在日历中显示中国法定节假日</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(!showHolidays)}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-200
            ${showHolidays ? 'bg-blue-600' : 'bg-gray-300'}
          `}
        >
          <motion.div
            animate={{ x: showHolidays ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
          />
        </motion.button>
      </div>
    </motion.div>
  );
}
