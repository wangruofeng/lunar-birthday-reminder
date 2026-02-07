import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Users, Plus, Trash2 } from 'lucide-react';
import { Birthday, UpcomingBirthday } from '../types';
import { getNextSolarBirthday } from '../utils/lunar';

interface SidebarProps {
  reminders: (UpcomingBirthday & { age: number })[];
  birthdays: Birthday[];
  onAddBirthday: () => void;
  onDeleteBirthday: (id: string) => void;
  onSelectReminder: (reminder: UpcomingBirthday & { age: number }) => void;
  onNavigateToBirthday: (birthday: Birthday) => void;
  translations: {
    recent: string;
    buddies: string;
    add: string;
    willBe: string;
    ageSuffix: string;
    todayTag: string;
    later: string;
    noReminders: string;
    lunar: string;
    solar: string;
    noBuddies: string;
  };
}

/**
 * 侧边栏组件
 * 包含即将到来的生日提醒和小伙伴列表
 */
export const Sidebar: React.FC<SidebarProps> = ({
  reminders,
  birthdays,
  onAddBirthday,
  onDeleteBirthday,
  onSelectReminder,
  onNavigateToBirthday,
  translations
}) => {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4 sticky lg:top-4">
      {/* 小伙伴列表区域 */}
      <section className="bg-white rounded-[2rem] p-4 cute-shadow border-4 border-white">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-800">
          <Users className="text-blue-400" size={20} /> {translations.buddies}
        </h2>
        <div className="overflow-y-auto max-h-[240px] custom-scrollbar space-y-2 pr-2 mb-4">
          {birthdays.map(b => {
            const solarDate = getNextSolarBirthday(b.lunarDate.month, b.lunarDate.day);
            return (
              <div
                key={b.id}
                onClick={() => onNavigateToBirthday(b)}
                className="group flex items-center justify-between p-2.5 rounded-[1rem] hover:bg-slate-50 transition-all cursor-pointer bg-slate-50/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-700 truncate">{b.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-[12px] text-slate-500 font-bold">
                      {translations.lunar} {b.lunarDate.month}/{b.lunarDate.day}
                    </p>
                    <p className="text-[12px] text-slate-400 font-bold">
                      {translations.solar} {solarDate.getMonth() + 1}/{solarDate.getDate()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteBirthday(b.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-400 rounded-full transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={onAddBirthday}
            className="w-full bg-pink-500 text-white py-2.5 rounded-full flex items-center justify-center gap-2 font-black text-sm shadow-lg shadow-pink-100"
          >
            <Plus size={18} strokeWidth={3} /> {translations.add}
          </button>
        </div>
      </section>

      {/* 最近提醒区域 */}
      <section className="bg-white rounded-[2rem] p-4 cute-shadow border-4 border-white">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-slate-800">
          <Bell className="text-orange-400" size={20} /> {translations.recent}
        </h2>
        <div className="space-y-2.5 overflow-y-auto max-h-[180px] custom-scrollbar pr-2">
          {reminders.length > 0 ? (
            reminders.map(r => (
              <motion.div
                key={r.id}
                onClick={() => onSelectReminder(r)}
                className={`p-3 rounded-[1.2rem] border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                  r.daysRemaining === 0
                    ? 'bg-pink-50 border-pink-100'
                    : 'bg-orange-50 border-orange-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-sm truncate">{r.name}</span>
                    <span className="text-[11px] font-bold opacity-70">
                      {translations.willBe} {r.age}
                      {translations.ageSuffix}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                      r.daysRemaining === 0
                        ? 'bg-pink-500 text-white animate-pulse'
                        : 'bg-orange-400 text-white'
                    }`}
                  >
                    {r.daysRemaining === 0 ? translations.todayTag : `${r.daysRemaining}${translations.later}`}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs font-bold">
              {translations.noReminders}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
