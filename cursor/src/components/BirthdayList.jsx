import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { lunarToSolar } from '../utils/date';

export default function BirthdayList({
  birthdays,
  onDelete,
  onEdit,
  onJumpToMonth
}) {
  // 始终使用真实的当前年份，而不是日历显示的年份
  const realCurrentYear = new Date().getFullYear();

  return (
    <motion.div
      layout
      className="card list-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-header">
        <h2 className="card-title">生日列表</h2>
        <p className="card-subtitle">管理所有亲友的生日信息，可随时删除。</p>
      </div>

      <div className="list-body">
        <AnimatePresence initial={false}>
          {birthdays.length === 0 ? (
            <motion.div
              key="empty"
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              还没有添加任何生日。
            </motion.div>
          ) : (
            birthdays.map((b) => {
              // 计算今年（真实当前年份）这个农历生日对应的公历日期
              const solar = lunarToSolar(
                realCurrentYear,
                b.lunarMonth,
                b.lunarDay
              );
              const solarText = solar
                ? `${solar.year}-${String(solar.month).padStart(2, '0')}-${String(
                    solar.day
                  ).padStart(2, '0')}`
                : '转换失败';

              return (
                <motion.div
                  layout
                  key={b.id}
                  className="birthday-item"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    className="birthday-main"
                    onClick={() => onJumpToMonth && onJumpToMonth(b)}
                  >
                    <div className="birthday-name-line">
                      <span className="birthday-name">{b.name}</span>
                      {b.relation && <span className="birthday-relation">{b.relation}</span>}
                    </div>
                    <div className="birthday-meta">
                      <span>
                        农历：{b.lunarMonth} 月 {b.lunarDay} 日
                      </span>
                      <span className="dot">·</span>
                      <span>今年生日：{solarText}</span>
                    </div>
                  </button>
                  <div className="birthday-actions">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="btn-ghost"
                      onClick={() => onEdit && onEdit(b)}
                    >
                      编辑
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="btn-ghost"
                      onClick={() => onDelete(b.id)}
                    >
                      删除
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

