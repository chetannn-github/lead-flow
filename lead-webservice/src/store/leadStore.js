import { create } from 'zustand';
import { LEADS_BASE_URL } from '@/config/env';
import api from '@/lib/api';
import { STATUS_LABEL } from '@/lib/utils';
import { isSameLocalDay } from '@/lib/relative-time';



export const useLeadsStore = create((set,get) => ({
  leads: [],
  todayLeads: [],
  todayCount: 0,
  totalCount: 0,
  loading: false,
  isDeleting : false,
  updatingStatus: false,
  savingNotes: false, 
  addingNewLead: false,
  error: null,
  overlayId : null,

  fetchLeads: async (status, search) => {
    set({ loading: true });
    set({leads : [], todayLeads : []})
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(LEADS_BASE_URL,"/", token, {status, search} );
      const { data, count } = response;

      const todayLeads = data.filter((lead) =>
        lead.notes?.some((note) =>
          isSameLocalDay(note.followUpDate)
        )
      );

    set({
      leads: data,
      todayLeads,
      todayCount: todayLeads.length,
      totalCount: count,
      loading: false,
      error: null,
    });

      set({ 
        leads: data, 
        todayLeads, 
        todayCount, 
        totalCount: count,
        loading: false, 
        error: null 
      });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to fetch leads", 
        loading: false 
      });
    }
  },

  addNewLead: async (leadData, filter) => {
    set({ addingNewLead : true });
    const token = localStorage.getItem("token");

    try {
      const response = await api.post(LEADS_BASE_URL, "/", leadData, token);
      const newLead = response.data; 

      
    set((state) => {
      const shouldAddToList =
        !filter ||
        filter === "all" ||
        filter === "new";

      return {
        leads: shouldAddToList
          ? [newLead, ...state.leads]
          : state.leads,

        totalCount: state.totalCount + 1,
        addingNewLead: false,
        error: null,
      };
    });

      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to add lead",
        addingNewLead : false,
      });
      return { success: false, error: err };
    }
  },

  updateLeadStatus: async (leadId, status, filter) => {
    set({ updatingStatus: true });

    const token = localStorage.getItem("token");

    try {
      const payload = { leadId, status };

      const response = await api.patch(
        LEADS_BASE_URL,
        "/",
        payload,
        token
      );

      const updatedLead = response.data;
      console.log(filter)
      set((state) => {
        let updatedLeads;

        if (filter != "all" && updatedLead.status !== filter) {
          updatedLeads = state.leads.filter(
            (lead) => lead._id !== leadId
          );
        } else {
          updatedLeads = state.leads.map((lead) =>
            lead._id === leadId ? updatedLead : lead
          );
        }


        const existsInToday = state.todayLeads.some(
          (lead) => lead._id === leadId
        );

        let updatedTodayLeads = state.todayLeads;

        if (filter != "all" && existsInToday) {
          updatedTodayLeads = state.todayLeads.filter(
            (lead) => lead._id !== leadId
          );
        }else {
          updatedTodayLeads = state.todayLeads.map(
            (lead) => lead._id === leadId ? updatedLead : lead
          )
        }

        return {
          leads: updatedLeads,
          todayLeads: updatedTodayLeads,
          updatingStatus: false,
          error: null,
        };
      });

      return { success: true };
    } catch (err) {
      console.log(err);

      set({
        error:
          err.response?.data?.message ||
          "Failed to update status",
        updatingStatus: false,
      });

      return { success: false, error: err };
    }
  },

  saveNotes: async (leadId, noteData, filter) => {
    set({ savingNotes: true });
    const token = localStorage.getItem("token");

    try {
      const payload = { 
        leadId, 
        ...noteData
      };
      
      await api.patch(LEADS_BASE_URL, "/", payload, token);
      
      await get().fetchLeads(STATUS_LABEL[filter]);

      set({ 
        savingNotes: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to save notes",
        savingNotes: false,
      });
      return { success: false, error: err };
    }
  },

  deleteLead: async (leadId) => {
    set({ isDeleting: true });
    const token = localStorage.getItem("token");

    try {
      await api.del(LEADS_BASE_URL,`/`,{ leadId }, token);

      set((state) => ({
        leads: state.leads.filter(
          (lead) => lead._id !== leadId
        ),

        todayLeads: state.todayLeads.filter(
          (lead) => lead._id !== leadId
        ),

        totalCount: state.totalCount - 1,
        isDeleting: false,
        error: null,
      }));

      return { success: true };
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Failed to delete lead",

        isDeleting: false,
      });

      return {
        success: false,
        error: err,
      };
    }
  }
}));