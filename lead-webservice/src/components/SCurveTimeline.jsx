"use client";

import { Bell } from "lucide-react";

import {
  formatNoteDate,
  formatFollowUp,
  relativeTime,
} from "../lib/relative-time";

export default function SCurveTimeline({
  notes,
}) {
  if (!notes?.length) {
    return (
      <p className="px-2 py-6 text-sm text-muted-foreground">
        No discussions yet. Log the first one below.
      </p>
    );
  }

  return (
  <div className="relative pl-8">
    {/* vertical line */}
    <div className="absolute left-[11px] top-0 h-full w-px bg-white/10" />

    <ul className="space-y-6">
      {notes.map((note, index) => {
        const isLatest = index === 0;

        return (
          <li
            key={note._id}
            className="relative"
          >
            {/* dot */}
            <span className="absolute -left-8 top-2 flex h-6 w-6 items-center justify-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isLatest
                    ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                    : "bg-white/40"
                }`}
              />
            </span>

           <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/80">
                {formatNoteDate(note.date)}
              </span>
              <span className="text-[11px] text-white/40">
                ({relativeTime(note.date)})
              </span>
            </div>

            <div className="rounded-2xl bg-surface-input px-4 py-3 text-sm text-white/90 shadow-recess">
              {note.description}
              
              {note.followUpDate && (
                <div className="mt-2 flex items-center gap-1.5 border-t border-white/5 pt-2 text-[11px] font-medium text-white/50">
                  <Bell className="h-3 w-3 text-white/40" />
                  <span>Next Follow-up:</span>
                  <span className="text-white/80">{formatFollowUp(note.followUpDate)}</span>
                </div>
              )}
  </div>
</div>
          </li>
        );
      })}
    </ul>
  </div>
);
}