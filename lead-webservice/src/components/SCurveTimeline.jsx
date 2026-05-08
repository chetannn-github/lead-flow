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

  const rowHeight = 110;

  const height =
    notes.length * rowHeight;

  const width = 40;

  // alternating curve points
  const dots = notes.map(
    (_, index) => {
      const y =
        index * rowHeight + 28;

      const x =
        index % 2 === 0
          ? 12
          : 28;

      return { x, y };
    }
  );

  const path = dots.reduce(
    (acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const prev =
        dots[index - 1];

      const midY =
        (prev.y + point.y) / 2;

      return `${acc} C ${prev.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
    },
    ""
  );

  return (
    <div
      className="relative"
      style={{
        minHeight: height,
      }}
    >
      {/* curve */}
      <svg
        className="absolute left-0 top-0 h-full"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <ul className="relative space-y-3">
        {notes.map(
          (note, index) => {
            const dot =
              dots[index];

            const isLatest =
              index === 0;

            return (
              <li
                key={note.id}
                className="relative pl-14"
                style={{
                  minHeight:
                    rowHeight,
                }}
              >
                {/* dot */}
                <span
                  className="absolute z-10"
                  style={{
                    left:
                      dot.x - 5,
                    top:
                      dot.y - 5,
                  }}
                >
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${
                      isLatest
                        ? "bg-foreground shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                        : note.system
                        ? "bg-foreground/25"
                        : "bg-foreground/55"
                    }`}
                  />
                </span>

                <div className="pt-1">
                  <div className="mb-1.5 flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-foreground/85">
                      {formatNoteDate(
                        note.createdAt
                      )}
                    </span>

                    <span className="text-[11px] text-muted-foreground">
                      (
                      {relativeTime(
                        note.createdAt
                      )}
                      )
                    </span>
                  </div>

                  {note.system ? (
                    <p className="text-[13px] italic text-muted-foreground">
                      {note.body}
                    </p>
                  ) : (
                    <div className="rounded-[24px] bg-surface-input px-5 py-3.5 text-[14px] text-foreground/90 shadow-recess">
                      {note.body}

                      {note.followUpAt && (
                        <div className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-background/60 px-3 text-[11px] text-foreground/85 shadow-[inset_0_0_0_1px_var(--hairline)]">
                          <Bell
                            className="h-3 w-3"
                            strokeWidth={
                              1.75
                            }
                          />

                          Follow-up set for{" "}
                          {formatFollowUp(
                            note.followUpAt
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}