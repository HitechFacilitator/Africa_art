import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "terracotta" | "success" | "outline";
  size?: "sm" | "md";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-sans font-semibold uppercase tracking-wider";

    const variants = {
      default: "bg-ebony-deep text-parchment-ivory",
      gold: "bg-gold-leaf text-ebony-deep",
      terracotta: "bg-terracotta-earth text-parchment-ivory",
      success: "bg-emerald-600 text-white",
      outline: "border border-on-surface/30 text-on-surface-variant bg-transparent",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[9px]",
      md: "px-2.5 py-1 text-[10px]",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";