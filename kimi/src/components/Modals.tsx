import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cake } from 'lucide-react';
import { Birthday, LangCode } from '../types';

interface BirthdayDetailModalProps {
  birthday: Birthday & { solarDate: Date; daysRemaining: number; age: number };
  onClose: () => void;
  translations: {
    ageSuffix: string;
    lunar: string;
    solar: string;
    upcoming: string;
    later: string;
    todayTag: string;
  };
}

/**
 * 生日详情模态框组件
 */
export const BirthdayDetailModal: React.FC<BirthdayDetailModalProps> = ({
  birthday,
  onClose,
  translations
}) => {
  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] p-8 w-full max-w-sm cute-shadow border-8 border-white relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} className="text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mb-4">
            <Cake className="text-pink-500" size={40} />
          </div>
          <h3 className="text-3xl font-black text-slate-800">{birthday.name}</h3>
          <p className="text-pink-500 font-bold mt-1 text-sm">
            {birthday.relationship} · {birthday.age}
            {translations.ageSuffix}
          </p>
          <div className="mt-6 w-full space-y-3">
            <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-2 gap-2 text-left">
              <div>
                <p className="text-xs font-black text-slate-400">{translations.lunar}</p>
                <p className="font-bold text-base">
                  {birthday.lunarDate.month}/{birthday.lunarDate.day}
                </p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400">{translations.solar}</p>
                <p className="font-bold text-base">
                  {birthday.solarDate.getMonth() + 1}/{birthday.solarDate.getDate()}
                </p>
              </div>
            </div>
            <div
              className={`p-4 rounded-2xl font-black text-white text-xl ${
                birthday.daysRemaining === 0 ? 'bg-pink-500' : 'bg-orange-400'
              }`}
            >
              {birthday.daysRemaining === 0
                ? translations.todayTag
                : `${translations.upcoming} ${birthday.daysRemaining}${translations.later}`}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface AddBirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, relationship: string, year: number, month: number, day: number) => void;
  translations: {
    add: string;
    name: string;
    rel: string;
    year: string;
    month: string;
    day: string;
    cancel: string;
    submit: string;
  };
}

/**
 * 添加生日模态框组件
 */
export const AddBirthdayModal: React.FC<AddBirthdayModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  translations
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(
      formData.get('n') as string,
      formData.get('r') as string,
      parseInt(formData.get('y') as string),
      parseInt(formData.get('m') as string),
      parseInt(formData.get('d') as string)
    );
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 w-full max-w-sm cute-shadow border-8 border-white"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-black mb-6">{translations.add}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            name="n"
            placeholder={translations.name}
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-bold text-sm"
          />
          <input
            required
            name="r"
            placeholder={translations.rel}
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-bold text-sm"
          />
          <input
            required
            name="y"
            type="number"
            defaultValue={new Date().getFullYear()}
            placeholder={translations.year}
            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-bold text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              name="m"
              className="px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-bold text-sm"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}月
                </option>
              ))}
            </select>
            <select
              name="d"
              className="px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-pink-200 outline-none font-bold text-sm"
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}日
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border-2 border-slate-100 text-slate-400 font-bold text-sm"
            >
              {translations.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-pink-500 text-white font-black text-sm"
            >
              {translations.submit}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
