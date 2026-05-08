import { forwardRef } from "react";
import { cn } from "../lib/utils";

export const PillInput = forwardRef(
  ({ label, required, className, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 ml-6 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            {label}

            {required && (
              <span className="ml-1 text-foreground/70">*</span>
            )}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-14 w-full rounded-full bg-surface-input px-6 text-[15px] text-foreground",
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

PillInput.displayName = "PillInput";