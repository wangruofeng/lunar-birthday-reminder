import React, { useState, useEffect, useCallback } from 'react';
import { Birthday, UpcomingBirthday } from '../types';
import { getNextSolarBirthday } from '../utils/lunar';

/**
 * 生日数据管理 Hook
 * 负责生日的增删改查和本地存储
 */
export const useBirthdays = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    try {
      const saved = localStorage.getItem('birthdays');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [reminders, setReminders] = useState<(UpcomingBirthday & { age: number })[]>([]);

  // 计算即将到来的生日提醒
  const calculateReminders = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = today.getTime();

    const upcoming = birthdays.map(b => {
      const solar = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
      const diff = Math.ceil((solar.getTime() - startOfToday) / (1000 * 60 * 60 * 24));
      const age = solar.getFullYear() - b.lunarDate.year;
      return { ...b, solarDate: solar, daysRemaining: diff, age };
    }).filter(b => b.daysRemaining >= 0 && b.daysRemaining <= 14)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    setReminders(upcoming);
  }, [birthdays]);

  // 保存到本地存储并重新计算提醒
  useEffect(() => {
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
    calculateReminders();
  }, [birthdays, calculateReminders]);

  // 添加生日
  const addBirthday = (name: string, relationship: string, year: number, month: number, day: number) => {
    const newBday: Birthday = {
      id: crypto.randomUUID(),
      name,
      relationship,
      lunarDate: { year, month, day }
    };
    setBirthdays(prev => [...prev, newBday]);
  };

  // 删除生日
  const deleteBirthday = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  return {
    birthdays,
    reminders,
    addBirthday,
    deleteBirthday,
    calculateReminders
  };
};
