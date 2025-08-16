import type { Lead, LeadSort } from "../../types";
import { type Column, type SortConfig } from "../ui/Table";
import { Table } from "../ui";

interface LeadTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  sort: LeadSort;
  onSortChange: (sort: LeadSort) => void;
  isLoading?: boolean;
}

function getStatusColor(status: Lead["status"]) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "contacted":
      return "bg-yellow-100 text-yellow-800";
    case "qualified":
      return "bg-green-100 text-green-800";
    case "unqualified":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-600 font-semibold";
  if (score >= 80) return "text-blue-600 font-medium";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
}

const columns: Column<Lead>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    className: "font-medium text-gray-900",
  },
  {
    key: "company",
    header: "Company",
    sortable: true,
    className: "text-gray-500",
  },
  {
    key: "email",
    header: "Email",
    className: "text-gray-500",
  },
  {
    key: "source",
    header: "Source",
    className: "text-gray-500 capitalize",
    render: (lead) => lead.source.replace("_", " "),
  },
  {
    key: "score",
    header: "Score",
    sortable: true,
    render: (lead) => (
      <span className={getScoreColor(lead.score)}>{lead.score}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (lead) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
          lead.status,
        )}`}
      >
        {lead.status}
      </span>
    ),
  },
];

export function LeadTable({
  leads,
  onLeadClick,
  sort,
  onSortChange,
  isLoading,
}: LeadTableProps) {
  const emptyState = {
    title: "No leads found",
    description: "Try adjusting your search or filter criteria.",
  };

  const handleSortChange = (sortConfig: SortConfig) => {
    onSortChange({
      field: sortConfig.field as LeadSort["field"],
      direction: sortConfig.direction,
    });
  };

  return (
    <Table
      data={leads}
      columns={columns}
      onRowClick={onLeadClick}
      isLoading={isLoading}
      emptyState={emptyState}
      sort={{ field: sort.field, direction: sort.direction }}
      onSortChange={handleSortChange}
      getRowKey={(lead) => lead.id}
    />
  );
}
