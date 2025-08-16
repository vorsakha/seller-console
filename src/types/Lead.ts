export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "unqualified";
}

export type LeadStatus = Lead["status"];

export interface LeadFilters {
  search: string;
  status: LeadStatus | "all";
}

export interface LeadSort {
  field: "score" | "name" | "company" | "status";
  direction: "asc" | "desc";
}
