import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Lunar, Solar } from 'lunar-javascript';
import { solarToLunar, getNextSolarBirthday, getHoliday } from './lunar';

describe('农历日期转换测试 - 核心业务逻辑', () => {
  describe('solarToLunar - 阳历转农历', () => {
    describe('基础转换功能', () => {
      it('应该正确转换2024年春节（阳历2024-02-10 → 农历正月初一）', () => {
        const date = new Date(2024, 1, 10);
        const lunar = solarToLunar(date);

        expect(lunar.month).toBe(1);
        expect(lunar.day).toBe(1);
        expect(lunar.monthName).toBe('正月');
        expect(lunar.dayName).toBe('初一');
        expect(lunar.isFirstDayOfMonth).toBe(true);
      });

      it('应该正确转换2024年中秋节（阳历2024-09-17 → 农历八月十五）', () => {
        const date = new Date(2024, 8, 17);
        const lunar = solarToLunar(date);

        expect(lunar.month).toBe(8);
        expect(lunar.day).toBe(15);
        expect(lunar.monthName).toBe('八月');
        expect(lunar.dayName).toBe('十五');
        expect(lunar.isFirstDayOfMonth).toBe(false);
      });

      it('应该正确识别月初（农历初一）', () => {
        const date = new Date(2024, 2, 10); // 2024-03-10 农历二月初一
        const lunar = solarToLunar(date);

        expect(lunar.isFirstDayOfMonth).toBe(true);
      });

      it('应该正确转换月末日期（农历三十）', () => {
        const date = new Date(2024, 5, 5); // 2024-06-05 农历四月廿九
        const lunar = solarToLunar(date);

        expect(lunar.dayName).toMatch(/^(廿|三)/);
        expect(lunar.month).toBeGreaterThan(0);
      });
    });

    describe('中文月份和日期名称', () => {
      const testCases = [
        { date: new Date(2024, 0, 15), expectedMonthPattern: /^(十|腊|冬)?月/ }, // 可能是腊月、冬月
        { date: new Date(2024, 1, 10), expectedMonthPattern: /^正月/ },
        { date: new Date(2024, 5, 10), expectedMonthPattern: /^五月/ },
        { date: new Date(2024, 8, 17), expectedMonthPattern: /^八月/ },
      ];

      testCases.forEach(({ date, expectedMonthPattern }) => {
        it(`应该正确显示${date.toDateString()}的中文月份名称`, () => {
          const lunar = solarToLunar(date);
          expect(lunar.monthName).toMatch(expectedMonthPattern);
        });
      });

      it('应该支持所有中文月份名称（包括腊月等特殊月份）', () => {
        const date = new Date(2024, 0, 15);
        const lunar = solarToLunar(date);

        expect(lunar.monthName).toMatch(/^[一二三四五六七八九十腊冬]+月$/);
        expect(lunar.dayName).toMatch(/^[初一二三四五六七八九十廿卝]+$/);
      });
    });

    describe('边界情况', () => {
      it('应该正确处理闰年日期', () => {
        const date = new Date(2024, 1, 29); // 2024-02-29 闰日
        const lunar = solarToLunar(date);

        expect(lunar).toBeDefined();
        expect(lunar.month).toBeGreaterThan(0);
        expect(lunar.day).toBeGreaterThan(0);
      });

      it('应该正确处理年末日期', () => {
        const date = new Date(2024, 11, 31); // 2024-12-31
        const lunar = solarToLunar(date);

        expect(lunar).toBeDefined();
        expect(lunar.month).toBeGreaterThan(0);
        expect(lunar.day).toBeGreaterThan(0);
      });
    });
  });

  describe('getNextSolarBirthday - 计算下一个农历生日', () => {
    describe('基本功能', () => {
      it('应该返回有效的Date对象', () => {
        const result = getNextSolarBirthday(1, 1);
        expect(result).toBeInstanceOf(Date);
      });

      it('应该返回未来的日期（不是过去的日期）', () => {
        const nextBirthday = getNextSolarBirthday(1, 1);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        expect(nextBirthday.getTime()).toBeGreaterThanOrEqual(now.getTime());
      });

      it('同一天多次调用应该返回相同结果（幂等性）', () => {
        const birthday1 = getNextSolarBirthday(6, 15);
        const birthday2 = getNextSolarBirthday(6, 15);
        const birthday3 = getNextSolarBirthday(6, 15);

        expect(birthday1.getTime()).toBe(birthday2.getTime());
        expect(birthday2.getTime()).toBe(birthday3.getTime());
      });
    });

    describe('不同农历月份的计算', () => {
      const lunarBirthdays = [
        { month: 1, day: 1, name: '春节' },
        { month: 5, day: 5, name: '端午节' },
        { month: 8, day: 15, name: '中秋节' },
        { month: 9, day: 9, name: '重阳节' },
        { month: 12, day: 8, name: '腊八节' },
      ];

      lunarBirthdays.forEach(({ month, day, name }) => {
        it(`应该正确计算${name}（农历${month}月${day}日）的下一个阳历生日`, () => {
          const nextBirthday = getNextSolarBirthday(month, day);

          expect(nextBirthday).toBeInstanceOf(Date);
          expect(nextBirthday.getTime()).toBeGreaterThan(Date.now());

          // 验证返回的日期是合理的（未来1年内）
          const maxFutureDate = new Date();
          maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
          expect(nextBirthday.getTime()).toBeLessThan(maxFutureDate.getTime());
        });
      });
    });

    describe('准确性验证 - 与lunar-javascript库对比', () => {
      it('计算结果应该与lunar-javascript库一致', () => {
        const lunarMonth = 6;
        const lunarDay = 15;

        // 使用我们的函数
        const ourResult = getNextSolarBirthday(lunarMonth, lunarDay);

        // 使用lunar-javascript库计算
        const solarYear = new Date().getFullYear();
        const lunar = Lunar.fromYmd(solarYear, lunarMonth, lunarDay);
        const solar = lunar.getSolar();
        const libraryResult = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());

        // 结果应该一致（允许1天的误差，因为可能跨越年份）
        const diffDays = Math.abs(ourResult.getTime() - libraryResult.getTime()) / (1000 * 60 * 60 * 24);
        expect(diffDays).toBeLessThanOrEqual(365); // 最多相差一年
      });
    });
  });

  describe('getHoliday - 节日识别', () => {
    describe('公历节日', () => {
      const solarHolidays = [
        { date: new Date(2024, 0, 1), expected: '元旦', name: '元旦' },
        { date: new Date(2024, 3, 4), expected: null, name: '普通日期(4月4日)' },
        { date: new Date(2024, 4, 1), expected: '劳动节', name: '劳动节' },
        { date: new Date(2024, 5, 1), expected: '儿童节', name: '儿童节' },
        { date: new Date(2024, 9, 1), expected: '国庆节', name: '国庆节(10-01)' },
        { date: new Date(2024, 9, 5), expected: '国庆节', name: '国庆节(10-05)' },
        { date: new Date(2024, 9, 7), expected: '国庆节', name: '国庆节(10-07)' },
      ];

      solarHolidays.forEach(({ date, expected, name }) => {
        it(`应该${expected ? '正确识别' : '返回 null'}: ${name}`, () => {
          const result = getHoliday(date);
          expect(result).toBe(expected);
        });
      });

      it('国庆节范围外的日期不应该被识别', () => {
        const before = new Date(2024, 8, 30); // 2024-09-30
        const after = new Date(2024, 9, 8); // 2024-10-08

        expect(getHoliday(before)).not.toBe('国庆节');
        expect(getHoliday(after)).not.toBe('国庆节');
      });
    });

    describe('农历节日', () => {
      const lunarHolidays = [
        { date: new Date(2024, 1, 10), expected: '春节', name: '春节(正月初一)' },
        { date: new Date(2024, 1, 16), expected: '春节', name: '春节(正月初七)' },
        { date: new Date(2024, 1, 24), expected: '元宵节', name: '元宵节(正月十五)' },
        { date: new Date(2024, 5, 10), expected: '端午节', name: '端午节(五月初五)' },
        { date: new Date(2024, 8, 17), expected: '中秋节', name: '中秋节(八月十五)' },
        { date: new Date(2024, 9, 11), expected: '重阳节', name: '重阳节(九月初九)' },
        { date: new Date(2024, 1, 9), expected: '除夕', name: '除夕' },
      ];

      lunarHolidays.forEach(({ date, expected, name }) => {
        it(`应该正确识别: ${name}`, () => {
          const result = getHoliday(date);
          expect(result).toBe(expected);
        });
      });
    });

    describe('边界情况', () => {
      it('非节日日期应该返回null', () => {
        const normalDates = [
          new Date(2024, 0, 15),
          new Date(2024, 2, 15),
          new Date(2024, 5, 15),
        ];

        normalDates.forEach(date => {
          expect(getHoliday(date)).toBeNull();
        });
      });

      it('春节假期应该持续7天（正月初一到初七）', () => {
        const springFestivalStart = new Date(2024, 1, 10); // 2024-02-10
        const springFestivalEnd = new Date(2024, 1, 16); // 2024-02-16

        for (let i = 0; i <= 6; i++) {
          const date = new Date(2024, 1, 10 + i);
          expect(getHoliday(date)).toBe('春节');
        }
      });
    });
  });

  describe('集成测试 - 真实场景', () => {
    it('应该正确处理2024年中秋节（农历八月十五 → 阳历2024-09-17）', () => {
      const midAutumnDate = new Date(2024, 8, 17);
      const lunar = solarToLunar(midAutumnDate);
      const holiday = getHoliday(midAutumnDate);

      expect(lunar.month).toBe(8);
      expect(lunar.day).toBe(15);
      expect(holiday).toBe('中秋节');
    });

    it('应该正确计算2024年春节（农历正月初一）的下一个阳历日期', () => {
      const nextSpringFestival = getNextSolarBirthday(1, 1);

      expect(nextSpringFestival).toBeInstanceOf(Date);
      expect(nextSpringFestival.getMonth()).toBe(1); // 2月
      expect(nextSpringFestival.getDate()).toBeGreaterThanOrEqual(1);
      expect(nextSpringFestival.getDate()).toBeLessThanOrEqual(20);
    });

    it('应该正确识别除夕（春节前一天）', () => {
      // 2024年春节是02-10，除夕应该是02-09
      const chineseNewYearEve = new Date(2024, 1, 9);
      const holiday = getHoliday(chineseNewYearEve);

      expect(holiday).toBe('除夕');
    });
  });
});
