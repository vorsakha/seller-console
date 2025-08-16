import React, { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { Lead, Opportunity, LeadFilters, LeadSort } from "../types";

interface AppState {
  leads: Lead[];
  opportunities: Opportunity[];
  filters: LeadFilters;
  sort: LeadSort;
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: "SET_LEADS"; payload: Lead[] }
  | { type: "UPDATE_LEAD"; payload: Lead }
  | { type: "SET_OPPORTUNITIES"; payload: Opportunity[] }
  | { type: "ADD_OPPORTUNITY"; payload: Opportunity }
  | { type: "SET_FILTERS"; payload: LeadFilters }
  | { type: "SET_SORT"; payload: LeadSort }
  | { type: "SET_SELECTED_LEAD"; payload: Lead | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: AppState = {
  leads: [],
  opportunities: [],
  filters: { search: "", status: "all" },
  sort: { field: "score", direction: "desc" },
  selectedLead: null,
  isLoading: false,
  error: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LEADS":
      return { ...state, leads: action.payload };
    case "UPDATE_LEAD":
      return {
        ...state,
        leads: state.leads.map((lead) =>
          lead.id === action.payload.id ? action.payload : lead,
        ),
        selectedLead:
          state.selectedLead?.id === action.payload.id
            ? action.payload
            : state.selectedLead,
      };
    case "SET_OPPORTUNITIES":
      return { ...state, opportunities: action.payload };
    case "ADD_OPPORTUNITY":
      return {
        ...state,
        opportunities: [...state.opportunities, action.payload],
      };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_SELECTED_LEAD":
      return { ...state, selectedLead: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
