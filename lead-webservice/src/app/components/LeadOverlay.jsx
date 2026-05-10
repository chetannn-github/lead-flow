import { cn } from "../../lib/utils";
import { AddLeadPanel } from "./AddLeadPanel";
import EditLeadPanel from "./EditLeadPanel";

export default function LeadOverlay({
  open,
  leadId,
  onClose,
  filter
}) {
  
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >

      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/92 animate-[oil-fade_200ms_ease-out]"
      />

      <div
        className={cn(
          "relative z-10 w-[min(92vw,640px)] max-h-[88vh] overflow-hidden",
          "bg-surface-elevated text-foreground shadow-pebble",
          "rounded-[50px]"
        )}
        style={{
          animation:
            "oil-expand 320ms cubic-bezier(0.22,1,0.36,1)",

          transformOrigin:
            "center",
        }}
      >
        {leadId === "new" ? (
          <AddLeadPanel
            onClose={onClose}
            filter={filter}
          />
        ) : (
          <EditLeadPanel
            leadId={leadId}
            onClose={onClose}
            filter={filter}
          />
        )}
      </div>
    </div>
  );
}
