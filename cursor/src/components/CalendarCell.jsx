import React from 'react';
import { motion } from 'framer-motion';
import { solarToLunar } from '../utils/date.js';

export default function CalendarCell({
  date,
  inCurrentMonth,
  isToday,
  birthdays = [],
  holidayName,
  isUpcomingBirthdayDay,
  onClick
}) {
  const hasBirthday = birthdays.length > 0;

  const lunarInfo = inCurrentMonth ? solarToLunar(date) : null;
  // solarlunar 库返回的字段：monthCn (如"正月") 和 dayCn (如"初一")
  const lunarLabel = lunarInfo && lunarInfo.monthCn && lunarInfo.dayCn 
    ? `${lunarInfo.monthCn}${lunarInfo.dayCn}` 
    : '';

  // 非当前月份的单元格完全不可见
  if (!inCurrentMonth) {
    return <div className="calendar-cell cell-invisible"></div>;
  }

  const baseClasses = [
    'calendar-cell',
    'cell-current',
    isToday ? 'cell-today' : '',
    hasBirthday ? 'cell-birthday' : '',
    holidayName ? 'cell-holiday' : ''
  ]
    .filter(Boolean)
    .join(' ');

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

  const tooltipText = [
    hasBirthday
      ? birthdays.map((b) => `${b.name}${b.relation ? `（${b.relation}）` : ''}`).join('、')
      : '',
    holidayName ? `节日：${holidayName}` : ''
  ]
    .filter(Boolean)
    .join(' ｜ ');

  const handleClick = () => {
    if (hasBirthday && onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={baseClasses}
      title={tooltipText}
      onClick={handleClick}
      style={{ cursor: hasBirthday ? 'pointer' : 'default' }}
      {...motionProps}
    >
      {content}
    </motion.div>
  );
}

