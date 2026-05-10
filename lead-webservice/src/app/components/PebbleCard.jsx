import { Phone } from "lucide-react";
import { StatusPill } from "./StatusPill";

import {
  relativeTime,
  formatFollowUp,
} from "../../lib/relative-time";

import { cn } from "../../lib/utils";
import { HighlightText } from "./HighlightText";

export function PebbleCard({
  lead,
  pinned,
  onClick,
  alt,
  searchTerm
}) {
  const lastNote = lead?.notes ? lead.notes[0] : null;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full bg-surface-pebble p-7 text-left shadow-pebble transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-pebble-hover sm:p-8",
        alt ? "pebble-alt" : "pebble"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            <HighlightText
              text={lead.fullName} 
              highlight={searchTerm} 
            />
         
            {lead.company && (
              <span className="font-normal text-muted-foreground">
                <HighlightText
                  text={` ( ${lead.company} )`} 
                  highlight={searchTerm} 
                />
              </span>
            )}
          </h3>

          {lead.phone && (
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone
                className="h-3 w-3"
                strokeWidth={1.5}
              />

              {lead.phone}
            </p>
          )}
        </div>  
        

        <StatusPill status={lead.status} />
      </div>

      {lastNote && (
        <p className="mt-5 line-clamp-2 text-sm text-foreground/80">
          <span className="text-muted-foreground">
            Last note:
          </span>{" "}

          {lastNote.description}

          <span className="ml-2 text-xs text-muted-foreground/70">
            {relativeTime(lastNote.date)}
          </span>
        </p>
      )}

    </button>
  );
}