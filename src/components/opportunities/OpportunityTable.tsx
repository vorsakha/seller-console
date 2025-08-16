import type { Opportunity } from "../../types";
import { formatAmount } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import type { Column } from "../ui/Table";
import { Table } from "../ui";

interface OpportunityTableProps {
  opportunities: Opportunity[];
}

function getStageColor(stage: Opportunity["stage"]) {
  switch (stage) {
    case "prospect":
      return "bg-gray-100 text-gray-800";
    case "proposal":
      return "bg-blue-100 text-blue-800";
    case "negotiation":
      return "bg-yellow-100 text-yellow-800";
    case "closed-won":
      return "bg-green-100 text-green-800";
    case "closed-lost":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

const columns: Column<Opportunity>[] = [
  {
    key: "name",
    header: "Opportunity Name",
    className: "font-medium text-gray-900",
  },
  {
    key: "accountName",
    header: "Account",
    className: "text-gray-500",
  },
  {
    key: "stage",
    header: "Stage",
    render: (opportunity) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(
          opportunity.stage,
        )}`}
      >
        {opportunity.stage.replace("-", " ")}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    className: "text-gray-900 font-medium",
    render: (opportunity) => formatAmount(opportunity.amount),
  },
  {
    key: "createdAt",
    header: "Created",
    className: "text-gray-500",
    render: (opportunity) => formatDate(opportunity.createdAt),
  },
];

export default function OpportunityTable({
  opportunities,
}: OpportunityTableProps) {
  const emptyState = {
    title: "No opportunities yet",
    description: "Convert leads to opportunities to see them here.",
  };

  const sortedByCreatedAt = [...opportunities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Table
      data={sortedByCreatedAt}
      columns={columns}
      emptyState={emptyState}
      getRowKey={(opportunity) => opportunity.id}
    />
  );
}
