'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Birthday } from '@/types/birthday';
import { lunarToSolar } from '@/utils/lunarToSolar';
import { addBirthday } from '@/utils/storage';

interface BirthdayFormProps {
  onAdd: (birthday: Birthday) => void;
}

export default function BirthdayForm({ onAdd }: BirthdayFormProps) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [lunarYear, setLunarYear] = useState('');
  const [lunarMonth, setLunarMonth] = useState('');
  const [lunarDay, setLunarDay] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !relationship || !lunarYear || !lunarMonth || !lunarDay) {
      alert('请填写所有字段');
      return;
    }

    const year = parseInt(lunarYear);
    const month = parseInt(lunarMonth);
    const day = parseInt(lunarDay);

    const solar = lunarToSolar(year, month, day);
    if (!solar) {
      alert('农历日期转换失败，请检查输入');
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

    // 重置表单
    setName('');
    setRelationship('');
    setLunarYear('');
    setLunarMonth('');
    setLunarDay('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3"
    >
      <h2 className="text-sm font-semibold text-gray-900 mb-2">添加生日</h2>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-0.5">
            姓名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="输入姓名"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-0.5">
            与你的关系
          </label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="如：父母、朋友、同事"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-0.5">
            农历出生日期
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={lunarYear}
              onChange={(e) => setLunarYear(e.target.value)}
              min="1900"
              max="2100"
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              placeholder="年"
            />
            <input
              type="number"
              value={lunarMonth}
              onChange={(e) => setLunarMonth(e.target.value)}
              min="1"
              max="12"
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              placeholder="月"
            />
            <input
              type="number"
              value={lunarDay}
              onChange={(e) => setLunarDay(e.target.value)}
              min="1"
              max="30"
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              placeholder="日"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          添加生日
        </motion.button>
      </form>
    </motion.div>
  );
}
