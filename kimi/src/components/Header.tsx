import React from 'react';
import { motion } from 'framer-motion';
import { Cake, Globe } from 'lucide-react';
import { LangCode } from '../types';

interface HeaderProps {
  lang: LangCode;
  onLanguageChange: (lang: LangCode) => void;
  title: string;
  slogan: string;
}

/**
 * 页面头部组件
 * 包含标题、语言切换和当前日期显示
 */
export const Header: React.FC<HeaderProps> = ({ lang, onLanguageChange, title, slogan }) => {
  const currentLocale = lang === 'en' ? 'en-US' : lang === 'zh-TW' ? 'zh-TW' : 'zh-CN';

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-lg px-4 py-2.5 rounded-[2rem] cute-shadow border-4 border-white flex-shrink-0 gap-3">
      <div className="flex items-center gap-2.5">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="bg-pink-100 p-2 rounded-full shadow-inner"
        >
          <Cake className="text-pink-500" size={22} />
        </motion.div>
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-pink-500/90 font-bold mt-0.5">
            {slogan}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center bg-slate-100 rounded-full p-1 border-2 border-white shadow-inner">
          <Globe size={12} className="mx-2 text-slate-400" />
          <button
            onClick={() => onLanguageChange('zh-CN')}
            className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${
              lang === 'zh-CN' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'
            }`}
          >
            简
          </button>
          <button
            onClick={() => onLanguageChange('zh-TW')}
            className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${
              lang === 'zh-TW' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'
            }`}
          >
            繁
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${
              lang === 'en' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-400'
            }`}
          >
            EN
          </button>
        </div>
        <div className="hidden md:block text-sm text-pink-500 font-black bg-pink-50 px-4 py-1.5 rounded-full border-2 border-pink-100 shadow-sm">
          ✨ {new Date().toLocaleDateString(currentLocale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </div>
      </div>
    </header>
  );
};
