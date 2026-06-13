"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, SlidersHorizontal, Check } from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterGroup[];
  selectedValues: Record<string, string>;
  onApply: (values: Record<string, string>) => void;
}

export default function FilterBottomSheet({
  isOpen,
  onClose,
  filters,
  selectedValues,
  onApply,
}: FilterBottomSheetProps) {
  const { lang } = useTranslate();
  const [localValues, setLocalValues] = useState<Record<string, string>>(selectedValues);

  const handleSelect = (filterId: string, value: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [filterId]: prev[filterId] === value ? "" : value,
    }));
  };

  const handleReset = () => {
    const reset: Record<string, string> = {};
    filters.forEach((f) => (reset[f.id] = ""));
    setLocalValues(reset);
  };

  const handleApply = () => {
    onApply(localValues);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ebony-deep/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-parchment-ivory max-h-[80vh] rounded-t-2xl overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-on-surface-variant/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-on-surface/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-gold-leaf" />
                <h3 className="font-serif text-lg text-ebony-deep">{lang === "fr" ? "Filtres" : "Filters"}</h3>
              </div>
              <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                <X size={18} />
              </button>
            </div>

            {/* Filter Groups */}
            <div className="overflow-y-auto max-h-[50vh] px-6 py-4 space-y-6">
              {filters.map((group) => (
                <div key={group.id}>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const isSelected = localValues[group.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(group.id, opt.value)}
                          className={`px-3 py-2 text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-ebony-deep text-parchment-ivory border-ebony-deep"
                              : "bg-transparent text-on-surface-variant border-on-surface/15 hover:border-gold-leaf/50"
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-on-surface/10">
              <button
                onClick={handleReset}
                className="flex-1 border border-on-surface/15 text-on-surface-variant py-3 text-xs font-bold uppercase tracking-widest hover:text-ebony-deep transition-colors cursor-pointer bg-transparent"
              >
                {lang === "fr" ? "Réinitialiser" : "Reset"}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-ebony-deep text-parchment-ivory py-3 text-xs font-bold uppercase tracking-widest hover:bg-gold-leaf hover:text-ebony-deep transition-colors cursor-pointer border-0"
              >
                {lang === "fr" ? "Appliquer les Filtres" : "Apply Filters"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
