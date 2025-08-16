import React from "react";
import { Input, Select, Button } from "../ui";
import type { LeadFilters as LeadFiltersType } from "../../types";

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFiltersChange: (filters: LeadFiltersType) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "unqualified", label: "Unqualified" },
];

export function LeadFilters({
  filters,
  onFiltersChange,
  onReset,
}: LeadFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      status: e.target.value as LeadFiltersType["status"],
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by name or company..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="md:col-span-2">
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
          />
        </div>

        <div className="md:col-span-1">
          <Button onClick={onReset} variant="outline" className="w-full">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
