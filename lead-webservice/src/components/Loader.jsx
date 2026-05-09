import { cn } from "../lib/utils";

export function Loader({
  label = "Loading…",
  className,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-background",
        className
      )}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.04] blur-3xl" />
      </div>

      {/* Loader */}
      <div className="relative flex items-center justify-center">
        <div className="pebble h-24 w-24 bg-surface-pebble shadow-pebble" />
        <div className="pebble-alt absolute h-24 w-24 animate-spin bg-transparent shadow-[inset_0_0_0_1.5px_var(--hairline)] [animation-duration:2.4s]" />
        <div className="absolute h-3 w-3 rounded-full bg-foreground animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          LeadFlow
        </span>
        <span className="text-sm text-foreground/80">{label}</span>
      </div>
    </div>
  );
}