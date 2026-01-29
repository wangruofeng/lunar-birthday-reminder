import { Birthday } from '@/types/birthday';

const STORAGE_KEY = 'birthday_reminder_data';

/**
 * 从 localStorage 获取生日数据
 */
export function getBirthdays(): Birthday[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('读取生日数据失败:', error);
    return [];
  }
}

/**
 * 保存生日数据到 localStorage
 */
export function saveBirthdays(birthdays: Birthday[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
  } catch (error) {
    console.error('保存生日数据失败:', error);
  }
}

/**
 * 添加新生日
 */
export function addBirthday(birthday: Omit<Birthday, 'id' | 'createdAt'>): Birthday {
  const birthdays = getBirthdays();
  const newBirthday: Birthday = {
    ...birthday,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  birthdays.push(newBirthday);
  saveBirthdays(birthdays);
  return newBirthday;
}

/**
 * 删除生日
 */
export function deleteBirthday(id: string): void {
  const birthdays = getBirthdays();
  const filtered = birthdays.filter(b => b.id !== id);
  saveBirthdays(filtered);
}

/**
 * 更新生日
 */
export function updateBirthday(id: string, updates: Partial<Birthday>): void {
  const birthdays = getBirthdays();
  const index = birthdays.findIndex(b => b.id === id);
  if (index !== -1) {
    birthdays[index] = { ...birthdays[index], ...updates };
    saveBirthdays(birthdays);
  }
}
