import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BirthdayList from '../components/BirthdayList';
import { Birthday } from '../types/birthday';

// Mock the storage module
jest.mock('../utils/storage', () => ({
  deleteBirthday: jest.fn(),
}));

import { deleteBirthday } from '../utils/storage';

describe('BirthdayList - 生日列表组件测试', () => {
  const mockOnDelete = jest.fn();
  const mockOnBirthdayClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const createMockBirthday = (
    year: number,
    lunarMonth: number,
    lunarDay: number,
    solarMonth: number,
    solarDay: number,
    name: string = '张三'
  ): Birthday => ({
    id: `test-${Date.now()}-${Math.random()}`,
    name,
    relationship: '朋友',
    lunarYear: year,
    lunarMonth,
    lunarDay,
    solarMonth,
    solarDay,
  });

  describe('空状态显示', () => {
    it('应该显示空状态提示', () => {
      render(<BirthdayList birthdays={[]} onDelete={mockOnDelete} />);
      expect(screen.getByText('还没有添加任何生日')).toBeInTheDocument();
    });
  });

  describe('生日信息显示', () => {
    it('应该正确显示生日的农历日期', () => {
      const birthdays: Birthday[] = [
        createMockBirthday(1990, 5, 5, 5, 28, '李四'),
      ];

      render(
        <BirthdayList
          birthdays={birthdays}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('农历5月5日')).toBeInTheDocument();
    });

    it('应该显示生日列表标题', () => {
      const birthdays: Birthday[] = [
        createMockBirthday(1990, 1, 1, 2, 10, '王五'),
      ];

      render(
        <BirthdayList
          birthdays={birthdays}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('生日列表')).toBeInTheDocument();
    });

    it('应该显示多个生日', () => {
      const birthdays: Birthday[] = [
        createMockBirthday(1990, 1, 1, 2, 10, '张三'),
        createMockBirthday(1992, 5, 5, 5, 28, '李四'),
        createMockBirthday(1995, 8, 15, 9, 12, '王五'),
      ];

      render(
        <BirthdayList
          birthdays={birthdays}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('王五')).toBeInTheDocument();
    });

    it('应该显示关系信息', () => {
      const birthdays: Birthday[] = [
        createMockBirthday(1990, 1, 1, 2, 10, '张三'),
      ];
      birthdays[0].relationship = '同事';

      render(
        <BirthdayList
          birthdays={birthdays}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('同事')).toBeInTheDocument();
    });
  });

  describe('阳历生日日期显示逻辑', () => {
    describe('使用固定的测试日期', () => {
      let originalDate: DateConstructor;

      beforeEach(() => {
        originalDate = global.Date;
        // Mock 当前日期为 2024年3月15日
        const mockDate = new Date('2024-03-15T12:00:00Z');
        global.Date = class extends Date {
          constructor(...args: any[]) {
            if (args.length === 0) {
              super(mockDate);
            } else {
              super(...args);
            }
          }
          static now() {
            return mockDate.getTime();
          }
        } as any;
      });

      afterEach(() => {
        global.Date = originalDate;
      });

      it('应该显示今年的阳历生日日期(生日未到)', () => {
        // 当前日期: 2024年3月15日
        // 生日: 2024年6月20日 (未来)
        // 期望: 显示 2024年
        const birthdays: Birthday[] = [
          {
            id: 'test-1',
            name: '测试用户',
            relationship: '朋友',
            lunarYear: 1990,
            lunarMonth: 1,
            lunarDay: 1,
            solarMonth: 6,
            solarDay: 20,
          },
        ];

        render(
          <BirthdayList
            birthdays={birthdays}
            onDelete={mockOnDelete}
          />
        );

        expect(screen.getByText(/2024年6月20日/)).toBeInTheDocument();
      });

      it('应该显示明年的阳历生日日期(生日已过)', () => {
        // 当前日期: 2024年3月15日
        // 生日: 1月10日 (已过)
        // 期望: 显示 2025年
        const birthdays: Birthday[] = [
          {
            id: 'test-1',
            name: '测试用户',
            relationship: '朋友',
            lunarYear: 1990,
            lunarMonth: 1,
            lunarDay: 1,
            solarMonth: 1,
            solarDay: 10,
          },
        ];

        render(
          <BirthdayList
            birthdays={birthdays}
            onDelete={mockOnDelete}
          />
        );

        expect(screen.getByText(/2025年1月10日/)).toBeInTheDocument();
      });

      it('应该正确显示12月生日的日期', () => {
        // 当前日期: 2024年3月15日
        // 生日: 12月25日 (未来)
        // 期望: 显示 2024年
        const birthdays: Birthday[] = [
          {
            id: 'test-1',
            name: '测试用户',
            relationship: '朋友',
            lunarYear: 1990,
            lunarMonth: 1,
            lunarDay: 1,
            solarMonth: 12,
            solarDay: 25,
          },
        ];

        render(
          <BirthdayList
            birthdays={birthdays}
            onDelete={mockOnDelete}
          />
        );

        expect(screen.getByText(/2024年12月25日/)).toBeInTheDocument();
      });

      it('应该正确处理今天是生日的情况', () => {
        // 当前日期: 2024年3月15日
        // 生日: 3月15日 (今天)
        // 期望: 显示 2024年
        const birthdays: Birthday[] = [
          {
            id: 'test-1',
            name: '测试用户',
            relationship: '朋友',
            lunarYear: 1990,
            lunarMonth: 1,
            lunarDay: 1,
            solarMonth: 3,
            solarDay: 15,
          },
        ];

        render(
          <BirthdayList
            birthdays={birthdays}
            onDelete={mockOnDelete}
          />
        );

        expect(screen.getByText(/2024年3月15日/)).toBeInTheDocument();
      });
    });
  });

  describe('删除功能', () => {
    it('应该有删除按钮', () => {
      const birthdays: Birthday[] = [
        createMockBirthday(1990, 1, 1, 2, 10, '张三'),
      ];

      render(
        <BirthdayList
          birthdays={birthdays}
          onDelete={mockOnDelete}
        />
      );

      const deleteButtons = screen.getAllByRole('button');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('点击生日项', () => {
    it('点击生日项应该调用 onBirthdayClick', () => {
      const birthdays: Birthday[] = [
        createMockBirthday(1990, 1, 1, 2, 10, '张三'),
      ];

      render(
        <BirthdayList
          birthdays={birthdays}
          onDelete={mockOnDelete}
          onBirthdayClick={mockOnBirthdayClick}
        />
      );

      const birthdayItem = screen.getByText('张三').closest('.cursor-pointer');
      fireEvent.click(birthdayItem!);

      expect(mockOnBirthdayClick).toHaveBeenCalledWith(birthdays[0]);
      expect(mockOnBirthdayClick).toHaveBeenCalledTimes(1);
    });
  });
});
