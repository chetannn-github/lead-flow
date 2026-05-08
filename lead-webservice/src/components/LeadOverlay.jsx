"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Phone,
  Trash2,
  Check,
  ChevronDown,
} from "lucide-react";


import { PillInput } from "./PillInput";
import { PillTextarea } from "./PillTextArea";
import { PillButton } from "./PillButton";
import SCurveTimeline from "./SCurveTimeline";

import { cn } from "../lib/utils";

/* ---------------- DUMMY STORE ---------------- */

const STATUS_LABEL = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent:
    "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

const STATUS_ORDER = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

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

      {
        id: "n2",

        body: "Lead created.",

        system: true,

        followUpAt: null,

        createdAt:
          new Date().toISOString(),
      },
    ],
  },

  {
    id: "2",

    name: "Tony Stark",

    company:
      "Stark Industries",

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

function getLead(id) {
  return dummyLeads.find(
    (lead) => lead.id === id
  );
}

function createLead(data) {
  console.log(
    "create lead",
    data
  );
}

function updateLead(id, data) {
  console.log(
    "update lead",
    id,
    data
  );
}

function deleteLead(id) {
  console.log(
    "delete lead",
    id
  );
}

function setStatus(id, status) {
  console.log(
    "status changed",
    id,
    status
  );
}

function addNote(
  id,
  body,
  followUpAt
) {
  console.log(
    "note added",
    id,
    body,
    followUpAt
  );
}

/* ---------------- MAIN ---------------- */

export default function LeadOverlay({
  open,
  leadId,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}

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
          />
        ) : (
          <EditLeadPanel
            id={leadId}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- CLOSE BUTTON ---------------- */

function CloseButton({
  onClose,
}) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-input text-foreground/70 hover:text-foreground transition-colors shadow-recess"
    >
      <X
        className="h-4 w-4"
        strokeWidth={1.75}
      />
    </button>
  );
}

/* ---------------- ADD PANEL ---------------- */

function AddLeadPanel({
  onClose,
}) {
  const [name, setName] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [error, setError] =
    useState(null);

  function submit(e) {
    e.preventDefault();

    const trimmed =
      name.trim();

    if (!trimmed) {
      setError(
        "Name is required."
      );

      return;
    }

    createLead({
      name: trimmed,
      company,
      phone,
    });

    
    onClose();
  }

  return (
    <form
      onSubmit={submit}
      className="flex max-h-[88vh] flex-col"
    >
      <header className="flex items-center justify-between px-10 pt-9 pb-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Add new lead
        </h2>

        <CloseButton
          onClose={onClose}
        />
      </header>

      <div className="px-10 py-6 space-y-5 overflow-y-auto">
        <PillInput
          label="Full name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <PillInput
          label="Company"
          value={company}
          onChange={(e) =>
            setCompany(
              e.target.value
            )
          }
        />

        <PillInput
          label="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
        />

        {error && (
          <p className="ml-6 text-sm text-status-lost">
            {error}
          </p>
        )}
      </div>

      <footer className="flex items-center justify-between gap-3 px-10 pb-9 pt-3">
        <PillButton
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </PillButton>

        <PillButton
          type="submit"
          variant="chunky"
          size="lg"
          className="px-12"
        >
          Save lead
        </PillButton>
      </footer>
    </form>
  );
}

/* ---------------- EDIT PANEL ---------------- */

