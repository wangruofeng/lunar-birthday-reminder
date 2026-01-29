import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CalendarCell from './CalendarCell.jsx';
import { getMonthMatrix, getHolidayName, startOfDay, lunarBirthdayToNextSolar } from '../utils/date.js';

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

export default function Calendar({ year, monthIndex, birthdays, showHolidays, today }) {
  const todayStart = startOfDay(today);

  const { cells, birthdayMap, upcomingDays, monthBirthdayCount } = useMemo(() => {
    const matrix = getMonthMatrix(year, monthIndex);

    const map = new Map();
    let count = 0;

    birthdays.forEach((b) => {
      const targetYear = year;
      const nextSolar = lunarBirthdayToNextSolar(
        { lunarMonth: b.lunarMonth, lunarDay: b.lunarDay },
        new Date(targetYear, monthIndex, 1)
      );

      if (!nextSolar) return;
      if (nextSolar.getFullYear() !== year || nextSolar.getMonth() !== monthIndex) return;

      const day = nextSolar.getDate();
      const key = day;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(b);
      count += 1;
    });

    // 找出本月中“未来 7 天内即将过生日”的日期，用于轻微脉冲动画
    const upcomingSet = new Set();
    birthdays.forEach((b) => {
      const nextSolar = lunarBirthdayToNextSolar(
        { lunarMonth: b.lunarMonth, lunarDay: b.lunarDay },
        todayStart
      );
      if (!nextSolar) return;
      const diff = (nextSolar - todayStart) / (1000 * 60 * 60 * 24);
      if (diff >= 0 && diff <= 7 && nextSolar.getMonth() === monthIndex && nextSolar.getFullYear() === year) {
        upcomingSet.add(nextSolar.getDate());
      }
    });

    return {
      cells: matrix,
      birthdayMap: map,
      upcomingDays: upcomingSet,
      monthBirthdayCount: count
    };
  }, [year, monthIndex, birthdays, todayStart]);

  const headerKey = `${year}-${monthIndex}`;

  return (
    <motion.div
      layout
      className="card calendar-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-header calendar-header">
        <div>
          <h2 className="card-title">
            {year} 年 {monthNames[monthIndex]}
          </h2>
          <p className="card-subtitle">支持生日标记、节假日标识与今日高亮。</p>
        </div>
        <div className="calendar-meta">
          <span className="calendar-meta-label">本月生日人数：</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={monthBirthdayCount}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="calendar-count"
            >
              {monthBirthdayCount}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="calendar-grid-wrapper">
        <div className="calendar-weekdays">
          {weekdayNames.map((w) => (
            <div key={w} className="calendar-weekday">
              {w}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={headerKey}
            className="calendar-grid"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {cells.map((cell) => {
              const isToday =
                cell.date.getTime() === todayStart.getTime();
              const day = cell.date.getDate();
              const birthdaysOnDay = cell.inCurrentMonth ? birthdayMap.get(day) || [] : [];
              const holidayName = showHolidays && cell.inCurrentMonth ? getHolidayName(cell.date) : null;
              const isUpcoming = upcomingDays.has(day) && cell.inCurrentMonth;

              return (
                <CalendarCell
                  key={cell.date.toISOString()}
                  date={cell.date}
                  inCurrentMonth={cell.inCurrentMonth}
                  isToday={isToday}
                  birthdays={birthdaysOnDay}
                  holidayName={holidayName}
                  isUpcomingBirthdayDay={isUpcoming}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

