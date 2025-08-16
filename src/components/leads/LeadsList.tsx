import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { LeadFilters } from "./LeadFilters";
import { LeadTable } from "./LeadTable";
import type { Lead } from "../../types";
import { StorageService } from "../../services";
import { useDebounce, useLeads, useLocalStorage } from "../../hooks";

interface LeadsListProps {
  onLeadSelect: (lead: Lead) => void;
}

export default function LeadsList({ onLeadSelect }: LeadsListProps) {
  const { state, dispatch } = useAppContext();
  const { leads } = useLeads();
  const { clearStoredPreferences } = useLocalStorage();
  const debouncedSearch = useDebounce(state.filters.search, 300);

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads;

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();

      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower),
      );
    }

    if (state.filters.status !== "all") {
      filtered = filtered.filter(
        (lead) => lead.status === state.filters.status,
      );
    }

    filtered.sort((a, b) => {
      const { field, direction } = state.sort;
      let aValue: string | number;
      let bValue: string | number;

      switch (field) {
        case "score":
          aValue = a.score;
          bValue = b.score;
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "company":
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }

      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    return filtered;
  }, [leads, debouncedSearch, state.filters.status, state.sort]);

  const handleFiltersChange = (filters: typeof state.filters) => {
    StorageService.saveFilters(filters);

    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const handleSortChange = (sort: typeof state.sort) => {
    StorageService.saveSort(sort);

    dispatch({ type: "SET_SORT", payload: sort });
  };

  const handleReset = () => {
    clearStoredPreferences();

    const defaultFilters = { search: "", status: "all" as const };
    const defaultSort = { field: "score" as const, direction: "desc" as const };

    dispatch({ type: "SET_FILTERS", payload: defaultFilters });
    dispatch({ type: "SET_SORT", payload: defaultSort });

    StorageService.saveFilters(defaultFilters);
    StorageService.saveSort(defaultSort);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Leads</h2>
        <p className="text-gray-600">
          {filteredAndSortedLeads.length} of {leads.length} leads
        </p>
      </div>

      <LeadFilters
        filters={state.filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      <LeadTable
        leads={filteredAndSortedLeads}
        onLeadClick={onLeadSelect}
        sort={state.sort}
        onSortChange={handleSortChange}
        isLoading={state.isLoading}
      />
    </div>
  );
}
