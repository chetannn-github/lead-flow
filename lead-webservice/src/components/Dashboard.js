"use client";

import { useMemo, useState } from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Search } from "lucide-react";


import { PebbleCard } from "./PebbleCard";
import { PillButton } from "./PillButton";
import LeadOverlay from "./LeadOverlay";

import { isToday } from "../lib/relative-time";
import { cn, STATUS_LABEL } from "../lib/utils";

/* ---------------- DUMMY DATA ---------------- */

const dummyLeads = [
  {
    id: "1",

    name: "Sarah Connor",

    company: "Acme Corp",

    phone: "555-0199",

    status: "proposal_sent",

    notes: [
      {
        id: "n1",

        body: "Sent pricing PDF.",

        followUpAt:
          new Date().toISOString(),

        createdAt:
          new Date().toISOString(),
      },
    ],
  },

  {
    id: "2",

    name: "Bruce Wayne",

    company: "Wayne Enterprises",

    phone: "555-0007",

    status: "won",

    notes: [
      {
        id: "n2",

        body: "Contract signed.",

        followUpAt: null,

        createdAt:
          new Date().toISOString(),
      },
    ],
  },

  {
    id: "3",

    name: "Tony Stark",

    company: "Stark Industries",

    phone: "555-1000",

    status: "contacted",

    notes: [
      {
        id: "n3",

        body: "Interested in demo.",

        followUpAt: null,

        createdAt:
          new Date().toISOString(),
      },
    ],
  },
];



/* ---------------- FILTERS ---------------- */

const FILTERS = [
  "all",
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

export default function DashboardPage() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  // direct dummy
  const dashboardLeads =
    dummyLeads;

  const filter =
    searchParams.get("filter") ||
    "all";

  const q =
    searchParams.get("q") || "";

  const leadId =
    searchParams.get("lead");

  const [dock, setDock] =
    useState("leads");

  /* ---------------- FOLLOWUPS ---------------- */

  const followUps = useMemo(() => {
    return dashboardLeads
      .map((lead) => {
        const upcoming =
          lead.notes.find(
            (note) =>
              note.followUpAt &&
              isToday(
                note.followUpAt
              )
          );

        return upcoming
          ? {
              lead,
              followUpAt:
                upcoming.followUpAt,
            }
          : null;
      })
      .filter(Boolean);
  }, [dashboardLeads]);

  /* ---------------- FILTERED ---------------- */

  const filtered = useMemo(() => {
    const ql =
      q.trim().toLowerCase();

    return dashboardLeads.filter(
      (lead) => {
        if (
          filter !== "all" &&
          lead.status !== filter
        ) {
          return false;
        }

        if (!ql) return true;

        return (
          lead.name
            .toLowerCase()
            .includes(ql) ||
          lead.company
            .toLowerCase()
            .includes(ql) ||
          lead.notes.some((note) =>
            note.body
              .toLowerCase()
              .includes(ql)
          )
        );
      }
    );
  }, [dashboardLeads, filter, q]);

  /* ---------------- URL PARAMS ---------------- */

  function updateSearchParams(
    patch
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    Object.entries(patch).forEach(
      ([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
    );

    router.push(
      `/?${params.toString()}`
    );
  }

  function openLead(id) {
    updateSearchParams({
      lead: id,
    });
  }

  /* ---------------- DOCK ---------------- */

  return (
    <main className="mx-auto max-w-6xl px-6 pb-32 pt-4">
      {/* SEARCH */}

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.5}
        />

        <input
          id="dashboard-search"
          value={q}
          onChange={(e) =>
            updateSearchParams({
              q: e.target.value,
            })
          }
          placeholder="Search leads, companies, notes…"
          className="h-16 w-full rounded-3xl bg-surface-input pl-14 pr-8 text-base text-foreground placeholder:text-muted-foreground/60 outline-none shadow-recess transition-shadow focus:shadow-recess-focus"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <PillButton
            variant="chunky"
            size="md"
            className="px-6"
            onClick={() =>
              openLead("new")
            }
          >
            + Add lead
          </PillButton>
        </div>
      </div>

      {/* FILTERS */}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Filters:
        </span>

        {FILTERS.map((f) => {
          const active =
            filter === f;

          return (
            <button
              key={f}
              onClick={() =>
                updateSearchParams({
                  filter: f,
                })
              }
              className={cn(
                "h-10 rounded-full px-5 text-sm transition-all duration-200",

                active
                  ? "bg-foreground text-background shadow-[0_8px_24px_-10px_rgba(255,255,255,0.5)]"
                  : "bg-surface-pebble text-muted-foreground shadow-[inset_0_0_0_1px_var(--hairline)] hover:text-foreground"
              )}
            >
              {f === "all"
                ? "All"
                : STATUS_LABEL[f]}
            </button>
          );
        })}
      </div>

      {/* FOLLOWUPS */}

      {followUps.length > 0 && (
        <section
          id="followups-section"
          className="mt-12"
        >
          <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            ★ Today&apos;s follow-ups
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {followUps.map(
              ({
                lead,
                followUpAt,
              }) => (
                <PebbleCard
                  key={lead.id}
                  lead={lead}
                  pinned={{
                    followUpAt,
                  }}
                  onClick={() =>
                    openLead(
                      lead.id
                    )
                  }
                />
              )
            )}
          </div>
        </section>
      )}

      {/* LEADS */}

      <section
        id="all-leads-section"
        className="mt-12"
      >
        <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          All leads

          <span className="ml-2 text-foreground/40">
            ({filtered.length})
          </span>
        </h2>

        {filtered.length === 0 ? (
          <div className="pebble bg-surface-pebble p-12 text-center shadow-pebble">
            <p className="text-foreground/80">
              No leads match your
              search.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(
              (lead, index) => (
                <PebbleCard
                  key={lead.id}
                  lead={lead}
                  alt={
                    index % 2 ===
                    1
                  }
                  onClick={() =>
                    openLead(
                      lead.id
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </section>

     

      <LeadOverlay
        open={!!leadId}
        leadId={leadId}
        onClose={() =>
          updateSearchParams({
            lead: null,
          })
        }
      />
    </main>
  );
}