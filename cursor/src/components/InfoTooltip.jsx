import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfoTooltip({ children }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    if (isHovered && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // 预估宽度

      setTooltipStyle({
        position: 'fixed',
        left: `${rect.right + 8}px`,
        top: `${rect.top + rect.height / 2}px`,
        transform: 'translateY(-50%)',
      });
    }
  }, [isHovered]);

  return (
    <div
      ref={wrapperRef}
      className="info-tooltip-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        className="info-icon-btn"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        aria-label="提示信息"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path
            d="M8 5V8M8 11H8.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>

      {isHovered &&
        createPortal(
          <AnimatePresence>
            <motion.div
              className="info-tooltip"
              style={tooltipStyle}
              initial={{ opacity: 0, x: 4, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 4, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="info-tooltip-content">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      }
    </div>
  );
}
