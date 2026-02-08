import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthdayForm from './components/BirthdayForm.jsx';
import BirthdayList from './components/BirthdayList.jsx';
import ReminderPanel from './components/ReminderPanel.jsx';
import Calendar from './components/Calendar.jsx';
import HolidayToggle from './components/HolidayToggle.jsx';
import Modal from './components/Modal.jsx';
import InfoTooltip from './components/InfoTooltip.jsx';
import { daysBetween, lunarBirthdayToNextSolar, startOfDay } from './utils/date.js';

const STORAGE_KEY = 'birthday-reminder:list';
const HOLIDAY_KEY = 'birthday-reminder:holidays';

export default function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [showHolidays, setShowHolidays] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());

  // 初始化：读取 localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setBirthdays(parsed);
        }
      }
    } catch (err) {
      console.warn('读取生日数据失败:', err);
    }

    try {
      const rawHoliday = window.localStorage.getItem(HOLIDAY_KEY);
      if (rawHoliday != null) {
        setShowHolidays(rawHoliday === 'true');
      }
    } catch {
      // ignore
    }

    // 标记初始化完成
    setIsInitialized(true);
  }, []);

  // 持久化 birthday - 每次 birthdays 变化时自动保存（初始化完成后）
  useEffect(() => {
    if (!isInitialized) return; // 初始化完成前不保存

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
      console.log('✅ 生日数据已保存到 localStorage:', birthdays.length, '条');
    } catch (err) {
      console.error('❌ 保存生日数据失败:', err);
    }
  }, [birthdays, isInitialized]);

  // 持久化节假日开关
  useEffect(() => {
    try {
      window.localStorage.setItem(HOLIDAY_KEY, showHolidays ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [showHolidays]);

  const handleSaveBirthday = (item) => {
    // 带 id 视为编辑；否则为新增
    if (item.id) {
      setBirthdays((prev) => prev.map((b) => (b.id === item.id ? item : b)));
    } else {
      const newItem = {
        ...item,
        id: Date.now().toString()
      };
      setBirthdays((prev) => [...prev, newItem]);
    }
    // 保存后关闭弹框并重置编辑状态
    setEditingBirthday(null);
    setIsModalOpen(false);
  };

  const handleDeleteBirthday = (id) => {
    setBirthdays((prev) => prev.filter((b) => b.id !== id));
  };

  const handleEditBirthday = (b) => {
    setEditingBirthday(b);
    setIsModalOpen(true);
  };

  const handleAddBirthday = () => {
    setEditingBirthday(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // 延迟重置编辑状态，等待动画完成
    setTimeout(() => {
      setEditingBirthday(null);
    }, 300);
  };

  // 从生日列表跳转到对应月份（日历）
  const handleJumpToBirthdayMonth = (b) => {
    const now = today;
    const next = lunarBirthdayToNextSolar(
      { lunarMonth: b.lunarMonth, lunarDay: b.lunarDay },
      now
    );
    const target = next || now;
    setYear(target.getFullYear());
    setMonthIndex(target.getMonth());
  };

  const scanReminders = () => {
    if (!birthdays.length) {
      setReminders([]);
      return;
    }
    setScanning(true);
    // 动画上给一点延迟，主观体验更自然
    window.setTimeout(() => {
      const now = today;
      const upcoming = birthdays
        .map((b) => {
          const next = lunarBirthdayToNextSolar(
            { lunarMonth: b.lunarMonth, lunarDay: b.lunarDay },
            now
          );
          if (!next) return null;
          const diff = daysBetween(now, next);
          if (diff < 0 || diff > 7) return null;

          const solarDateString = `${next.getFullYear()}-${String(
            next.getMonth() + 1
          ).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;

          return {
            id: b.id,
            name: b.name,
            relation: b.relation,
            daysDiff: diff,
            solarDateString
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.daysDiff - b.daysDiff);

      setReminders(upcoming);
      setScanning(false);
    }, 200);
  };

  // 首次加载自动扫描一次
  useEffect(() => {
    scanReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPrevMonth = () => {
    setMonthIndex((prev) => {
      if (prev === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goNextMonth = () => {
    setMonthIndex((prev) => {
      if (prev === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-title-block">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            生日历
          </motion.h1>
          <motion.p
            className="app-slogan"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            农历生日，公历提醒，不再忘记
          </motion.p>
        </div>
      </header>

      <main className="app-main">
        <section className="left-column">
          <div className="left-top-section">
            {/* 添加生日按钮 */}
            <motion.button
              className="btn-primary add-birthday-btn"
              onClick={handleAddBirthday}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 4V16M4 10H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              添加生日
              <InfoTooltip>
                提示：生日以农历录入，但所有提醒和日历标注均基于换算后的公历日期，以便与日常行程更好对齐。
                你可以在左侧列表中点击某个生日，快速跳转到对应的生日月份。
              </InfoTooltip>
            </motion.button>

            <ReminderPanel
              reminders={reminders}
              onTriggerScan={scanReminders}
              scanning={scanning}
            />
          </div>
          <BirthdayList
            birthdays={birthdays}
            onDelete={handleDeleteBirthday}
            onEdit={handleEditBirthday}
            onJumpToMonth={handleJumpToBirthdayMonth}
          />
        </section>

        <section className="right-column">
          <Calendar
            year={year}
            monthIndex={monthIndex}
            birthdays={birthdays}
            showHolidays={showHolidays}
            onToggleHolidays={setShowHolidays}
            today={today}
            goPrevMonth={goPrevMonth}
            goNextMonth={goNextMonth}
            goToToday={() => {
              setYear(today.getFullYear());
              setMonthIndex(today.getMonth());
            }}
          />
        </section>
      </main>

      {/* 弹框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBirthday ? '编辑生日' : '添加生日'}
      >
        <BirthdayForm
          onSave={handleSaveBirthday}
          editingBirthday={editingBirthday}
        />
      </Modal>
    </div>
  );
}
