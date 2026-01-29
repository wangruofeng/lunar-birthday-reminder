import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ReminderPanel({ reminders, onTriggerScan, scanning }) {
  const hasReminders = reminders.length > 0;

  return (
    <motion.div
      layout
      className="card reminder-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-header card-header-row">
        <div>
          <h2 className="card-title">未来 7 天提醒</h2>
          <p className="card-subtitle">自动扫描所有生日，找出最近要过生日的亲友。</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.15 }}
          onClick={onTriggerScan}
          className="btn-outline"
          disabled={scanning}
        >
          {scanning ? '扫描中…' : '手动扫描'}
        </motion.button>
      </div>

      <div className="list-body">
        <AnimatePresence initial={false}>
          {hasReminders ? (
            reminders.map((item) => (
              <motion.div
                key={item.id}
                className="reminder-item"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="reminder-main">
                  <div className="reminder-name-line">
                    <span className="reminder-icon">🎂</span>
                    <span className="reminder-name">{item.name}</span>
                    {item.relation && (
                      <span className="reminder-relation">{item.relation}</span>
                    )}
                    {item.daysDiff === 0 && (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="badge-today"
                      >
                        今天
                      </motion.span>
                    )}
                    {item.daysDiff > 0 && (
                      <span className="badge-soon">{item.daysDiff} 天后</span>
                    )}
                  </div>
                  <div className="reminder-meta">
                    <span>
                      公历：{item.solarDateString}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty-reminder"
              className="empty-state empty-reminder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="empty-pulse"
                animate={{ opacity: [0.4, 1, 0.4], y: [0, -2, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                未来 7 天内没有即将过生日的亲友。
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

