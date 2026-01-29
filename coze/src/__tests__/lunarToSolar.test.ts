import { describe, it, expect } from '@jest/globals';
import {
  lunarToSolar,
  isSameDay,
  getDaysDiff,
  isWithinNext7Days,
  formatDate,
  getNextYearBirthday,
} from '../utils/lunarToSolar';

describe('日期工具函数测试', () => {
  describe('lunarToSolar - 农历转阳历', () => {
    it('应该正确转换 2024年农历正月初一 (春节)', () => {
      const result = lunarToSolar(2024, 1, 1);
      expect(result).not.toBeNull();
      expect(result?.year).toBe(2024);
      expect(result?.month).toBe(2);
      expect(result?.day).toBe(10);
    });

    it('应该正确转换 1990年农历五月初五 (端午节)', () => {
      const result = lunarToSolar(1990, 5, 5);
      expect(result).not.toBeNull();
      expect(result?.year).toBe(1990);
      expect(result?.month).toBe(5);
      expect(result?.day).toBe(28);
    });

    it('应该正确转换 2000年农历八月十五 (中秋节)', () => {
      const result = lunarToSolar(2000, 8, 15);
      expect(result).not.toBeNull();
      expect(result?.year).toBe(2000);
      expect(result?.month).toBe(9);
      expect(result?.day).toBe(12);
    });

    it('应该正确转换闰月日期', () => {
      // 2023年闰二月
      const result = lunarToSolar(2023, 2, 1);
      expect(result).not.toBeNull();
      expect(result?.month).toBeGreaterThan(0);
    });

    it('应该处理无效日期并返回 null', () => {
      const result = lunarToSolar(2024, 13, 1); // 无效月份
      expect(result).toBeNull();
    });

    it('应该处理农历30天的月份', () => {
      // 2024年农历二月是大月,有30天
      const result = lunarToSolar(2024, 2, 30);
      expect(result).not.toBeNull();
      expect(result?.day).toBeTruthy();
    });
  });

  describe('isSameDay - 判断是否为同一天', () => {
    it('应该正确识别相同的日期', () => {
      const date1 = new Date('2024-01-15T10:30:00');
      const date2 = new Date('2024-01-15T18:45:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('应该正确识别不同的日期', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('应该正确识别不同年份的相同月日', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2025-01-15');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getDaysDiff - 计算日期差', () => {
    it('应该正确计算相邻两天的天数差', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      expect(getDaysDiff(date1, date2)).toBe(1);
    });

    it('应该正确计算同一天的天数差', () => {
      const date1 = new Date('2024-01-15T10:00:00');
      const date2 = new Date('2024-01-15T14:30:00');
      expect(getDaysDiff(date1, date2)).toBe(0);
    });

    it('应该正确计算一周的天数差', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-22');
      expect(getDaysDiff(date1, date2)).toBe(7);
    });

    it('应该正确计算跨月的天数差', () => {
      const date1 = new Date('2024-01-30');
      const date2 = new Date('2024-02-05');
      expect(getDaysDiff(date1, date2)).toBe(6);
    });

    it('应该正确计算过去日期的天数差', () => {
      const date1 = new Date('2024-01-20');
      const date2 = new Date('2024-01-15');
      expect(getDaysDiff(date1, date2)).toBe(-5);
    });
  });

  describe('isWithinNext7Days - 判断是否在未来7天内', () => {
    it('应该识别今天在7天内', () => {
      const today = new Date();
      expect(isWithinNext7Days(today)).toBe(true);
    });

    it('应该识别明天在7天内', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isWithinNext7Days(tomorrow)).toBe(true);
    });

    it('应该识别第7天在7天内', () => {
      const date = new Date();
      date.setDate(date.getDate() + 6);
      expect(isWithinNext7Days(date)).toBe(true);
    });

    it('应该识别第8天不在7天内', () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      expect(isWithinNext7Days(date)).toBe(false);
    });

    it('应该识别昨天不在7天内', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isWithinNext7Days(yesterday)).toBe(false);
    });
  });

  describe('formatDate - 格式化日期', () => {
    it('应该正确格式化完整日期', () => {
      const date = new Date('2024-01-05');
      expect(formatDate(date)).toBe('2024-01-05');
    });

    it('应该正确格式化个位数月份和日期', () => {
      const date = new Date('2024-03-08');
      expect(formatDate(date)).toBe('2024-03-08');
    });

    it('应该正确格式化双位数月份和日期', () => {
      const date = new Date('2024-12-25');
      expect(formatDate(date)).toBe('2024-12-25');
    });
  });

  describe('getNextYearBirthday - 获取下一个生日日期', () => {
    it('如果今年的生日还没过，应该返回今年的生日', () => {
      // 假设今天是 2024-01-15
      const mockToday = new Date('2024-01-15');
      const originalDate = Date.now;

      // Mock Date
      global.Date.now = () => mockToday.getTime();
      global.Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockToday.getTime());
          } else {
            super(...args);
          }
        }
      } as any;

      try {
        const result = getNextYearBirthday(2, 20); // 2月20日
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(1); // 2月
        expect(result.getDate()).toBe(20);
      } finally {
        global.Date.now = originalDate;
      }
    });

    it('如果今年的生日已经过了，应该返回明年的生日', () => {
      // 假设今天是 2024-03-15
      const mockToday = new Date('2024-03-15');
      const originalDate = Date.now;

      global.Date.now = () => mockToday.getTime();
      global.Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockToday.getTime());
          } else {
            super(...args);
          }
        }
      } as any;

      try {
        const result = getNextYearBirthday(2, 10); // 2月10日
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(1); // 2月
        expect(result.getDate()).toBe(10);
      } finally {
        global.Date.now = originalDate;
      }
    });

    it('应该正确处理12月的生日', () => {
      // 假设今天是 2024-06-15
      const mockToday = new Date('2024-06-15');
      const originalDate = Date.now;

      global.Date.now = () => mockToday.getTime();
      global.Date = class extends Date {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockToday.getTime());
          } else {
            super(...args);
          }
        }
      } as any;

      try {
        const result = getNextYearBirthday(12, 25); // 12月25日
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(11); // 12月
        expect(result.getDate()).toBe(25);
      } finally {
        global.Date.now = originalDate;
      }
    });
  });
});
