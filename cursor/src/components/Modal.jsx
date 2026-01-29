import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* 弹框内容 */}
          <div className="modal-container">
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* 弹框头部 */}
              <div className="modal-header">
                <h2 id="modal-title" className="modal-title">{title}</h2>
                <button
                  className="modal-close-button"
                  onClick={onClose}
                  aria-label="关闭弹框"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* 弹框主体 */}
              <div className="modal-body">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
