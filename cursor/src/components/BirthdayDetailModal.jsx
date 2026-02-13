import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { lunarToSolar, startOfDay } from '../utils/date.js';

export default function BirthdayDetailModal({ isOpen, onClose, date, birthdays = [] }) {
  // 计算年龄
  const calculateAge = (birthday) => {
    // 如果没有出生年份，返回 null
    if (!birthday.lunarYear) return null;

    // 将农历出生日期转换为公历出生日期
    const birthSolar = lunarToSolar(birthday.lunarYear, birthday.lunarMonth, birthday.lunarDay);
    if (!birthSolar) return null;

    // 计算基础年龄：当前公历年份 - 出生公历年份
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthSolar.year;

    return age;
  };

  // 格式化日期
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekday}`;
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.92,
      y: 16
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 8,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const listItemVariants = {
    hidden: {
      opacity: 0,
      x: -12
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* 背景遮罩 - 透明版本 */}
          <motion.div
            className="modal-overlay"
            style={{
              background: 'transparent',
              backdropFilter: 'none'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* 弹框内容 */}
          <div className="modal-container">
            <motion.div
              className="modal-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
            >
              {/* 弹框头部 */}
              <div className="modal-header">
                <motion.h2
                  className="modal-title"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  🎂 当日生日
                </motion.h2>
                <button
                  className="modal-close-button"
                  onClick={onClose}
                  aria-label="关闭弹框"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* 弹框主体 */}
              <div className="modal-body">
                <motion.div
                  style={{ marginBottom: '20px', color: 'var(--color-slate)', fontSize: '14px' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                >
                  {formatDate(date)}
                </motion.div>

                {birthdays.length === 0 ? (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                  >
                    当日没有生日记录
                  </motion.div>
                ) : (
                  <div className="list-body">
                    {birthdays.map((b, i) => {
                      const age = calculateAge(b);
                      return (
                        <motion.div
                          key={b.id}
                          className="birthday-item"
                          custom={i}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="birthday-main" style={{ cursor: 'default' }}>
                            <div className="birthday-name-line">
                              <span className="birthday-name">{b.name}</span>
                              {b.relation && (
                                <span className="birthday-relation">（{b.relation}）</span>
                              )}
                              {age !== null && (
                                <span style={{
                                  fontSize: '12px',
                                  color: 'var(--color-deep-rose)',
                                  fontWeight: '500',
                                  marginLeft: '8px'
                                }}>
                                  {age} 岁
                                </span>
                              )}
                            </div>
                            <div className="birthday-meta">
                              农历 {b.lunarMonth} 月 {b.lunarDay} 日
                              {b.lunarYear && (
                                <span style={{ marginLeft: '8px' }}>
                                  · 农历 {b.lunarYear} 年生
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
