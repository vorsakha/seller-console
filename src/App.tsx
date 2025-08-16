import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import { useLocalStorage } from "./hooks";
import { Layout } from "./components/layout";
import { LeadDetail, LeadsList } from "./components/leads";
import { ConvertDialog, OpportunitiesList } from "./components/opportunities";
import { useAppContext } from "./context/AppContext";
import type { Lead } from "./types";

function AppContent() {
  useLocalStorage();
  const { state } = useAppContext();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedLead(null);
  };

  const handleConvertLead = (lead: Lead) => {
    setConvertingLead(lead);
    setIsConvertOpen(true);
    setIsDetailOpen(false);
  };

  const handleConvertClose = () => {
    setIsConvertOpen(false);
    setConvertingLead(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="ml-3">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          </div>
        )}

        <section>
          <LeadsList onLeadSelect={handleLeadSelect} />
        </section>

        <section>
          <OpportunitiesList />
        </section>
      </div>

      <LeadDetail
        lead={selectedLead}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
        onConvert={handleConvertLead}
      />

      <ConvertDialog
        lead={convertingLead}
        isOpen={isConvertOpen}
        onClose={handleConvertClose}
      />
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
