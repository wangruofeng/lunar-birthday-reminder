import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CalendarCell from './CalendarCell.jsx';
import HolidayToggle from './HolidayToggle.jsx';
import { getMonthMatrix, getHolidayName, startOfDay, lunarToSolar, lunarBirthdayToNextSolar } from '../utils/date.js';

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];

export default function Calendar({ year, monthIndex, birthdays, showHolidays, onToggleHolidays, today, goPrevMonth, goNextMonth, goToToday }) {
  const todayStart = startOfDay(today);

  const { cells, birthdayMap, upcomingDays, monthBirthdayCount } = useMemo(() => {
    const matrix = getMonthMatrix(year, monthIndex);

    const map = new Map();
    let count = 0;

    // 对于农历12月，需要检查两个农历年份（因为会跨年到公历1月）
    const yearsToCheck = monthIndex === 0 ? [year, year - 1] : [year];

    // 先收集所有可能的生日
    const allCandidates = []; // { birthday, solarDate, checkYear }

    yearsToCheck.forEach(checkYear => {
      birthdays.forEach((b) => {
        // 直接计算指定年份的农历生日对应的公历日期
        const solar = lunarToSolar(checkYear, b.lunarMonth, b.lunarDay);

        if (!solar) return;
        // 检查公历日期是否在当前显示的月份
        if (solar.month - 1 !== monthIndex) return;

        const solarDate = new Date(solar.year, solar.month - 1, solar.day);
        allCandidates.push({ birthday: b, solarDate, checkYear, solar });
      });
    });

    // 按生日ID分组，每个生日只保留公历日期最早的那一个
    const byBirthdayId = new Map();
    allCandidates.forEach(candidate => {
      const bid = candidate.birthday.id;
      if (!byBirthdayId.has(bid)) {
        byBirthdayId.set(bid, candidate);
      } else {
        // 比较日期，保留更早的
        const existing = byBirthdayId.get(bid);
        if (candidate.solarDate < existing.solarDate) {
          byBirthdayId.set(bid, candidate);
        }
      }
    });

    // 添加到map中
    byBirthdayId.forEach(candidate => {
      const { birthday: b, solar } = candidate;
      const key = solar.day;
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
      <div className="calendar-card-header">
        <div className="calendar-title-row">
          <h2 className="card-title">
            {year} 年 {monthNames[monthIndex]}
          </h2>
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

      <div className="calendar-controls-row">
        <div className="calendar-controls">
          <motion.button
            className="btn-ghost btn-small"
            onClick={goPrevMonth}
            whileTap={{ scale: 0.95 }}
          >
            上一月
          </motion.button>
          <motion.button
            className="btn-text btn-small"
            onClick={goToToday}
            whileTap={{ scale: 0.96 }}
          >
            回到本月
          </motion.button>
          <motion.button
            className="btn-ghost btn-small"
            onClick={goNextMonth}
            whileTap={{ scale: 0.95 }}
          >
            下一月
          </motion.button>
        </div>
        <HolidayToggle enabled={showHolidays} onToggle={onToggleHolidays} />
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

