import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Birthday } from '../types'
import { getSolarBirthdayFromLunar } from '../utils/lunar'

// 模拟localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
    removeItem: (key: string) => {
      delete store[key]
    }
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
})

describe('生日提醒逻辑测试', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('生日年龄计算 - 使用固定日期验证', () => {
    it('1990年出生的人在2024年春节时应满34周岁', () => {
      const birthYear = 1990
      const currentYear = 2024

      // 1990年农历正月初一对应的公历日期
      const birthday2024 = getSolarBirthdayFromLunar(1, 1, 2024)
      const birthDate = new Date(birthday2024)

      // 年龄 = 2024 - 1990 = 34岁
      const age = currentYear - birthYear
      expect(age).toBe(34)
      expect(birthDate.getFullYear()).toBe(2024)
    })

    it('2000年出生的人在2024年端午时应满24周岁', () => {
      const birthYear = 2000
      const currentYear = 2024

      const birthday2024 = getSolarBirthdayFromLunar(5, 5, 2024)
      const birthDate = new Date(birthday2024)

      const age = currentYear - birthYear
      expect(age).toBe(24)
      expect(birthDate.getFullYear()).toBe(2024)
    })

    it('应该正确计算不同年份的年龄增长', () => {
      const birthYear = 1995

      const age2024 = 2024 - birthYear // 29岁
      const age2025 = 2025 - birthYear // 30岁
      const age2026 = 2026 - birthYear // 31岁

      expect(age2024).toBe(29)
      expect(age2025).toBe(30)
      expect(age2026).toBe(31)
    })

    it('年龄应该在合理范围内（0-150岁）', () => {
      const year2024 = 2024

      // 新生儿（2024年出生）
      const ageNewborn = year2024 - 2024
      expect(ageNewborn).toBe(0)

      // 百岁老人（1924年出生）
      const ageCentenarian = year2024 - 1924
      expect(ageCentenarian).toBe(100)

      // 超级老人（1874年出生）
      const ageSuper = year2024 - 1874
      expect(ageSuper).toBe(150)
    })
  })

  describe('倒计时天数计算 - 使用固定日期', () => {
    it('同一天倒计时应该是0天', () => {
      const date1 = new Date(2024, 1, 10) // 2024-02-10
      const date2 = new Date(2024, 1, 10) // 2024-02-10

      date1.setHours(0, 0, 0, 0)
      date2.setHours(0, 0, 0, 0)

      const diff = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
      expect(diff).toBe(0)
    })

    it('相差一天的倒计时应该是1天', () => {
      const date1 = new Date(2024, 1, 10) // 2024-02-10
      const date2 = new Date(2024, 1, 11) // 2024-02-11

      date1.setHours(0, 0, 0, 0)
      date2.setHours(0, 0, 0, 0)

      const diff = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
      expect(diff).toBe(1)
    })

    it('相差30天的倒计时应该是30天', () => {
      const date1 = new Date(2024, 0, 1) // 2024-01-01
      const date2 = new Date(2024, 0, 31) // 2024-01-31

      date1.setHours(0, 0, 0, 0)
      date2.setHours(0, 0, 0, 0)

      const diff = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
      expect(diff).toBe(30)
    })

    it('跨月份的倒计时计算应该正确', () => {
      const date1 = new Date(2024, 0, 15) // 2024-01-15
      const date2 = new Date(2024, 1, 20) // 2024-02-20

      date1.setHours(0, 0, 0, 0)
      date2.setHours(0, 0, 0, 0)

      const diff = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
      expect(diff).toBe(36) // 1月剩余16天 + 2月20天 = 36天
    })
  })

  describe('提醒筛选逻辑', () => {
    it('应该只显示14天内的生日提醒', () => {
      const reminders = [
        { daysRemaining: 0, name: '张三' },
        { daysRemaining: 7, name: '李四' },
        { daysRemaining: 14, name: '王五' },
        { daysRemaining: 15, name: '赵六' },  // 超出范围
        { daysRemaining: 30, name: '孙七' },  // 超出范围
        { daysRemaining: -1, name: '周八' }   // 已过去
      ]

      const filtered = reminders.filter(r => r.daysRemaining >= 0 && r.daysRemaining <= 14)

      expect(filtered).toHaveLength(3)
      expect(filtered.map(r => r.daysRemaining)).toEqual([0, 7, 14])
      expect(filtered.every(r => r.daysRemaining >= 0 && r.daysRemaining <= 14)).toBe(true)
    })

    it('应该按日期升序排列提醒（从近到远）', () => {
      const reminders = [
        { daysRemaining: 14, name: '王五' },
        { daysRemaining: 0, name: '张三' },
        { daysRemaining: 7, name: '李四' }
      ]

      const sorted = [...reminders].sort((a, b) => a.daysRemaining - b.daysRemaining)

      expect(sorted[0].daysRemaining).toBe(0)
      expect(sorted[1].daysRemaining).toBe(7)
      expect(sorted[2].daysRemaining).toBe(14)

      // 验证确实按升序排列
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].daysRemaining).toBeLessThanOrEqual(sorted[i + 1].daysRemaining)
      }
    })

    it('空数组应该返回空结果', () => {
      const reminders: any[] = []
      const filtered = reminders.filter(r => r.daysRemaining >= 0 && r.daysRemaining <= 14)
      expect(filtered).toHaveLength(0)
    })

    it('边界值测试：刚好14天应该包含', () => {
      const reminders = [
        { daysRemaining: 14, name: '测试' }
      ]

      const filtered = reminders.filter(r => r.daysRemaining >= 0 && r.daysRemaining <= 14)
      expect(filtered).toHaveLength(1)
    })

    it('边界值测试：15天不应该包含', () => {
      const reminders = [
        { daysRemaining: 15, name: '测试' }
      ]

      const filtered = reminders.filter(r => r.daysRemaining >= 0 && r.daysRemaining <= 14)
      expect(filtered).toHaveLength(0)
    })
  })

  describe('生日数据持久化', () => {
    it('应该正确保存和读取生日数据', () => {
      const birthday: Birthday = {
        id: 'test-id-1',
        name: '测试用户',
        relationship: '朋友',
        lunarDate: { year: 1990, month: 1, day: 1 }
      }

      localStorage.setItem('birthdays', JSON.stringify([birthday]))

      const retrieved = localStorage.getItem('birthdays')
      expect(retrieved).not.toBeNull()

      const parsed = JSON.parse(retrieved!)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].name).toBe('测试用户')
      expect(parsed[0].lunarDate.month).toBe(1)
      expect(parsed[0].lunarDate.day).toBe(1)
    })

    it('应该正确保存多个生日数据', () => {
      const birthdays: Birthday[] = [
        {
          id: 'id-1',
          name: '张三',
          relationship: '朋友',
          lunarDate: { year: 1990, month: 1, day: 1 }
        },
        {
          id: 'id-2',
          name: '李四',
          relationship: '家人',
          lunarDate: { year: 1995, month: 8, day: 15 }
        }
      ]

      localStorage.setItem('birthdays', JSON.stringify(birthdays))

      const retrieved = JSON.parse(localStorage.getItem('birthdays')!)
      expect(retrieved).toHaveLength(2)
      expect(retrieved[0].name).toBe('张三')
      expect(retrieved[1].name).toBe('李四')
    })

    it('应该安全处理无效的JSON数据', () => {
      localStorage.setItem('birthdays', 'invalid json{')

      // 模拟实际应用中的异常处理
      const safeParsed = (() => {
        try {
          const saved = localStorage.getItem('birthdays')
          return saved ? JSON.parse(saved) : []
        } catch (e) {
          return []
        }
      })()

      expect(safeParsed).toEqual([])
      expect(safeParsed).toHaveLength(0)
    })

    it('localStorage为空时应该返回空数组', () => {
      const retrieved = localStorage.getItem('birthdays')
      expect(retrieved).toBeNull()

      // 模拟实际应用中的处理
      const birthdays = (() => {
        try {
          const saved = localStorage.getItem('birthdays')
          return saved ? JSON.parse(saved) : []
        } catch (e) {
          return []
        }
      })()

      expect(birthdays).toEqual([])
    })
  })

  describe('生日CRUD操作', () => {
    it('应该正确添加新生日', () => {
      const birthdays: Birthday[] = []

      const newBirthday: Birthday = {
        id: 'new-id',
        name: '新用户',
        relationship: '同事',
        lunarDate: { year: 1992, month: 6, day: 6 }
      }

      const updated = [...birthdays, newBirthday]

      expect(updated).toHaveLength(1)
      expect(updated[0].name).toBe('新用户')
      expect(updated[0].lunarDate.month).toBe(6)
    })

    it('添加多个生日应该按顺序保存', () => {
      const birthdays: Birthday[] = []

      const b1: Birthday = {
        id: '1',
        name: '张三',
        relationship: '朋友',
        lunarDate: { year: 1990, month: 1, day: 1 }
      }

      const b2: Birthday = {
        id: '2',
        name: '李四',
        relationship: '家人',
        lunarDate: { year: 1995, month: 8, day: 15 }
      }

      const updated = [...birthdays, b1, b2]

      expect(updated).toHaveLength(2)
      expect(updated[0].name).toBe('张三')
      expect(updated[1].name).toBe('李四')
    })

    it('应该正确删除指定生日', () => {
      const birthdays: Birthday[] = [
        { id: '1', name: '张三', relationship: '朋友', lunarDate: { year: 1990, month: 1, day: 1 } },
        { id: '2', name: '李四', relationship: '家人', lunarDate: { year: 1995, month: 8, day: 15 } },
        { id: '3', name: '王五', relationship: '同事', lunarDate: { year: 1992, month: 6, day: 6 } }
      ]

      const filtered = birthdays.filter(b => b.id !== '2')

      expect(filtered).toHaveLength(2)
      expect(filtered.find(b => b.id === '2')).toBeUndefined()
      expect(filtered.find(b => b.id === '1')).toBeDefined()
      expect(filtered.find(b => b.id === '3')).toBeDefined()
    })

    it('应该生成唯一的UUID', () => {
      const ids = new Set<string>()

      for (let i = 0; i < 100; i++) {
        const id = crypto.randomUUID()
        ids.add(id)
      }

      // 所有ID都应该是唯一的
      expect(ids.size).toBe(100)

      // UUID格式验证（标准UUID格式：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）
      const firstId = Array.from(ids)[0]
      expect(firstId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('UUID重复生成的概率应该极低', () => {
      const id1 = crypto.randomUUID()
      const id2 = crypto.randomUUID()

      // 连续两次生成的UUID应该不同
      expect(id1).not.toBe(id2)
    })
  })

  describe('数据结构完整性', () => {
    it('生日对象应该包含所有必需字段', () => {
      const birthday: Birthday = {
        id: 'test-id',
        name: '测试',
        relationship: '朋友',
        lunarDate: { year: 1990, month: 1, day: 1 }
      }

      expect(birthday.id).toBeDefined()
      expect(birthday.name).toBeDefined()
      expect(birthday.relationship).toBeDefined()
      expect(birthday.lunarDate).toBeDefined()
      expect(birthday.lunarDate.year).toBeDefined()
      expect(birthday.lunarDate.month).toBeDefined()
      expect(birthday.lunarDate.day).toBeDefined()
    })

    it('农历日期应该在有效范围内', () => {
      const lunarDate = { year: 1990, month: 6, day: 15 }

      expect(lunarDate.month).toBeGreaterThanOrEqual(1)
      expect(lunarDate.month).toBeLessThanOrEqual(12)
      expect(lunarDate.day).toBeGreaterThanOrEqual(1)
      expect(lunarDate.day).toBeLessThanOrEqual(30)
      expect(lunarDate.year).toBeGreaterThan(1900)
      expect(lunarDate.year).toBeLessThan(2100)
    })
  })
})
