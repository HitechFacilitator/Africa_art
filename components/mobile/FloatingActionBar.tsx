"use client";

import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Heart, Share2, MessageSquare } from "lucide-react";

interface FloatingActionBarProps {
  isVisible: boolean;
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }[];
}

export default function FloatingActionBar({
  isVisible,
  actions = [],
}: FloatingActionBarProps) {
  const defaultActions = actions.length > 0 ? actions : [];

  return (
    <AnimatePresence>
      {isVisible && defaultActions.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          <div className="bg-ebony-deep/95 backdrop-blur-md border-t border-gold-leaf/20 px-4 py-3 safe-area-bottom">
            <div className="flex gap-2">
              {defaultActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer border-0 ${
                    action.variant === "primary"
                      ? "bg-gold-leaf text-ebony-deep hover:bg-parchment-ivory"
                      : "bg-transparent text-parchment-ivory border border-gold-leaf/30 hover:bg-gold-leaf/10"
                  }`}
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
