export interface Opportunity {
  id: string;
  name: string;
  stage: "prospect" | "proposal" | "negotiation" | "closed-won" | "closed-lost";
  amount?: number;
  accountName: string;
  createdAt: Date;
  leadId: string;
}

export type OpportunityStage = Opportunity["stage"];
