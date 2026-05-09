import { cn } from "@/lib/utils";



const colorMap = {
  New:
    "text-status-new bg-[color-mix(in_oklch,var(--status-new)_14%,black)]",

  Contacted:
    "text-status-contacted bg-[color-mix(in_oklch,var(--status-contacted)_14%,black)]",

  Qualified:
    "text-status-qualified bg-[color-mix(in_oklch,var(--status-qualified)_14%,black)]",

  "Proposal Sent":
    "text-status-proposal bg-[color-mix(in_oklch,var(--status-proposal)_14%,black)]",

  Won:
    "text-status-won bg-[color-mix(in_oklch,var(--status-won)_16%,black)]",

  Lost:
    "text-status-lost bg-[color-mix(in_oklch,var(--status-lost)_14%,black)]",
};

export function StatusPill({
  status,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-[0.16em]",
        colorMap[status],
        className
      )}
    >
      {status}
    </span>
  );
}