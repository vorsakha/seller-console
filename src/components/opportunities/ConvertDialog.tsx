import React, { useState } from "react";
import type { Lead, OpportunityStage } from "../../types";
import { useOpportunities } from "../../hooks";
import { validateOpportunityAmount } from "../../utils/validation";
import { SlidePanel, Button, Input, Select } from "../ui";

interface ConvertDialogProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const stageOptions = [
  { value: "prospect", label: "Prospect" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed-won", label: "Closed Won" },
  { value: "closed-lost", label: "Closed Lost" },
];

export default function ConvertDialog({
  lead,
  isOpen,
  onClose,
}: ConvertDialogProps) {
  const { convertLead } = useOpportunities();
  const [formData, setFormData] = useState({
    name: "",
    stage: "prospect" as OpportunityStage,
    amount: "",
    accountName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConverting, setIsConverting] = useState(false);

  React.useEffect(() => {
    if (lead && isOpen) {
      setFormData({
        name: `${lead.company} - ${lead.name}`,
        stage: "prospect",
        amount: "",
        accountName: lead.company,
      });

      setErrors({});
    }
  }, [lead, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Opportunity name is required";
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }

    if (formData.amount) {
      const amountError = validateOpportunityAmount(formData.amount);

      if (amountError) {
        newErrors.amount = amountError;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lead || !validateForm()) return;

    setIsConverting(true);
    try {
      await convertLead(lead.id, {
        name: formData.name,
        stage: formData.stage,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        accountName: formData.accountName,
      });

      onClose();
    } finally {
      setIsConverting(false);
    }
  };

  const handleClose = () => {
    if (!isConverting) {
      onClose();
    }
  };

  const hasLead = Boolean(lead);

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      title="Convert Lead to Opportunity"
    >
      {hasLead ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Lead Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <span className="text-sm text-gray-900">{lead!.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Company:
                </span>
                <span className="text-sm text-gray-900">{lead!.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Score:
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {lead!.score}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Opportunity Details
            </h3>
            <div className="space-y-4">
              <Input
                id="opportunity-name"
                label="Opportunity Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                required
              />

              <Input
                id="account-name"
                label="Account Name"
                value={formData.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
                error={errors.accountName}
                required
              />

              <Select
                id="stage"
                label="Stage"
                options={stageOptions}
                value={formData.stage}
                onChange={(e) => handleChange("stage", e.target.value)}
              />

              <Input
                id="amount"
                label="Amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                error={errors.amount}
                helperText="Optional"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              isLoading={isConverting}
              disabled={isConverting}
              className="flex-1"
            >
              Convert Lead
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isConverting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </SlidePanel>
  );
}
