import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const initialForm = {
  name: '',
  relation: '',
  lunarYear: '',
  lunarMonth: '',
  lunarDay: ''
};

export default function BirthdayForm({ onSave, editingBirthday }) {
  const [form, setForm] = useState(initialForm);

  // 当进入 / 退出编辑状态时，同步表单内容
  useEffect(() => {
    if (editingBirthday) {
      setForm({
        name: editingBirthday.name || '',
        relation: editingBirthday.relation || '',
        lunarYear: editingBirthday.lunarYear ? String(editingBirthday.lunarYear) : '',
        lunarMonth: editingBirthday.lunarMonth ? String(editingBirthday.lunarMonth) : '',
        lunarDay: editingBirthday.lunarDay ? String(editingBirthday.lunarDay) : ''
      });
    } else {
      setForm(initialForm);
    }
  }, [editingBirthday]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.lunarMonth || !form.lunarDay) return;

    const base = {
      name: form.name.trim(),
      relation: form.relation.trim(),
      lunarYear: form.lunarYear ? Number(form.lunarYear) : null,
      lunarMonth: Number(form.lunarMonth),
      lunarDay: Number(form.lunarDay)
    };

    if (editingBirthday) {
      onSave({ ...editingBirthday, ...base });
    } else {
      onSave(base);
    }
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="card form-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-header">
        <h2 className="card-title">{editingBirthday ? '编辑生日' : '添加生日'}</h2>
        <p className="card-subtitle">
          支持中国农历，系统会自动换算为公历用于提醒和日历展示。
          {editingBirthday && ' 正在修改已保存的生日信息。'}
        </p>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>姓名</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="例如：小明"
          />
        </div>
        <div className="field">
          <label>关系</label>
          <input
            name="relation"
            value={form.relation}
            onChange={handleChange}
            placeholder="例如：表弟 / 同事"
          />
        </div>
        <div className="field">
          <label>农历年份（可选）</label>
          <input
            name="lunarYear"
            value={form.lunarYear}
            onChange={handleChange}
            placeholder="例如：1995"
            inputMode="numeric"
          />
        </div>
        <div className="field">
          <label>农历月份</label>
          <input
            name="lunarMonth"
            value={form.lunarMonth}
            onChange={handleChange}
            placeholder="1 - 12"
            inputMode="numeric"
          />
        </div>
        <div className="field">
          <label>农历日期</label>
          <input
            name="lunarDay"
            value={form.lunarDay}
            onChange={handleChange}
            placeholder="1 - 30"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="form-actions">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
          type="submit"
          className="btn-primary"
        >
          保存
        </motion.button>
      </div>
    </motion.form>
  );
}

