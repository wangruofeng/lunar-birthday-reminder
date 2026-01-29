import { describe, it, expect } from 'vitest'
import { solarToLunar, getSolarBirthdayFromLunar, getHoliday } from './lunar'

describe('农历转换工具测试', () => {
  describe('solarToLunar - 公历转农历', () => {
    it('应该正确转换2024年春节（2024-02-10是农历正月初一）', () => {
      const date = new Date(2024, 1, 10) // 2024年2月10日
      const lunar = solarToLunar(date)

      expect(lunar.month).toBe(1)
      expect(lunar.day).toBe(1)
      expect(lunar.isFirstDayOfMonth).toBe(true)
      expect(lunar.monthName).toBe('正月') // 农历一月称为"正月"
      expect(lunar.dayName).toBe('初一')
    })

    it('应该正确转换2024年中秋节（2024-09-17是农历八月十五）', () => {
      const date = new Date(2024, 8, 17) // 2024年9月17日
      const lunar = solarToLunar(date)

      expect(lunar.month).toBe(8)
      expect(lunar.day).toBe(15)
      expect(lunar.monthName).toBe('八月')
      expect(lunar.dayName).toBe('十五')
    })

    it('应该正确转换2024年端午节（2024-06-10是农历五月初五）', () => {
      const date = new Date(2024, 5, 10) // 2024年6月10日
      const lunar = solarToLunar(date)

      expect(lunar.month).toBe(5)
      expect(lunar.day).toBe(5)
      expect(lunar.monthName).toBe('五月')
      expect(lunar.dayName).toBe('初五')
    })

    it('应该正确识别月初第一天', () => {
      const date = new Date(2024, 0, 11) // 2024年1月11日，农历腊月初一
      const lunar = solarToLunar(date)

      expect(lunar.isFirstDayOfMonth).toBe(true)
      expect(lunar.monthName).toBe('腊月')
    })

    it('应该正确转换非月初的日期', () => {
      const date = new Date(2024, 1, 15) // 2024年2月15日，农历正月初六
      const lunar = solarToLunar(date)

      expect(lunar.isFirstDayOfMonth).toBe(false)
      expect(lunar.month).toBe(1)
      expect(lunar.day).toBe(6)
    })
  })

  describe('getSolarBirthdayFromLunar - 农历生日转公历日期（指定年份）', () => {
    it('应该正确转换2024年春节（农历正月初一 → 2024-02-10）', () => {
      const result = getSolarBirthdayFromLunar(1, 1, 2024)
      expect(result).toBe('2024-02-10')
    })

    it('应该正确转换2024年中秋节（农历八月十五 → 2024-09-17）', () => {
      const result = getSolarBirthdayFromLunar(8, 15, 2024)
      expect(result).toBe('2024-09-17')
    })

    it('应该正确转换2024年端午节（农历五月初五 → 2024-06-10）', () => {
      const result = getSolarBirthdayFromLunar(5, 5, 2024)
      expect(result).toBe('2024-06-10')
    })

    it('应该正确转换2025年春节（农历正月初一 → 2025-01-29）', () => {
      const result = getSolarBirthdayFromLunar(1, 1, 2025)
      expect(result).toBe('2025-01-29')
    })

    it('应该正确转换2025年中秋节（农历八月十五 → 2025-10-06）', () => {
      const result = getSolarBirthdayFromLunar(8, 15, 2025)
      expect(result).toBe('2025-10-06')
    })

    it('返回的日期格式应该是 YYYY-MM-DD', () => {
      const result = getSolarBirthdayFromLunar(1, 1, 2024)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('同一年份相同农历日期应该返回相同结果', () => {
      const result1 = getSolarBirthdayFromLunar(6, 6, 2024)
      const result2 = getSolarBirthdayFromLunar(6, 6, 2024)
      expect(result1).toBe(result2)
    })
  })

  describe('getHoliday - 获取节日信息', () => {
    describe('公历节日', () => {
      it('应该正确识别元旦（1月1日）', () => {
        const date = new Date(2024, 0, 1)
        expect(getHoliday(date)).toBe('元旦')
      })

      it('应该正确识别劳动节（5月1日）', () => {
        const date = new Date(2024, 4, 1)
        expect(getHoliday(date)).toBe('劳动节')
      })

      it('应该正确识别儿童节（6月1日）', () => {
        const date = new Date(2024, 5, 1)
        expect(getHoliday(date)).toBe('儿童节')
      })

      it('应该正确识别国庆节期间（10月1-7日）', () => {
        expect(getHoliday(new Date(2024, 9, 1))).toBe('国庆节')
        expect(getHoliday(new Date(2024, 9, 4))).toBe('国庆节')
        expect(getHoliday(new Date(2024, 9, 7))).toBe('国庆节')
      })

      it('国庆节范围外的日期不应识别为国庆节', () => {
        expect(getHoliday(new Date(2024, 8, 30))).not.toBe('国庆节')
        expect(getHoliday(new Date(2024, 9, 8))).not.toBe('国庆节')
      })
    })

    describe('农历节日', () => {
      it('应该正确识别春节（正月初一到初七）', () => {
        const date = new Date(2024, 1, 10) // 2024-02-10，正月初一
        expect(getHoliday(date)).toBe('春节')

        const date2 = new Date(2024, 1, 16) // 2024-02-16，正月初七
        expect(getHoliday(date2)).toBe('春节')
      })

      it('应该正确识别元宵节（正月十五）', () => {
        const date = new Date(2024, 1, 24) // 2024-02-24，正月十五
        expect(getHoliday(date)).toBe('元宵节')
      })

      it('应该正确识别端午节（五月初五）', () => {
        const date = new Date(2024, 5, 10) // 2024-06-10，五月初五
        expect(getHoliday(date)).toBe('端午节')
      })

      it('应该正确识别中秋节（八月十五）', () => {
        const date = new Date(2024, 8, 17) // 2024-09-17，八月十五
        expect(getHoliday(date)).toBe('中秋节')
      })

      it('应该正确识别重阳节（九月初九）', () => {
        const date = new Date(2024, 9, 11) // 2024-10-11，九月初九
        expect(getHoliday(date)).toBe('重阳节')
      })

      it('应该正确识别除夕', () => {
        const date = new Date(2024, 1, 9) // 2024-02-09，除夕
        expect(getHoliday(date)).toBe('除夕')
      })
    })

    describe('2026年法定节假日', () => {
      it('应该正确识别2026年元旦（1月1-3日）', () => {
        expect(getHoliday(new Date(2026, 0, 1))).toBe('元旦')
        expect(getHoliday(new Date(2026, 0, 2))).toBe('元旦')
        expect(getHoliday(new Date(2026, 0, 3))).toBe('元旦')
      })

      it('应该正确识别2026年春节（2月15-23日）', () => {
        expect(getHoliday(new Date(2026, 1, 15))).toBe('春节')
        expect(getHoliday(new Date(2026, 1, 20))).toBe('春节')
        expect(getHoliday(new Date(2026, 1, 23))).toBe('春节')
      })

      it('应该正确识别2026年清明节（4月4-6日）', () => {
        expect(getHoliday(new Date(2026, 3, 4))).toBe('清明节')
        expect(getHoliday(new Date(2026, 3, 5))).toBe('清明节')
        expect(getHoliday(new Date(2026, 3, 6))).toBe('清明节')
      })

      it('应该正确识别2026年劳动节（5月1-5日）', () => {
        expect(getHoliday(new Date(2026, 4, 1))).toBe('劳动节')
        expect(getHoliday(new Date(2026, 4, 3))).toBe('劳动节')
        expect(getHoliday(new Date(2026, 4, 5))).toBe('劳动节')
      })

      it('应该正确识别2026年端午节（6月19-21日）', () => {
        expect(getHoliday(new Date(2026, 5, 19))).toBe('端午节')
        expect(getHoliday(new Date(2026, 5, 20))).toBe('端午节')
        expect(getHoliday(new Date(2026, 5, 21))).toBe('端午节')
      })

      it('应该正确识别2026年中秋节（9月25-27日）', () => {
        expect(getHoliday(new Date(2026, 8, 25))).toBe('中秋节')
        expect(getHoliday(new Date(2026, 8, 26))).toBe('中秋节')
        expect(getHoliday(new Date(2026, 8, 27))).toBe('中秋节')
      })

      it('应该正确识别2026年国庆节（10月1-7日）', () => {
        expect(getHoliday(new Date(2026, 9, 1))).toBe('国庆节')
        expect(getHoliday(new Date(2026, 9, 4))).toBe('国庆节')
        expect(getHoliday(new Date(2026, 9, 7))).toBe('国庆节')
      })

      it('2026年法定节假日范围外的日期不应识别为法定节假日', () => {
        expect(getHoliday(new Date(2026, 0, 4))).not.toBe('元旦')
        expect(getHoliday(new Date(2026, 1, 14))).not.toBe('春节')
        expect(getHoliday(new Date(2026, 1, 24))).not.toBe('春节')
        expect(getHoliday(new Date(2026, 4, 6))).not.toBe('劳动节')
      })
    })

    describe('非节日日期', () => {
      it('普通日期应返回null', () => {
        const date = new Date(2024, 2, 15) // 2024年3月15日
        expect(getHoliday(date)).toBeNull()
      })

      it('农历非节日日期应返回null', () => {
        const date = new Date(2024, 1, 20) // 2024年2月20日，农历正月十一
        expect(getHoliday(date)).toBeNull()
      })
    })
  })

  describe('双向转换验证', () => {
    it('公历→农历→公历应该保持一致（春节）', () => {
      const originalSolar = new Date(2024, 1, 10) // 2024-02-10
      const lunar = solarToLunar(originalSolar)

      // 使用得到的农历日期重新计算公历
      const resultStr = getSolarBirthdayFromLunar(lunar.month, lunar.day, 2024)
      const resultDate = new Date(resultStr)

      expect(resultDate.getFullYear()).toBe(2024)
      expect(resultDate.getMonth()).toBe(1) // 2月
      expect(resultDate.getDate()).toBe(10)
    })

    it('公历→农历→公历应该保持一致（中秋）', () => {
      const originalSolar = new Date(2024, 8, 17) // 2024-09-17
      const lunar = solarToLunar(originalSolar)

      const resultStr = getSolarBirthdayFromLunar(lunar.month, lunar.day, 2024)
      const resultDate = new Date(resultStr)

      expect(resultDate.getFullYear()).toBe(2024)
      expect(resultDate.getMonth()).toBe(8) // 9月
      expect(resultDate.getDate()).toBe(17)
    })
  })
})
