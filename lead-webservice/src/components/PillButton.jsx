import { forwardRef } from "react";
import { cn } from "../lib/utils";

const variants = {
  solid:
    "bg-foreground text-background hover:shadow-[0_8px_30px_-8px_rgba(255,255,255,0.35)] active:scale-[0.98]",

  outline:
    "bg-background text-foreground shadow-[inset_0_0_0_1px_var(--hairline)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]",

  chunky:
    "bg-foreground text-background font-semibold tracking-tight hover:shadow-[0_12px_40px_-10px_rgba(255,255,255,0.4)] active:scale-[0.97] active:shadow-[inset_0_3px_8px_rgba(0,0,0,0.25)]",

  ghost:
    "bg-transparent text-muted-foreground hover:text-foreground",

  dock:
    "bg-transparent text-foreground/70 hover:text-foreground",
};

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-[14px]",
  lg: "h-16 px-10 text-[15px]",
};

export const PillButton = forwardRef(
  (
    {
      variant = "solid",
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "cursor-pointer inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

PillButton.displayName = "PillButton";