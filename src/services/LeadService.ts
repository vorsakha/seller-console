import type { Lead, Opportunity } from "../types";
import { delay, simulateFailure } from "../utils/api";
import leadsData from "../data/leads.json";

const SIMULATED_DELAY = 800;

const LeadService = {
  async fetchLeads(): Promise<Lead[]> {
    await delay(SIMULATED_DELAY);

    if (simulateFailure(0.05)) {
      throw new Error("Failed to fetch leads");
    }

    return leadsData as Lead[];
  },

  async updateLead(lead: Lead): Promise<Lead> {
    await delay(SIMULATED_DELAY);

    if (simulateFailure(0.1)) {
      throw new Error("Failed to update lead");
    }

    return lead;
  },

  async convertLeadToOpportunity(
    leadId: string,
    opportunityData: Omit<Opportunity, "id" | "createdAt" | "leadId">,
  ): Promise<Opportunity> {
    await delay(SIMULATED_DELAY);

    if (simulateFailure(0.05)) {
      throw new Error("Failed to convert lead to opportunity");
    }

    const opportunity: Opportunity = {
      ...opportunityData,
      id: `opp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      leadId,
      createdAt: new Date(),
    };

    return opportunity;
  },
};

export default LeadService;
