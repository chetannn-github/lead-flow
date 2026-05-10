"use client";

import { useState } from "react";

import { PillInput } from "@/components/PillInput";
import { PillButton } from "../../components/PillButton";
import { useLeadsStore } from "@/store/leadStore";
import { CloseButton } from "./CloseButton";
import { Loader2 } from "lucide-react";


export function AddLeadPanel({ onClose, filter}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  const { addNewLead, addingNewLead } = useLeadsStore();

  async function submit (e) {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      setError( "Name is required.");
      return;
    }

    await addNewLead({
      fullName: trimmed,
      company,
      phone,
    }, filter);

    
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
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 10) {
              setPhone(val);
            }
          }}
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
          className="px-12 min-w-[140px]" // min-w taaki size jump na kare
          disabled={addingNewLead} // Saving ke waqt double click block
        >
          {addingNewLead ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            "Save lead"
          )}
        </PillButton>
      </footer>
    </form>
  );
}