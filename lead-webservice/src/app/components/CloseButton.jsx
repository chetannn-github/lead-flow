import { X } from "lucide-react";

export function CloseButton({
  onClose,
}) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-input text-foreground/70 hover:text-foreground transition-colors shadow-recess"
    >
      <X
        className="h-4 w-4"
        strokeWidth={1.75}
      />
    </button>
  );
}