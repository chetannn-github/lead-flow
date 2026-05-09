"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const PillTextarea = forwardRef(
  (
    {
      label,
      className,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 ml-6 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            {label}
          </label>
        )}

        <textarea
          id={inputId}
          name={name}
          ref={ref}
          className={cn(
            "min-h-[88px] w-full resize-none rounded-[28px]",
            "bg-surface-input px-6 py-4",
            "text-[15px] text-foreground",
            "placeholder:text-muted-foreground/70",
            "outline-none transition-shadow duration-200",
            "shadow-recess focus:shadow-recess-focus",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

