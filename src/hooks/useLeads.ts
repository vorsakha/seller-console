import { useCallback, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import type { Lead } from "../types";
import { LeadService } from "../services";

export default function useLeads() {
  const { state, dispatch } = useAppContext();

  const loadLeads = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const leads = await LeadService.fetchLeads();

      dispatch({ type: "SET_LEADS", payload: leads });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to load leads",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [dispatch]);

  const updateLeadData = useCallback(
    async (lead: Lead) => {
      dispatch({ type: "SET_ERROR", payload: null });

      const rollbackLead = state.leads.find((l) => l.id === lead.id);

      dispatch({ type: "UPDATE_LEAD", payload: lead });

      try {
        const updatedLead = await LeadService.updateLead(lead);

        dispatch({ type: "UPDATE_LEAD", payload: updatedLead });
      } catch (error) {
        if (rollbackLead) {
          dispatch({ type: "UPDATE_LEAD", payload: rollbackLead });
        }

        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to update lead",
        });

        throw error;
      }
    },
    [state.leads, dispatch],
  );

  useEffect(() => {
    if (state.leads.length === 0 && !state.isLoading) {
      loadLeads();
    }
  }, [loadLeads, state.leads.length, state.isLoading]);

  return {
    leads: state.leads,
    updateLead: updateLeadData,
  };
}
