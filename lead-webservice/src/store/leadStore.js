import { create } from 'zustand';
import { LEADS_BASE_URL } from '@/config/env';
import api from '@/lib/api';



export const useLeadsStore = create((set) => ({
  leads: [],
  todayLeads: [],
  todayCount: 0,
  totalCount: 0,
  loading: false,
  isDeleting : false,
  error: null,

  fetchLeads: async (status, search) => {
    set({ loading: true });
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(LEADS_BASE_URL,"/", token, {status, search} );
      const { data, todayLeads, todayCount, count } = response;

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
  addNewLead: async (leadData) => {
    set({ loading: true });
    const token = localStorage.getItem("token");

    try {
      const response = await api.post(LEADS_BASE_URL, "/", leadData, token);
      const newLead = response.data; 

      set((state) => ({
        leads: [newLead, ...state.leads],
        totalCount: state.totalCount + 1,
        loading: false,
        error: null,
      }));

      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to add lead",
        loading: false,
      });
      return { success: false, error: err };
    }
  },

  updateLeadStatus: async (leadId, status) => {
    set({ loading: true });
    const token = localStorage.getItem("token");

    try {
      const payload = { leadId, status };
      
      const response = await api.patch(LEADS_BASE_URL, "/",payload, token);
      const updatedLead = response.data; 

      set((state) => ({
        leads: state.leads.map((lead) =>
          lead._id === leadId ? updatedLead : lead
        ),
  
        todayLeads: state.todayLeads.map((lead) =>
          lead._id === leadId ? updatedLead : lead
        ),
        loading: false,
        error: null,
      }));

      return { success: true };
    } catch (err) {
      console.log(err);
      set({
        error: err.response?.data?.message || "Failed to update status",
        loading: false,
      });
      return { success: false, error: err };
    }
  },

  saveNotes: async (leadId, noteData) => {
    set({ loading: true });
    const token = localStorage.getItem("token");

    try {
      const payload = { 
        leadId, 
        ...noteData
      };
      
      const response = await api.patch(LEADS_BASE_URL, "/", payload, token);
      const updatedLead = response.data;

      set((state) => ({
        leads: state.leads.map((lead) =>
          lead._id === leadId ? updatedLead : lead
        ),
        
        todayLeads: state.todayLeads.map((lead) =>
          lead._id === leadId ? updatedLead : lead
        ),
        loading: false,
        error: null,
      }));

      return { success: true };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to save notes",
        loading: false,
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