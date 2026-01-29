import { useState, useEffect } from 'react';
import { LangCode } from '../types';

/**
 * 语言设置 Hook
 * 负责语言切换和本地存储
 */
export const useLanguage = () => {
  const [lang, setLang] = useState<LangCode>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as LangCode) || 'zh-CN';
  });

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  // 获取当前语言对应的日期格式化区域
  const getCurrentLocale = () => {
    return lang === 'en' ? 'en-US' : lang === 'zh-TW' ? 'zh-TW' : 'zh-CN';
  };

  return {
    lang,
    setLang,
    getCurrentLocale
  };
};
