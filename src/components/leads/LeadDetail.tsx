import React, { useState, useEffect } from "react";
import type { Lead, LeadStatus } from "../../types";
import { validateEmail } from "../../utils/validation";
import { SlidePanel, Button, Input, Select } from "../ui";
import { useLeads, useOpportunities } from "../../hooks";

interface LeadDetailProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (lead: Lead) => void;
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "unqualified", label: "Unqualified" },
];

export default function LeadDetail({
  lead,
  isOpen,
  onClose,
  onConvert,
}: LeadDetailProps) {
  const { updateLead } = useLeads();
  const { isLeadConverted } = useOpportunities();
  const [editedLead, setEditedLead] = useState<Lead | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setEditedLead({ ...lead });
      setEmailError(null);
      setIsEditing(false);
    }
  }, [lead]);

  const hasLead = Boolean(lead && editedLead);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedLead || !lead) return;

    const newEmail = e.target.value;
    setEditedLead({ ...editedLead, email: newEmail });

    if (newEmail !== lead.email) {
      setIsEditing(true);

      const error = validateEmail(newEmail);
      setEmailError(error);
    } else {
      setEmailError(null);

      if (editedLead.status === lead.status) {
        setIsEditing(false);
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editedLead || !lead) return;

    const newStatus = e.target.value as LeadStatus;
    setEditedLead({ ...editedLead, status: newStatus });

    if (newStatus !== lead.status || editedLead.email !== lead.email) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (emailError || !editedLead) return;

    setIsSaving(true);
    try {
      await updateLead(editedLead);

      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!lead) return;

    setEditedLead({ ...lead });
    setEmailError(null);
    setIsEditing(false);
    onClose();
  };

  const handleConvert = () => {
    if (!editedLead) return;

    onConvert(editedLead);
  };

  const canSave = isEditing && !emailError && !isSaving;
  const isAlreadyConverted = lead ? isLeadConverted(lead.id) : false;

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title="Lead Details">
      {hasLead ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-sm text-gray-900">{lead!.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <p className="text-sm text-gray-900">{lead!.company}</p>
              </div>

              <Input
                id="email"
                label="Email"
                type="email"
                value={editedLead!.email}
                onChange={handleEmailChange}
                error={emailError || undefined}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <p className="text-sm text-gray-900 capitalize">
                  {lead!.source.replace("_", " ")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score
                </label>
                <p className="text-sm font-semibold text-blue-600">
                  {lead!.score}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Lead Status
            </h3>
            <Select
              id="status"
              label="Status"
              options={statusOptions}
              value={editedLead!.status}
              onChange={handleStatusChange}
            />
          </div>

          <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                disabled={!canSave}
                isLoading={isSaving}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            <Button
              variant="secondary"
              onClick={handleConvert}
              className="w-full"
              disabled={isEditing || isAlreadyConverted}
            >
              {isAlreadyConverted
                ? "Already Converted"
                : "Convert to Opportunity"}
            </Button>
          </div>
        </div>
      ) : null}
    </SlidePanel>
  );
}
