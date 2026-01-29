import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Birthday, UpcomingBirthday, LangCode } from './types';
import { getNextSolarBirthday } from './utils/lunar';
import { createTranslationHook } from './utils/i18n';
import { useBirthdays } from './hooks/useBirthdays';
import { useLanguage } from './hooks/useLanguage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Calendar } from './components/Calendar';
import { BirthdayDetailModal, AddBirthdayModal } from './components/Modals';

/**
 * 主应用组件
 * 整合所有子组件,管理应用状态
 */
const App: React.FC = () => {
  // 语言设置
  const { lang, setLang, getCurrentLocale } = useLanguage();
  const { t, tList } = createTranslationHook(lang);

  // 生日数据管理
  const { birthdays, reminders, addBirthday, deleteBirthday } = useBirthdays();

  // UI 状态
  const [viewDate, setViewDate] = useState(new Date());
  const [showHolidays, setShowHolidays] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<
    (UpcomingBirthday & { age: number }) | null
  >(null);

  // 处理添加生日
  const handleAddBirthday = (
    name: string,
    relationship: string,
    year: number,
    month: number,
    day: number
  ) => {
    addBirthday(name, relationship, year, month, day);
    setShowForm(false);
  };

  // 处理删除生日
  const handleDeleteBirthday = (id: string) => {
    if (confirm(t('deleteConfirm'))) {
      deleteBirthday(id);
    }
  };

  // 导航到生日所在月份
  const handleNavigateToBirthday = (b: Birthday) => {
    const solar = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
    setViewDate(new Date(solar.getFullYear(), solar.getMonth(), 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理生日点击
  const handleBirthdayClick = (b: Birthday, age: number) => {
    const solar = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
    const diff = Math.ceil(
      (solar.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );
    setSelectedBirthday({ ...b, solarDate: solar, daysRemaining: diff, age });
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-3 md:p-6 min-h-screen flex flex-col gap-4">
      {/* 头部 */}
      <Header lang={lang} onLanguageChange={setLang} title={t('title')} slogan={t('slogan')} />

      {/* 主体内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 侧边栏 */}
        <Sidebar
          reminders={reminders}
          birthdays={birthdays}
          onAddBirthday={() => setShowForm(true)}
          onDeleteBirthday={handleDeleteBirthday}
          onSelectReminder={setSelectedBirthday}
          onNavigateToBirthday={handleNavigateToBirthday}
          translations={{
            recent: t('recent'),
            buddies: t('buddies'),
            add: t('add'),
            willBe: t('willBe'),
            ageSuffix: t('ageSuffix'),
            todayTag: t('todayTag'),
            later: t('later'),
            noReminders: t('noReminders'),
            lunar: t('lunar'),
            noBuddies: t('noBuddies')
          }}
        />

        {/* 日历 */}
        <div className="lg:col-span-9">
          <Calendar
            viewDate={viewDate}
            birthdays={birthdays}
            showHolidays={showHolidays}
            lang={lang}
            onViewDateChange={setViewDate}
            onShowHolidaysChange={setShowHolidays}
            onBirthdayClick={handleBirthdayClick}
            translations={{
              showHolidays: t('showHolidays'),
              today: t('today'),
              weekDays: tList('weekDays') as string[]
            }}
          />
        </div>
      </div>

      {/* 模态框 */}
      <AnimatePresence>
        {selectedBirthday && (
          <BirthdayDetailModal
            birthday={selectedBirthday}
            onClose={() => setSelectedBirthday(null)}
            translations={{
              ageSuffix: t('ageSuffix'),
              lunar: t('lunar'),
              solar: t('solar'),
              upcoming: t('upcoming'),
              later: t('later'),
              todayTag: t('todayTag')
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <AddBirthdayModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddBirthday}
          translations={{
            add: t('add'),
            name: t('name'),
            rel: t('rel'),
            year: t('year'),
            month: t('month'),
            day: t('day'),
            cancel: t('cancel'),
            submit: t('submit')
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default App;
