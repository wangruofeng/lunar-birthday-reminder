import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  lunarBirthdayToNextSolar,
  lunarToSolar,
  solarToLunar,
  daysBetween,
  startOfDay,
  getMonthMatrix,
  getHolidayName,
} from './date';

describe('日期工具函数测试', () => {
  describe('startOfDay', () => {
    it('应该将日期时间重置为当天 00:00:00', () => {
      const date = new Date('2025-01-29T15:30:45.123');
      const result = startOfDay(date);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('应该保留原始日期的年月日', () => {
      const date = new Date('2025-01-29T23:59:59.999');
      const result = startOfDay(date);

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // 0 = 一月
      expect(result.getDate()).toBe(29);
    });

    it('不应该修改原始日期对象', () => {
      const originalDate = new Date('2025-01-29T15:30:45');
      const originalHours = originalDate.getHours();
      startOfDay(originalDate);

      expect(originalDate.getHours()).toBe(originalHours);
    });

    it('处理边界情况：月末最后一天', () => {
      const date = new Date('2025-01-31T23:59:59');
      const result = startOfDay(date);

      expect(result.getDate()).toBe(31);
      expect(result.getHours()).toBe(0);
    });
  });

  describe('daysBetween', () => {
    it('应该正确计算两个日期之间的天数（dateA 在前，dateB 在后）', () => {
      const date1 = new Date('2025-01-29');
      const date2 = new Date('2025-02-05');
      const result = daysBetween(date1, date2);

      expect(result).toBe(7);
    });

    it('同一天应该返回 0', () => {
      const date1 = new Date('2025-01-29T10:00:00');
      const date2 = new Date('2025-01-29T18:30:00');
      const result = daysBetween(date1, date2);

      expect(result).toBe(0);
    });

    it('应该忽略时间差异，只比较日期', () => {
      const date1 = new Date('2025-01-29T23:59:59');
      const date2 = new Date('2025-01-30T00:00:01');
      const result = daysBetween(date1, date2);

      expect(result).toBe(1);
    });

    it('过去日期应该返回负数', () => {
      const date1 = new Date('2025-02-05');
      const date2 = new Date('2025-01-29');
      const result = daysBetween(date1, date2);

      expect(result).toBe(-7);
    });

    it('跨年计算应该正确', () => {
      const date1 = new Date('2024-12-31');
      const date2 = new Date('2025-01-01');
      const result = daysBetween(date1, date2);

      expect(result).toBe(1);
    });

    it('跨月计算应该正确', () => {
      const date1 = new Date('2025-01-31');
      const date2 = new Date('2025-02-01');
      const result = daysBetween(date1, date2);

      expect(result).toBe(1);
    });
  });

  describe('lunarToSolar', () => {
    it('应该正确转换农历正月初一为公历（2025年春节）', () => {
      const result = lunarToSolar(2025, 1, 1);

      expect(result).not.toBeNull();
      expect(result?.year).toBe(2025);
      expect(result?.month).toBe(1);
      expect(result?.day).toBe(29);
    });

    it('应该正确转换农历五月初五为公历（2025年端午节）', () => {
      const result = lunarToSolar(2025, 5, 5);

      expect(result).not.toBeNull();
      expect(result?.year).toBe(2025);
      expect(result?.month).toBe(5);
      expect(result?.day).toBe(31);
    });

    it('应该正确转换其他年份的春节', () => {
      const result2024 = lunarToSolar(2024, 1, 1);
      expect(result2024).toMatchObject({ year: 2024, month: 2, day: 10 });

      const result2026 = lunarToSolar(2026, 1, 1);
      expect(result2026).toMatchObject({ year: 2026, month: 2, day: 17 });
    });

    it('应该处理无效的农历日期（不存在的月份）', () => {
      const result = lunarToSolar(2025, 13, 1);

      expect(result).toBeNull();
    });

    it('应该处理完全无效的农历日期', () => {
      // 测试明显无效的日期
      const result = lunarToSolar(2025, 13, 1); // 不存在的月份
      expect(result).toBeNull();
    });
  });

  describe('solarToLunar', () => {
    it('应该正确转换公历为农历（2025年春节）', () => {
      const date = new Date(2025, 0, 29); // 2025年1月29日
      const result = solarToLunar(date);

      expect(result).not.toBeNull();
      expect(result?.monthCn).toBeTruthy();
      expect(result?.dayCn).toBeTruthy();
    });

    it('应该返回农历日期的中文表示', () => {
      const date = new Date(2025, 0, 29);
      const result = solarToLunar(date);

      expect(result?.monthCn).toContain('月');
      expect(result?.dayCn).toMatch(/初|十|廿/);
    });

    it('应该转换普通日期为农历', () => {
      const date = new Date(2025, 4, 31); // 2025年5月31日
      const result = solarToLunar(date);

      expect(result).not.toBeNull();
      expect(result?.monthCn).toBe('五月');
      expect(result?.dayCn).toBe('初五');
    });
  });

  describe('lunarBirthdayToNextSolar', () => {
    it('应该计算未来最近的农历生日对应的公历日期', () => {
      const today = new Date(2025, 0, 1); // 2025年1月1日
      const result = lunarBirthdayToNextSolar({ lunarMonth: 1, lunarDay: 1 }, today);

      expect(result).not.toBeNull();
      expect(result?.getFullYear()).toBe(2025);
      expect(result?.getMonth()).toBe(0); // 1月
      expect(result?.getDate()).toBe(29); // 1月29日
    });

    it('如果今年的生日已过，应该返回明年的生日', () => {
      const today = new Date(2025, 1, 1); // 2025年2月1日（春节1月29日已过）
      const result = lunarBirthdayToNextSolar({ lunarMonth: 1, lunarDay: 1 }, today);

      expect(result).not.toBeNull();
      expect(result?.getFullYear()).toBeGreaterThan(2025);
    });

    it('今天应该是生日当天', () => {
      const today = new Date(2025, 0, 29); // 2025年1月29日是农历正月初一
      const result = lunarBirthdayToNextSolar({ lunarMonth: 1, lunarDay: 1 }, today);

      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(29);
      expect(result?.getMonth()).toBe(0);
    });

    it('应该正确计算当年剩余天数为0的情况', () => {
      const today = new Date(2025, 0, 29); // 春节当天
      const result = lunarBirthdayToNextSolar({ lunarMonth: 1, lunarDay: 1 }, today);

      expect(result).not.toBeNull();
      const daysDiff = daysBetween(today, result);
      expect(daysDiff).toBe(0);
    });
  });

  describe('getMonthMatrix', () => {
    it('应该返回42个日期单元格（6行 x 7列）', () => {
      const matrix = getMonthMatrix(2025, 0); // 2025年1月

      expect(matrix).toHaveLength(42);
    });

    it('应该正确标记当前月的日期（31天的大月）', () => {
      const matrix = getMonthMatrix(2025, 0); // 2025年1月
      const januaryDays = matrix.filter(cell => cell.inCurrentMonth);

      expect(januaryDays).toHaveLength(31);
    });

    it('应该正确标记当前月的日期（30天的小月）', () => {
      const matrix = getMonthMatrix(2025, 3); // 2025年4月
      const aprilDays = matrix.filter(cell => cell.inCurrentMonth);

      expect(aprilDays).toHaveLength(30);
    });

    it('应该正确标记闰年的2月（29天）', () => {
      const matrix = getMonthMatrix(2024, 1); // 2024年2月
      const februaryDays = matrix.filter(cell => cell.inCurrentMonth);

      expect(februaryDays).toHaveLength(29);
    });

    it('应该正确标记平年的2月（28天）', () => {
      const matrix = getMonthMatrix(2025, 1); // 2025年2月
      const februaryDays = matrix.filter(cell => cell.inCurrentMonth);

      expect(februaryDays).toHaveLength(28);
    });

    it('第一天应该在正确的位置（2025年1月1日是星期三）', () => {
      const matrix = getMonthMatrix(2025, 0);
      const firstDayIndex = matrix.findIndex(cell => {
        return cell.date.getFullYear() === 2025 &&
               cell.date.getMonth() === 0 &&
               cell.date.getDate() === 1;
      });

      // 星期三是索引3（0=周日, 1=周一, 2=周二, 3=周三）
      expect(firstDayIndex).toBe(3);
    });

    it('当前月的日期应该是正确的日期值', () => {
      const matrix = getMonthMatrix(2025, 0);
      const januaryDays = matrix.filter(cell => cell.inCurrentMonth);

      expect(januaryDays[0].date.getDate()).toBe(1);
      expect(januaryDays[30].date.getDate()).toBe(31);
    });

    it('应该正确填充上个月的日期', () => {
      const matrix = getMonthMatrix(2025, 0);
      const prevMonthDays = matrix.filter(cell => !cell.inCurrentMonth && cell.date.getMonth() === 11);

      // 2025年1月前3个位置应该是2024年12月的天数
      expect(prevMonthDays.length).toBeGreaterThan(0);
    });

    it('应该正确填充下个月的日期', () => {
      const matrix = getMonthMatrix(2025, 0);
      const nextMonthDays = matrix.filter(cell => !cell.inCurrentMonth && cell.date.getMonth() === 1);

      // 2025年1月后应该有一些2月的天数
      expect(nextMonthDays.length).toBeGreaterThan(0);
    });
  });

  describe('getHolidayName', () => {
    describe('固定节假日', () => {
      it('应该识别元旦（1月1日）', () => {
        const date = new Date(2025, 0, 1);
        const result = getHolidayName(date);

        expect(result).toBe('元旦');
      });

      it('应该识别劳动节（5月1日）', () => {
        const date = new Date(2025, 4, 1);
        const result = getHolidayName(date);

        expect(result).toBe('劳动节');
      });

      it('应该识别国庆节（10月1日）', () => {
        const date = new Date(2025, 9, 1);
        const result = getHolidayName(date);

        expect(result).toBe('国庆节');
      });

      it('应该识别国庆节假期（10月2日）', () => {
        const date = new Date(2025, 9, 2);
        const result = getHolidayName(date);

        expect(result).toBe('国庆节');
      });

      it('应该识别国庆节假期（10月3日）', () => {
        const date = new Date(2025, 9, 3);
        const result = getHolidayName(date);

        expect(result).toBe('国庆节');
      });

      it('2025年10月4日应该不是国庆节', () => {
        const date = new Date(2025, 9, 4);
        const result = getHolidayName(date);

        expect(result).toBeNull();
      });
    });

    describe('2026年法定节假日', () => {
      it('应该识别2026年元旦假期（1月1日-1月3日）', () => {
        for (let day = 1; day <= 3; day++) {
          const date = new Date(2026, 0, day);
          const result = getHolidayName(date);
          expect(result).toBe('元旦');
        }
      });

      it('应该识别2026年清明节假期（4月4日-4月6日）', () => {
        for (let day = 4; day <= 6; day++) {
          const date = new Date(2026, 3, day);
          const result = getHolidayName(date);
          expect(result).toBe('清明节');
        }
      });

      it('应该识别2026年劳动节假期（5月1日-5月5日）', () => {
        for (let day = 1; day <= 5; day++) {
          const date = new Date(2026, 4, day);
          const result = getHolidayName(date);
          expect(result).toBe('劳动节');
        }
      });

      it('应该识别2026年端午节假期（6月19日-6月21日）', () => {
        for (let day = 19; day <= 21; day++) {
          const date = new Date(2026, 5, day);
          const result = getHolidayName(date);
          expect(result).toBe('端午节');
        }
      });

      it('应该识别2026年中秋节假期（9月25日-9月27日）', () => {
        for (let day = 25; day <= 27; day++) {
          const date = new Date(2026, 8, day);
          const result = getHolidayName(date);
          expect(result).toBe('中秋节');
        }
      });

      it('应该识别2026年国庆节假期（10月1日-10月7日）', () => {
        for (let day = 1; day <= 7; day++) {
          const date = new Date(2026, 9, day);
          const result = getHolidayName(date);
          expect(result).toBe('国庆节');
        }
      });
    });

    describe('春节（农历）', () => {
      it('应该识别2024年春节（2月10日）', () => {
        const date = new Date(2024, 1, 10);
        const result = getHolidayName(date);

        expect(result).toBe('春节');
      });

      it('应该识别2025年春节（1月29日）', () => {
        const date = new Date(2025, 0, 29);
        const result = getHolidayName(date);

        expect(result).toBe('春节');
      });

      it('应该识别2026年春节（2月15日）', () => {
        const date = new Date(2026, 1, 15);
        const result = getHolidayName(date);

        expect(result).toBe('春节');
      });

      it('应该识别2026年春节假期（2月15日-2月23日）', () => {
        // 测试整个春节假期范围
        for (let day = 15; day <= 23; day++) {
          const date = new Date(2026, 1, day);
          const result = getHolidayName(date);
          expect(result).toBe('春节');
        }
      });

      it('应该识别2027年春节（2月7日）', () => {
        const date = new Date(2027, 1, 7);
        const result = getHolidayName(date);

        expect(result).toBe('春节');
      });
    });

    describe('普通日期', () => {
      it('普通工作日应该返回null', () => {
        const date = new Date(2025, 0, 15);
        const result = getHolidayName(date);

        expect(result).toBeNull();
      });

      it('周末不一定是节假日应该返回null', () => {
        const date = new Date(2025, 0, 4); // 2025年1月4日是周六
        const result = getHolidayName(date);

        expect(result).toBeNull();
      });
    });

    describe('未配置的年份', () => {
      it('未配置年份的春节应该返回null', () => {
        const date = new Date(2030, 1, 10);
        const result = getHolidayName(date);

        expect(result).toBeNull();
      });
    });
  });
});
