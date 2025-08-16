import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import type { Opportunity } from "../types";
import { LeadService } from "../services";

export default function useOpportunities() {
  const { state, dispatch } = useAppContext();

  const convertLead = useCallback(
    async (
      leadId: string,
      opportunityData: Omit<Opportunity, "id" | "createdAt" | "leadId">,
    ) => {
      dispatch({ type: "SET_ERROR", payload: null });

      const existingOpportunity = state.opportunities.find(
        (opp) => opp.leadId === leadId,
      );
      if (existingOpportunity) {
        const error = new Error(
          "Lead has already been converted to an opportunity",
        );
        dispatch({
          type: "SET_ERROR",
          payload: error.message,
        });
        throw error;
      }

      try {
        const opportunity = await LeadService.convertLeadToOpportunity(
          leadId,
          opportunityData,
        );
        dispatch({ type: "ADD_OPPORTUNITY", payload: opportunity });

        const lead = state.leads.find((l) => l.id === leadId);
        if (lead) {
          const updatedLead = { ...lead, status: "qualified" as const };
          dispatch({ type: "UPDATE_LEAD", payload: updatedLead });
        }

        return opportunity;
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload:
            error instanceof Error ? error.message : "Failed to convert lead",
        });
        throw error;
      }
    },
    [state.leads, state.opportunities, dispatch],
  );

  const isLeadConverted = useCallback(
    (leadId: string) => {
      return state.opportunities.some((opp) => opp.leadId === leadId);
    },
    [state.opportunities],
  );

  return {
    opportunities: state.opportunities,
    convertLead,
    isLeadConverted,
  };
}
