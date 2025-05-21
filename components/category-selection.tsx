"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import OrganizationList from "./organization-list";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

// const fetchCategories = async () => {
//   try {
//     const token = localStorage.getItem("auth-token");
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/v1/categories`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Organization {
  id: string;
  name: string;
  logo: string;
  description: string;
}

// Define the Steps type
type Step = "category" | "organization" | "branch" | "service" | "datetime";

export default function CategorySelection() {
  
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(
      { id: "df41b5cf-0a23-4fa0-b9d1-f0f58791ffc1", name: "Soreti Spa & Massage", logo: "/soreti-logo.png", description: "Default description" }
    );
  // Start directly with branch selection
  const [currentStep, setCurrentStep] = useState<Step>("branch");
  const { toast } = useToast();

  // const handleBackToCategories = () => {
  //   setSelectedCategory(null);
  //   setAutoScroll(true);
  //   setCurrentStep("category");
  // };

  // Callback for when an organization is selected
  const handleOrganizationSelect = (organization: Organization) => {
    setSelectedOrganization(organization);
    setCurrentStep("branch");
  };

  // Generic back handler for navigating steps
  const handleBack = () => {
    if (
      currentStep === "branch" ||
      currentStep === "service" ||
      currentStep === "datetime"
    ) {
      // Instead of going back to organization, just reset the current step to branch
      setCurrentStep("branch");
      // Reset service/datetime selections if needed
      if (window) {
        const resetEvent = new CustomEvent("resetSelections", {
          detail: { trigger: "backToBranch" },
        });
        window.dispatchEvent(resetEvent);
      }
    }
  };

  // Callback when a step is completed in child components
  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <div className="space-y-8">
      {/* Back Button (shown on all steps except category) */}
      {currentStep !== "branch" && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}


      {/* Branch, Service, and DateTime steps */}
      {selectedOrganization &&
        currentStep !== "organization" &&
        currentStep !== "category" && (
          <div>
            <OrganizationList
              // categoryId={selectedCategory!.id}
              // categoryName={selectedCategory!.name}
              // category={selectedCategory!}
              // handleBackforCategory={handleBackToCategories}
              onOrganizationSelect={handleOrganizationSelect}
              selectedOrganization={selectedOrganization}
              currentStep={currentStep}
              onStepChange={handleStepChange}
            />
          </div>
        )}
    </div>
  );
}
