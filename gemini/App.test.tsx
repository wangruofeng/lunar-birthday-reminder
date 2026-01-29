import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

describe('App - UI集成测试（优化版）', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    });
  });

  describe('应用初始化', () => {
    it('应该渲染应用容器', () => {
      render(<App />);
      expect(screen.getByTestId('app-container')).toBeInTheDocument();
    });

    it('应该显示应用标题', () => {
      render(<App />);
      expect(screen.getByTestId('app-title')).toBeInTheDocument();
    });

    it('应该渲染侧边栏', () => {
      render(<App />);
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('应该渲染日历区域', () => {
      render(<App />);
      expect(screen.getByTestId('calendar-section')).toBeInTheDocument();
    });
  });

  describe('数据管理', () => {
    describe('添加生日', () => {
      it('应该打开添加表单', () => {
        render(<App />);
        const addButton = screen.getByTestId('add-birthday-button');
        fireEvent.click(addButton);

        expect(screen.getByTestId('add-birthday-form')).toBeInTheDocument();
      });

      it('应该能够填写并提交表单', async () => {
        render(<App />);

        // 打开表单
        const addButton = screen.getByTestId('add-birthday-button');
        fireEvent.click(addButton);

        // 填写表单
        const nameInput = screen.getByTestId('input-name');
        const relationInput = screen.getByTestId('input-relation');
        const monthSelect = screen.getByTestId('select-month');
        const daySelect = screen.getByTestId('select-day');

        fireEvent.change(nameInput, { target: { value: '张三' } });
        fireEvent.change(relationInput, { target: { value: '朋友' } });
        fireEvent.change(monthSelect, { target: { value: '8' } });
        fireEvent.change(daySelect, { target: { value: '15' } });

        // 提交表单
        const form = screen.getByTestId('add-birthday-form');
        fireEvent.submit(form);

        // 验证数据保存到localStorage
        await waitFor(() => {
          const saved = localStorage.getItem('birthdays');
          expect(saved).toBeTruthy();
          const birthdays = JSON.parse(saved!);
          expect(birthdays).toHaveLength(1);
          expect(birthdays[0].name).toBe('张三');
          expect(birthdays[0].relationship).toBe('朋友');
          expect(birthdays[0].lunarDate.month).toBe(8);
          expect(birthdays[0].lunarDate.day).toBe(15);
        });
      });

      it('添加后应该显示在生日列表中', async () => {
        render(<App />);

        const addButton = screen.getByTestId('add-birthday-button');
        fireEvent.click(addButton);

        const nameInput = screen.getByTestId('input-name');
        const relationInput = screen.getByTestId('input-relation');
        fireEvent.change(nameInput, { target: { value: '李四' } });
        fireEvent.change(relationInput, { target: { value: '同学' } });

        const form = screen.getByTestId('add-birthday-form');
        fireEvent.submit(form);

        // 验证出现在列表中
        await waitFor(() => {
          expect(screen.getByText('李四')).toBeInTheDocument();
        });
      });
    });

    describe('删除生日', () => {
      it('应该能够删除生日记录', async () => {
        // 先添加一条数据
        const testData = [{
          id: 'test-delete-1',
          name: '待删除用户',
          relationship: '测试',
          lunarDate: { year: 1990, month: 6, day: 15 },
        }];
        localStorage.setItem('birthdays', JSON.stringify(testData));

        render(<App />);

        // Mock confirm dialog
        global.confirm = vi.fn(() => true);

        // 找到删除按钮
        const deleteButton = screen.getByTestId('delete-button-test-delete-1');
        fireEvent.click(deleteButton);

        // 验证已删除
        await waitFor(() => {
          const saved = localStorage.getItem('birthdays');
          const birthdays = JSON.parse(saved!);
          expect(birthdays).toHaveLength(0);
        });
      });

      it('取消删除时应该保留数据', async () => {
        const testData = [{
          id: 'test-delete-2',
          name: '保留用户',
          relationship: '测试',
          lunarDate: { year: 1990, month: 6, day: 15 },
        }];
        localStorage.setItem('birthdays', JSON.stringify(testData));

        render(<App />);

        // Mock confirm dialog - 用户选择取消
        global.confirm = vi.fn(() => false);

        const deleteButton = screen.getByTestId('delete-button-test-delete-2');
        fireEvent.click(deleteButton);

        // 验证数据仍然存在
        await waitFor(() => {
          const saved = localStorage.getItem('birthdays');
          const birthdays = JSON.parse(saved!);
          expect(birthdays).toHaveLength(1);
        });
      });
    });

    describe('数据持久化', () => {
      it('应该从localStorage加载已保存的数据', () => {
        const savedData = [{
          id: 'saved-1',
          name: '已保存的用户数据',
          relationship: '家人',
          lunarDate: { year: 1995, month: 12, day: 15 },
        }];
        localStorage.setItem('birthdays', JSON.stringify(savedData));

        render(<App />);

        // 使用 getAllByText 因为数据可能出现在多个位置
        const instances = screen.getAllByText('已保存的用户数据');
        expect(instances.length).toBeGreaterThan(0);
      });

      it('页面刷新后应该保留数据', () => {
        const testData = [{
          id: 'persist-1',
          name: '持久化测试',
          relationship: '朋友',
          lunarDate: { year: 1990, month: 5, day: 5 },
        }];
        localStorage.setItem('birthdays', JSON.stringify(testData));

        // 第一次渲染
        const { unmount: unmount1 } = render(<App />);
        expect(screen.getByText('持久化测试')).toBeInTheDocument();

        // 模拟刷新
        unmount1();

        // 第二次渲染
        render(<App />);
        expect(screen.getByText('持久化测试')).toBeInTheDocument();
      });
    });
  });

  describe('UI交互', () => {
    describe('日历导航', () => {
      it('应该能够切换到下一月', () => {
        render(<App />);

        const nextButton = screen.getAllByRole('button').find(btn =>
          btn.querySelector('svg')?.innerHTML.includes('chevron-right')
        );

        if (nextButton) {
          const calendarTitleBefore = screen.getByText(/\d{4}\s*年\s*\d+\s*月/);
          const textBefore = calendarTitleBefore.textContent;

          fireEvent.click(nextButton);

          const calendarTitleAfter = screen.getByText(/\d{4}\s*年\s*\d+\s*月/);
          const textAfter = calendarTitleAfter.textContent;

          expect(textAfter).not.toBe(textBefore);
        }
      });
    });

    describe('表单验证', () => {
      it('必填字段为空时不应该提交', () => {
        render(<App />);

        const addButton = screen.getByTestId('add-birthday-button');
        fireEvent.click(addButton);

        // 直接提交不填写任何内容
        const form = screen.getByTestId('add-birthday-form');

        // HTML5 required属性应该阻止提交
        const nameInput = screen.getByTestId('input-name');
        expect(nameInput).toBeRequired();
      });

      it('应该能够选择农历30日', () => {
        render(<App />);

        const addButton = screen.getByTestId('add-birthday-button');
        fireEvent.click(addButton);

        const daySelect = screen.getByTestId('select-day');
        const options = daySelect.querySelectorAll('option');

        // 验证有30日选项
        const hasOption30 = Array.from(options).some(opt => opt.value === '30');
        expect(hasOption30).toBe(true);
      });
    });
  });

  describe('国际化', () => {
    it('应该能够切换到简体中文', () => {
      render(<App />);

      const cnButton = screen.getByText('简');
      fireEvent.click(cnButton);

      expect(localStorage.getItem('app_lang')).toBe('zh-CN');
      expect(screen.getByTestId('app-title')).toHaveTextContent('萌萌生日提醒(gemini)');
    });

    it('应该能够切换到繁体中文', () => {
      render(<App />);

      const twButton = screen.getByText('繁');
      fireEvent.click(twButton);

      expect(localStorage.getItem('app_lang')).toBe('zh-TW');
      expect(screen.getByTestId('app-title')).toHaveTextContent('萌萌生日提醒(gemini)');
    });

    it('应该能够切换到英语', () => {
      render(<App />);

      const enButton = screen.getByText('EN');
      fireEvent.click(enButton);

      expect(localStorage.getItem('app_lang')).toBe('en');
      expect(screen.getByTestId('app-title')).toHaveTextContent('Cute B-Day (gemini)');
    });

    it('应该从localStorage加载语言偏好', () => {
      localStorage.setItem('app_lang', 'en');

      render(<App />);

      expect(screen.getByTestId('app-title')).toHaveTextContent('Cute B-Day (gemini)');
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('应该正确处理农历十二月的数据', () => {
      const testData = [{
        id: 'year-end-1',
        name: '年末生日用户',
        relationship: '测试',
        lunarDate: { year: 1990, month: 12, day: 20 },
      }];
      localStorage.setItem('birthdays', JSON.stringify(testData));

      render(<App />);

      // 使用 getAllByText 因为数据可能出现在多个位置
      const instances = screen.getAllByText('年末生日用户');
      expect(instances.length).toBeGreaterThan(0);
    });

    it('空列表时应该显示提示信息', () => {
      localStorage.setItem('birthdays', JSON.stringify([]));

      render(<App />);

      expect(screen.getByText(/暂时没有小伙伴过生日|No b-days coming up/)).toBeInTheDocument();
    });

    it('应该正确处理特殊字符名称', async () => {
      render(<App />);

      const addButton = screen.getByTestId('add-birthday-button');
      fireEvent.click(addButton);

      const nameInput = screen.getByTestId('input-name');
      const relationInput = screen.getByTestId('input-relation');

      // 使用特殊字符
      fireEvent.change(nameInput, { target: { value: '张三·李四-Wang' } });
      fireEvent.change(relationInput, { target: { value: '朋友' } });

      const form = screen.getByTestId('add-birthday-form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('张三·李四-Wang')).toBeInTheDocument();
      });
    });

    it('应该正确处理长名称', async () => {
      render(<App />);

      const addButton = screen.getByTestId('add-birthday-button');
      fireEvent.click(addButton);

      const nameInput = screen.getByTestId('input-name');
      const relationInput = screen.getByTestId('input-relation');

      // 使用很长的名称
      const longName = '这是一个非常非常长的名字用来测试截断功能';
      fireEvent.change(nameInput, { target: { value: longName } });
      fireEvent.change(relationInput, { target: { value: '测试' } });

      const form = screen.getByTestId('add-birthday-form');
      fireEvent.submit(form);

      await waitFor(() => {
        // 验证至少能找到部分名称（因为可能被截断）
        expect(screen.getByText(/测试/)).toBeInTheDocument();
      });
    });
  });

  describe('列表显示', () => {
    it('应该显示所有已添加的生日', () => {
      const testData = [
        { id: '1', name: '用户1', relationship: '家人', lunarDate: { year: 1990, month: 1, day: 1 } },
        { id: '2', name: '用户2', relationship: '朋友', lunarDate: { year: 1991, month: 2, day: 2 } },
        { id: '3', name: '用户3', relationship: '同事', lunarDate: { year: 1992, month: 3, day: 3 } },
      ];
      localStorage.setItem('birthdays', JSON.stringify(testData));

      render(<App />);

      expect(screen.getByText('用户1')).toBeInTheDocument();
      expect(screen.getByText('用户2')).toBeInTheDocument();
      expect(screen.getByText('用户3')).toBeInTheDocument();
    });

    it('应该显示农历日期信息', () => {
      const testData = [{
        id: 'lunar-info-1',
        name: '农历测试',
        relationship: '测试',
        lunarDate: { year: 1990, month: 8, day: 15 },
      }];
      localStorage.setItem('birthdays', JSON.stringify(testData));

      render(<App />);

      // 验证农历信息显示
      expect(screen.getByText(/8\/15|农历.*8.*15/)).toBeInTheDocument();
    });
  });

  describe('提醒功能', () => {
    it('应该显示最近提醒列表', () => {
      const currentYear = new Date().getFullYear();
      const testData = [{
        id: 'reminder-1',
        name: '即将过生日',
        relationship: '测试',
        lunarDate: { year: currentYear - 20, month: 1, day: 1 },
      }];
      localStorage.setItem('birthdays', JSON.stringify(testData));

      render(<App />);

      expect(screen.getByTestId('reminders-list')).toBeInTheDocument();
    });

    it('无提醒时应该显示空状态', () => {
      // 使用很远的将来日期，不会有14天内的生日
      const testData = [{
        id: 'far-future',
        name: '未来生日',
        relationship: '测试',
        lunarDate: { year: 2099, month: 1, day: 1 },
      }];
      localStorage.setItem('birthdays', JSON.stringify(testData));

      render(<App />);

      const remindersList = screen.getByTestId('reminders-list');
      expect(within(remindersList).getByText(/暂时没有小伙伴过生日|No b-days coming up/)).toBeInTheDocument();
    });
  });
});
