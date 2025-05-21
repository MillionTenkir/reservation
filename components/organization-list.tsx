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

const fetchOrganizationsByCategory = async (categoryId: string) => {
  if (!categoryId) return [];
  try {
    const token = localStorage.getItem("auth-token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/organizations/category/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

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

// Define the Steps type to match the parent component
type Step = "category" | "organization" | "branch" | "service" | "datetime";

interface OrganizationListProps {
  categoryId: string;
  categoryName: string;
  category: Category;
  // handleBackforCategory: () => void;
  onOrganizationSelect?: (org: Organization) => void;
  selectedOrganization?: Organization | null;
  currentStep?: Step;
  onStepChange?: (step: Step) => void;
}

export default function OrganizationList({
  categoryId,
  categoryName,
  category,
  // handleBackforCategory,
  onOrganizationSelect,
  selectedOrganization,
  currentStep = "organization",
  onStepChange,
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

  // Add event listener to reset selection when a new category is selected
  useEffect(() => {
    const handleResetSelections = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.trigger === "categoryChange") {
        setSelectedOrg(null);
      } else if (customEvent.detail?.trigger === "backToOrganization") {
        // Keep the organization selection but reset branch/service selections
        // This is handled in BranchSelection component
      }
    };

    window.addEventListener("resetSelections", handleResetSelections);

    return () => {
      window.removeEventListener("resetSelections", handleResetSelections);
    };
  }, []);

  const {
    data: organizations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizations", categoryId],
    queryFn: () => fetchOrganizationsByCategory(categoryId || ""),
    enabled: !!categoryId,
  });

  // Auto-scroll effect when no organization is selected
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;

    if (
      autoScroll &&
      !selectedOrg &&
      carouselRef.current &&
      organizations?.length > 0 &&
      currentStep === "organization"
    ) {
      scrollInterval = setInterval(() => {
        if (carouselRef.current) {
          const scrollAmount = 120; // Approximate width of an org item
          const currentScroll = carouselRef.current.scrollLeft;
          const maxScroll =
            carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

          // If we're at the end, loop back to start
          if (currentScroll >= maxScroll - 20) {
            carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            carouselRef.current.scrollBy({
              left: scrollAmount,
              behavior: "smooth",
            });
          }
        }
      }, 3000); // Scroll every 3 seconds
    }

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [selectedOrg, organizations, autoScroll, currentStep]);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load organizations. Please try again.",
      variant: "destructive",
    });
  }

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
      {/* Organization list - only show when in organization step */}
      {currentStep === "organization" && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center font-work-sans font-gray-800">
              {categoryName}
            </h2>

            {isLoading ? (
              <div className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center min-w-[120px] flex-shrink-0 snap-start"
                  >
                    <div className="rounded-full bg-gray-200 w-16 h-16 mb-2">
                      <Skeleton className="h-full w-full rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                ref={carouselRef}
                className="grid grid-cols-3 overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar"
                onMouseEnter={() => setAutoScroll(false)}
                onMouseLeave={() => !selectedOrg && setAutoScroll(true)}
              >
                {organizations?.length > 0 &&
                  organizations?.map((org: Organization) => (
                    <motion.div
                      key={org.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center min-w-[120px] flex-shrink-0 snap-start cursor-pointer"
                      onClick={() => handleOrgSelect(org)}
                    >
                      <div
                        className={`flex items-center justify-center rounded-full w-16 h-16 mb-2 overflow-hidden border-2 ${
                          selectedOrg?.id === org.id
                            ? "border-[#E6007E]"
                            : "border-[#E6007E]/30"
                        }`}
                      >
                        <img
                          src={org.logo || "/placeholder.svg"}
                          alt={org.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-center font-medium text-sm ${
                          selectedOrg?.id === org.id
                            ? "text-[#E6007E]"
                            : "text-gray-700"
                        }`}
                      >
                        {org.name}
                      </span>
                      <span className="text-xs text-gray-500 text-center line-clamp-1">
                        {org.description}
                      </span>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

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
            />
          </div>
        )}
    </div>
  );
}
