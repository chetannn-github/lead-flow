"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Phone,
  Trash2,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";


import { PillTextarea } from "./PillTextArea";
import { PillButton } from "../../components/PillButton";
import TimeLine from "./TimeLine";

import { useLeadsStore } from "@/store/leadStore";
import { CloseButton } from "./CloseButton";
import { getTodayMidnight, toUTCISOString } from "@/lib/relative-time";

const STATUS_ORDER = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];


export default function EditLeadPanel({ leadId, onClose, filter }) {
  const { masterLeads, updateLeadStatus,updatingStatus, saveNotes, deleteLead, isDeleting,savingNotes} = useLeadsStore();
  const lead = masterLeads.find((lead) => lead._id === leadId);
  const [statusOpen, setStatusOpen] = useState(false);
  const [body, setBody] = useState("");
  const [followUpOn, setFollowUpOn] = useState(false);
  const [followUpAt, setFollowUpAt] = useState("");
  
  
  useEffect(() => {
      if (!lead) {
          onClose();
      }
  }, [ onClose]);

  if (!lead) return null;

  async function handleSaveNotes(e) {
      e.preventDefault();

      if (!body.trim()) return;

      await saveNotes(
        leadId, {
          newNote : body ?? null,
          nextFollowUp : followUpOn ? toUTCISOString(followUpAt) : null
        }, filter
      );
      setBody("");
  }


  async function changeStatus(status) {
    setStatusOpen(false);
    if (status === lead.status) return;
    await updateLeadStatus(leadId,status, filter)
    
  }

  async function handleDeleteLead() {
    await deleteLead(leadId);
    onClose();
  }

  return (
    <div className="flex max-h-[88vh] flex-col ">
      <header className="flex items-start justify-between gap-2 px-2 md:px-10 pt-2 pb-2">
        <div className="min-w-0 ">
            <button
                className="text-left"
            >
                <h2 className="text-xl font-semibold tracking-tight">
                {lead.fullName}

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
          
        </div>

        <div className="flex items-center gap-0">
          <div className="relative">
           <button
              onClick={() => setStatusOpen((v) => !v)}
              disabled={updatingStatus}
              className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-full bg-surface-input px-4 text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.16em] disabled:opacity-50"
            >
              {updatingStatus ? <Loader2 className="h-3 w-3 animate-spin" /> : lead.status}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {statusOpen && (
              <div className="absolute right-0 top-12 z-20 w-52 rounded-[24px] bg-popover p-2 shadow-pebble">
                {STATUS_ORDER.map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => changeStatus(status)}
                      className="cursor-pointer flex w-full items-center justify-between rounded-full px-4 py-2 text-sm"
                    >
                      <span>
                        {status}
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

          <CloseButton onClose={onClose}/>
        </div>
      </header>

      <div className="px-2 md:px-10 py-4 overflow-y-auto flex-1 ">
        <TimeLine
          notes={lead.notes}
        />
      </div>

      <form
        onSubmit={handleSaveNotes}
        className="border-t border-hairline/60 px-2 md:px-10 py-1 space-y-4 bg-background/40"
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
              onChange={(e) => {
                const checked = e.target.checked;
                setFollowUpOn(checked);

                if (checked) {
                  setFollowUpAt(getTodayMidnight());
                } else {
                  setFollowUpAt("");
                }
              }}
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
              onClick={handleDeleteLead}
              disabled={savingNotes || isDeleting}
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm hover:bg-white/5 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin text-status-lost" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>Delete</span>
            </button>
            <PillButton
              type="submit"
              variant="chunky"
              size="md"
              className="px-3 min-w-[140px]"
              disabled={savingNotes || isDeleting}
            >
              {savingNotes ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save note"
              )}
            </PillButton>
          </div>
        </div>
      </form>
    </div>
  );
}