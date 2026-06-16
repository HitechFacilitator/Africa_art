"use client";

import { motion, AnimatePresence } from "motion/react";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  submessage?: string;
}

export default function LoadingModal({ isOpen, message = "Processing...", submessage }: LoadingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ebony-deep/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-parchment-ivory border border-gold-leaf/20 shadow-2xl p-8 max-w-sm w-full text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-5">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-gold-leaf/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-gold-leaf rounded-full animate-spin" />
                <div className="absolute inset-2 border-2 border-transparent border-t-terracotta-earth rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gold-leaf rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <h3 className="font-serif text-lg text-ebony-deep mb-1">{message}</h3>
            {submessage && <p className="font-sans text-xs text-on-surface-variant leading-relaxed">{submessage}</p>}
            <div className="mt-5 flex justify-center gap-1">
              <span className="w-1.5 h-1.5 bg-gold-leaf/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-gold-leaf/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-gold-leaf/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
