import { useOpportunities } from "../../hooks";
import OpportunityTable from "./OpportunityTable";

export default function OpportunitiesList() {
  const { opportunities } = useOpportunities();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunities</h2>
        <p className="text-gray-600">
          {opportunities.length}{" "}
          {opportunities.length === 1 ? "opportunity" : "opportunities"}
        </p>
      </div>

      <OpportunityTable opportunities={opportunities} />
    </div>
  );
}
