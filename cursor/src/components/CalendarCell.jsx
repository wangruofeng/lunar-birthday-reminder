import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { solarToLunar } from '../utils/date.js';

export default function CalendarCell({
  date,
  inCurrentMonth,
  isToday,
  birthdays = [],
  holidayName,
  isUpcomingBirthdayDay
}) {
  const [isHovered, setIsHovered] = useState(false);
  const hasBirthday = birthdays.length > 0;

  const lunarInfo = inCurrentMonth ? solarToLunar(date) : null;
  // solarlunar 库返回的字段：monthCn (如"正月") 和 dayCn (如"初一")
  const lunarLabel = lunarInfo && lunarInfo.monthCn && lunarInfo.dayCn 
    ? `${lunarInfo.monthCn}${lunarInfo.dayCn}` 
    : '';

  const baseClasses = [
    'calendar-cell',
    inCurrentMonth ? 'cell-current' : 'cell-outside',
    isToday ? 'cell-today' : '',
    hasBirthday ? 'cell-birthday' : '',
    holidayName ? 'cell-holiday' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipText = [
    hasBirthday
      ? birthdays.map((b) => `${b.name}${b.relation ? `（${b.relation}）` : ''}`).join('、')
      : '',
    holidayName ? `节日：${holidayName}` : ''
  ]
    .filter(Boolean)
    .join(' ｜ ');

  const content = (
    <div className="cell-inner">
      <div className="cell-date-row">
        {inCurrentMonth && <span className="cell-date-number">{date.getDate()}</span>}
        {holidayName && <span className="cell-holiday-badge">{holidayName}</span>}
      </div>
      <div className="cell-lunar-row">
        {lunarLabel && <span className="cell-lunar-text">{lunarLabel}</span>}
      </div>
      <div className="cell-bottom-row">
        {hasBirthday && (
          <motion.span
            className="cell-birthday-chip"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            🎂 {birthdays.length}
          </motion.span>
        )}
      </div>

      {hasBirthday && isHovered && (
        <div className="cell-tooltip-wrapper">
          <motion.div
            className="cell-tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <div className="cell-tooltip-header">
              <span className="cell-tooltip-icon">🎂</span>
              <span className="cell-tooltip-title">当日生日</span>
              <span className="cell-tooltip-count">({birthdays.length})</span>
            </div>
            <div className="cell-tooltip-divider"></div>
            <div className="cell-tooltip-list">
              {birthdays.map((b) => (
                <div key={b.id} className="cell-tooltip-item">
                  <div className="cell-tooltip-name-row">
                    <span className="cell-tooltip-name">{b.name}</span>
                    {b.relation && (
                      <span className="cell-tooltip-relation">（{b.relation}）</span>
                    )}
                  </div>
                  <div className="cell-tooltip-meta">
                    农历 {b.lunarMonth} 月 {b.lunarDay} 日
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  // 不在当前月份的单元格也渲染，保持网格布局正确
  const motionProps = {
    whileHover: inCurrentMonth ? { scale: 1.02 } : {},
    whileTap: inCurrentMonth ? { scale: 0.97 } : {},
    transition: { duration: 0.15 }
  };

  if (isUpcomingBirthdayDay && inCurrentMonth) {
    motionProps.animate = {
      boxShadow: [
        '0 0 0 0 rgba(248, 113, 113, 0.4)',
        '0 0 0 6px rgba(248, 113, 113, 0)',
        '0 0 0 0 rgba(248, 113, 113, 0)'
      ]
    };
    motionProps.transition = {
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeOut'
    };
  }

  return (
    <motion.div
      className={baseClasses}
      title={tooltipText}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...motionProps}
    >
      {content}
    </motion.div>
  );
}

