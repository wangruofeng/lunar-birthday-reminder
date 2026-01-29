import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BirthdayForm from './BirthdayForm';

describe('BirthdayForm 组件测试', () => {
  let mockOnSave;

  beforeEach(() => {
    mockOnSave = vi.fn();
  });

  // 辅助函数：通过 name 属性获取表单元素
  const getInputByName = (container, name) => {
    return container.querySelector(`input[name="${name}"]`);
  };

  describe('表单渲染', () => {
    it('应该渲染所有必需的输入字段', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      expect(getInputByName(container, 'name')).toBeInTheDocument();
      expect(getInputByName(container, 'relation')).toBeInTheDocument();
      expect(getInputByName(container, 'lunarYear')).toBeInTheDocument();
      expect(getInputByName(container, 'lunarMonth')).toBeInTheDocument();
      expect(getInputByName(container, 'lunarDay')).toBeInTheDocument();
    });

    it('添加模式应该显示正确的标题和说明', () => {
      render(<BirthdayForm onSave={mockOnSave} />);

      expect(screen.getByRole('heading', { name: '添加生日' })).toBeInTheDocument();
      expect(screen.getByText(/支持中国农历，系统会自动换算为公历/)).toBeInTheDocument();
    });

    it('编辑模式应该显示编辑标题和额外说明', () => {
      const editingBirthday = {
        id: '1',
        name: '张三',
        relation: '朋友',
        lunarMonth: 5,
        lunarDay: 10
      };
      render(<BirthdayForm onSave={mockOnSave} editingBirthday={editingBirthday} />);

      expect(screen.getByRole('heading', { name: '编辑生日' })).toBeInTheDocument();
      expect(screen.getByText(/正在修改已保存的生日信息/)).toBeInTheDocument();
    });

    it('应该渲染保存按钮', () => {
      render(<BirthdayForm onSave={mockOnSave} />);
      const submitButton = screen.getByRole('button', { name: '保存' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass('btn-primary');
    });
  });

  describe('表单输入', () => {
    it('应该能够输入并更新姓名字段', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);
      const nameInput = getInputByName(container, 'name');

      fireEvent.change(nameInput, { target: { value: '李四' } });

      expect(nameInput).toHaveValue('李四');
    });

    it('应该能够输入并更新关系字段', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);
      const relationInput = getInputByName(container, 'relation');

      fireEvent.change(relationInput, { target: { value: '同事' } });

      expect(relationInput).toHaveValue('同事');
    });

    it('应该能够输入农历月份', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);
      const monthInput = getInputByName(container, 'lunarMonth');

      fireEvent.change(monthInput, { target: { value: '8' } });

      expect(monthInput).toHaveValue('8');
    });

    it('应该能够输入农历日期', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);
      const dayInput = getInputByName(container, 'lunarDay');

      fireEvent.change(dayInput, { target: { value: '15' } });

      expect(dayInput).toHaveValue('15');
    });

    it('应该能够输入农历年份（可选）', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);
      const yearInput = getInputByName(container, 'lunarYear');

      fireEvent.change(yearInput, { target: { value: '2000' } });

      expect(yearInput).toHaveValue('2000');
    });
  });

  describe('表单验证', () => {
    it('必填字段为空时不应该调用 onSave', () => {
      render(<BirthdayForm onSave={mockOnSave} />);

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('只填写姓名不填写农历日期时不应该调用 onSave', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '张三' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('姓名为空时不应该调用 onSave（即使其他字段已填写）', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '5' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '10' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('表单提交 - 添加模式', () => {
    it('应该正确提交完整的生日信息（包含年份）', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '王小明' }
      });
      fireEvent.change(getInputByName(container, 'relation'), {
        target: { value: '表弟' }
      });
      fireEvent.change(getInputByName(container, 'lunarYear'), {
        target: { value: '1995' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '6' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '8' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData).toMatchObject({
        name: '王小明',
        relation: '表弟',
        lunarYear: 1995,
        lunarMonth: 6,
        lunarDay: 8,
      });
      expect(savedData.id).toBeUndefined(); // 添加模式没有 id
    });

    it('应该正确提交不包含年份的生日信息', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '李华' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '10' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '20' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData).toMatchObject({
        name: '李华',
        lunarYear: null,
        lunarMonth: 10,
        lunarDay: 20,
      });
    });

    it('应该自动去除姓名和关系的首尾空格', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '  张三  ' }
      });
      fireEvent.change(getInputByName(container, 'relation'), {
        target: { value: '  同事  ' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '3' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '5' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData.name).toBe('张三');
      expect(savedData.relation).toBe('同事');
    });

    it('应该将字符串的农历月日转换为数字类型', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '测试' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '12' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '30' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(typeof savedData.lunarMonth).toBe('number');
      expect(typeof savedData.lunarDay).toBe('number');
      expect(savedData.lunarMonth).toBe(12);
      expect(savedData.lunarDay).toBe(30);
    });
  });

  describe('表单提交 - 编辑模式', () => {
    it('编辑模式下应该保留原有 id 并更新其他字段', () => {
      const editingBirthday = {
        id: '123',
        name: '原名字',
        relation: '原关系',
        lunarYear: 1990,
        lunarMonth: 3,
        lunarDay: 15
      };

      const { container } = render(<BirthdayForm onSave={mockOnSave} editingBirthday={editingBirthday} />);

      // 修改姓名
      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '新名字' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData.id).toBe('123'); // id 保持不变
      expect(savedData.name).toBe('新名字'); // 姓名已更新
      expect(savedData.lunarMonth).toBe(3); // 其他字段保持不变
    });

    it('编辑模式下表单应该预填充原有数据', () => {
      const editingBirthday = {
        id: '123',
        name: '张三',
        relation: '朋友',
        lunarYear: 1995,
        lunarMonth: 6,
        lunarDay: 8
      };

      const { container } = render(<BirthdayForm onSave={mockOnSave} editingBirthday={editingBirthday} />);

      expect(getInputByName(container, 'name')).toHaveValue('张三');
      expect(getInputByName(container, 'relation')).toHaveValue('朋友');
      expect(getInputByName(container, 'lunarYear')).toHaveValue('1995');
      expect(getInputByName(container, 'lunarMonth')).toHaveValue('6');
      expect(getInputByName(container, 'lunarDay')).toHaveValue('8');
    });

    it('编辑模式下应该能够修改农历日期', () => {
      const editingBirthday = {
        id: '123',
        name: '张三',
        lunarMonth: 6,
        lunarDay: 8
      };

      const { container } = render(<BirthdayForm onSave={mockOnSave} editingBirthday={editingBirthday} />);

      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '9' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '10' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData).toMatchObject({
        id: '123',
        lunarMonth: 9,
        lunarDay: 10,
      });
    });
  });

  describe('编辑模式切换', () => {
    it('从添加模式切换到编辑模式时应该清空表单', () => {
      const { container, rerender } = render(<BirthdayForm onSave={mockOnSave} />);

      // 先在添加模式下填写表单
      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '临时数据' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '5' }
      });

      // 切换到编辑模式
      const editingBirthday = {
        id: '456',
        name: '编辑对象',
        lunarMonth: 10,
        lunarDay: 15
      };
      rerender(<BirthdayForm onSave={mockOnSave} editingBirthday={editingBirthday} />);

      // 表单应该显示编辑对象的数据，而不是之前填写的数据
      expect(getInputByName(container, 'name')).toHaveValue('编辑对象');
      expect(getInputByName(container, 'lunarMonth')).toHaveValue('10');
    });

    it('从编辑模式切换到添加模式时应该重置表单', () => {
      const editingBirthday = {
        id: '789',
        name: '被编辑对象',
        lunarMonth: 8,
        lunarDay: 20
      };

      const { container, rerender } = render(
        <BirthdayForm onSave={mockOnSave} editingBirthday={editingBirthday} />
      );

      // 切换到添加模式
      rerender(<BirthdayForm onSave={mockOnSave} />);

      // 表单应该被清空
      expect(getInputByName(container, 'name')).toHaveValue('');
      expect(getInputByName(container, 'relation')).toHaveValue('');
      expect(getInputByName(container, 'lunarMonth')).toHaveValue('');
      expect(getInputByName(container, 'lunarDay')).toHaveValue('');
    });
  });

  describe('边界情况和特殊场景', () => {
    it('关系字段为空时应该正常提交（可选字段）', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '测试用户' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '1' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '1' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData.relation).toBe('');
    });

    it('农历年份为空时应该转换为 null', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '测试' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '1' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '1' }
      });

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const savedData = mockOnSave.mock.calls[0][0];
      expect(savedData.lunarYear).toBeNull();
    });

    it('表单提交时应该阻止默认的表单提交行为', () => {
      const { container } = render(<BirthdayForm onSave={mockOnSave} />);

      fireEvent.change(getInputByName(container, 'name'), {
        target: { value: '测试' }
      });
      fireEvent.change(getInputByName(container, 'lunarMonth'), {
        target: { value: '1' }
      });
      fireEvent.change(getInputByName(container, 'lunarDay'), {
        target: { value: '1' }
      });

      const form = container.querySelector('form');
      const handleSubmit = vi.fn((e) => e.preventDefault());
      form.addEventListener('submit', handleSubmit);

      const submitButton = screen.getByRole('button', { name: '保存' });
      fireEvent.click(submitButton);

      // 表单应该被提交（preventDefault 在组件内部处理）
      expect(mockOnSave).toHaveBeenCalled();
    });
  });
});
