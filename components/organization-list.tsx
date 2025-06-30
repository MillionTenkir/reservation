"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import BranchSelection from "./branch-selection";
import axios from "axios";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  logo: string;
  description: string;
}

// Define the Steps type to match the parent component
type Step = "category" | "organization" | "branch" | "service" | "datetime";

interface OrganizationListProps {
  onOrganizationSelect?: (org: Organization) => void;
  selectedOrganization?: Organization | null;
  currentStep?: Step;
  onStepChange?: (step: Step) => void;
  setCurrentStep?: (step: Step) => void;
}

export default function OrganizationList({
  onOrganizationSelect,
  selectedOrganization,
  currentStep = "organization",
  onStepChange,
  setCurrentStep,
}: OrganizationListProps) {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(
    selectedOrganization || null
  );
  const { toast } = useToast();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Update local state when prop changes
  useEffect(() => {
    if (selectedOrganization) {
      setSelectedOrg(selectedOrganization);
    }
  }, [selectedOrganization]);

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);
    setAutoScroll(false);

    // Notify parent component about organization selection
    if (onOrganizationSelect) {
      onOrganizationSelect(org);
    }
  };

  const handleBack = () => {
    setSelectedOrg(null);
    setAutoScroll(true);
  };

  // Handle step changes from child components
  const handleStepChange = (step: Step) => {
    if (onStepChange) {
      onStepChange(step);
    }
  };

  return (
    <div>
      {/* Show BranchSelection when an organization is selected */}
      {selectedOrg &&
        (currentStep === "branch" ||
          currentStep === "service" ||
          currentStep === "datetime") && (
          <div className="mt-0">
            <BranchSelection
              organization={selectedOrg}
              onBack={handleBack}
              // handleBackforCategory={handleBackforCategory}
              currentStep={currentStep}
              onStepChange={handleStepChange}
              setCurrentStep={setCurrentStep}
            />
          </div>
        )}
    </div>
  );
}
