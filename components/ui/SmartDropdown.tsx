"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

interface SmartDropdownProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export default function SmartDropdown({ open, onClose, trigger, children, align = "right", className = "" }: SmartDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openUpward, setOpenUpward] = useState(false);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = dropdownRef.current?.offsetHeight || 200;
    setOpenUpward(spaceBelow < dropdownHeight + 8);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const positionClasses = openUpward
    ? "bottom-full mb-1"
    : "top-full mt-1";

  const alignClasses = align === "right" ? "right-0" : "left-0";

  return (
    <div ref={triggerRef} className="relative inline-flex">
      {trigger}
      {open && (
        <div
          ref={dropdownRef}
          className={`absolute ${positionClasses} ${alignClasses} bg-parchment-ivory border border-outline-variant/30 shadow-lg z-20 min-w-[160px] ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
