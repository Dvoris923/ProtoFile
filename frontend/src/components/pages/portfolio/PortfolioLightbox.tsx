import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from './portfolioData';

interface PortfolioLightboxProps {
  selectedImage: PortfolioItem | null;
  onClose: () => void;
}

export const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({ selectedImage, onClose }) => {
  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-3 text-center">
              <span className="block text-[14px] sm:text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                {selectedImage.gradeGroup
                  ? `${selectedImage.category} • ${selectedImage.gradeGroup}`
                  : selectedImage.category}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
