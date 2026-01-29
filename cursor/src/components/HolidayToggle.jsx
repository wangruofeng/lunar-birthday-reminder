import React from 'react';
import { motion } from 'framer-motion';

export default function HolidayToggle({ enabled, onToggle }) {
  return (
    <div className="holiday-toggle">
      <span className="holiday-label">显示中国法定节假日</span>
      <motion.button
        type="button"
        className={`toggle-root ${enabled ? 'toggle-on' : 'toggle-off'}`}
        onClick={() => onToggle(!enabled)}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="toggle-track"
          layout
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="toggle-thumb"
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}

