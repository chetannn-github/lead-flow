import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs ) {
  return twMerge(clsx(inputs));
}

export const STATUS_LABEL = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};