function EditLeadPanel({
  id,
  onClose,
}) {
  const lead = getLead(id);

  const [statusOpen, setStatusOpen] =
    useState(false);

  const [body, setBody] =
    useState("");

  const [followUpOn, setFollowUpOn] =
    useState(false);

  const [followUpAt, setFollowUpAt] =
    useState("");

  const [name, setName] =
    useState(
      lead?.name ?? ""
    );

  const [company, setCompany] =
    useState(
      lead?.company ?? ""
    );

  const [phone, setPhone] =
    useState(
      lead?.phone ?? ""
    );

  const [
    editingHeader,
    setEditingHeader,
  ] = useState(false);

  useEffect(() => {
    if (!lead) {
      onClose();
    }
  }, [lead, onClose]);

  if (!lead) return null;

  function saveNote(e) {
    e.preventDefault();

    if (!body.trim()) {
      return;
    }

    addNote(
      id,
      body,
      followUpOn
        ? followUpAt
        : null
    );

    setBody("");

  }

  function commitHeader() {
    updateLead(id, {
      name,
      company,
      phone,
    });

    setEditingHeader(false);

   
  }

  function changeStatus(
    status
  ) {
    setStatus(id, status);

    setStatusOpen(false);
  }

  function remove() {
    deleteLead(id);

    

    onClose();
  }

  return (
    <div className="flex max-h-[88vh] flex-col">
      <header className="flex items-start justify-between gap-4 px-10 pt-9 pb-3">
        <div className="min-w-0 flex-1">
          {editingHeader ? (
            <div className="space-y-2">
              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none border-b border-hairline pb-1"
              />

              <input
                value={company}
                onChange={(e) =>
                  setCompany(
                    e.target.value
                  )
                }
                className="w-full bg-transparent text-sm text-muted-foreground outline-none border-b border-hairline pb-1"
              />

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className="w-full bg-transparent text-sm text-muted-foreground outline-none border-b border-hairline pb-1"
              />

              <PillButton
                size="sm"
                variant="solid"
                onClick={
                  commitHeader
                }
                type="button"
              >
                Save details
              </PillButton>
            </div>
          ) : (
            <button
              onClick={() =>
                setEditingHeader(
                  true
                )
              }
              className="text-left"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                {lead.name}

                {lead.company && (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    (
                    {
                      lead.company
                    }
                    )
                  </span>
                )}
              </h2>

              {lead.phone && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone
                    className="h-3.5 w-3.5"
                    strokeWidth={
                      1.5
                    }
                  />

                  {lead.phone}
                </p>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() =>
                setStatusOpen(
                  (v) => !v
                )
              }
              className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-input px-4 text-[12px] font-semibold uppercase tracking-[0.16em]"
            >
              {
                STATUS_LABEL[
                  lead.status
                ]
              }

              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {statusOpen && (
              <div className="absolute right-0 top-12 z-20 w-52 rounded-[24px] bg-popover p-2 shadow-pebble">
                {STATUS_ORDER.map(
                  (
                    status
                  ) => (
                    <button
                      key={
                        status
                      }
                      onClick={() =>
                        changeStatus(
                          status
                        )
                      }
                      className="flex w-full items-center justify-between rounded-full px-4 py-2 text-sm"
                    >
                      <span>
                        {
                          STATUS_LABEL[
                            status
                          ]
                        }
                      </span>

                      {status ===
                        lead.status && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <CloseButton
            onClose={onClose}
          />
        </div>
      </header>

      <div className="px-10 py-4 overflow-y-auto flex-1">
        <SCurveTimeline
          notes={lead.notes}
        />
      </div>

      <form
        onSubmit={saveNote}
        className="border-t border-hairline/60 px-10 py-6 space-y-4 bg-background/40"
      >
        <PillTextarea
          value={body}
          onChange={(e) =>
            setBody(
              e.target.value
            )
          }
          placeholder="Log a discussion..."
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex h-11 items-center gap-2 rounded-full bg-surface-input px-4 text-sm shadow-recess cursor-pointer">
            <input
              type="checkbox"
              checked={
                followUpOn
              }
              onChange={(e) =>
                setFollowUpOn(
                  e.target
                    .checked
                )
              }
            />

            Set follow-up
          </label>

          <input
            type="datetime-local"
            value={followUpAt}
            onChange={(e) =>
              setFollowUpAt(
                e.target.value
              )
            }
            disabled={
              !followUpOn
            }
            className="h-11 rounded-full bg-surface-input px-5 text-sm"
          />

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={remove}
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm"
            >
              <Trash2 className="h-4 w-4" />

              Delete
            </button>

            <PillButton
              type="submit"
              variant="chunky"
              size="lg"
              className="px-10"
            >
              Save note
            </PillButton>
          </div>
        </div>
      </form>
    </div>
  );
}