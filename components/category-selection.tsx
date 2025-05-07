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

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem("auth-token");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/categories`,
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

// Define the Steps type
type Step = "category" | "organization" | "branch" | "service" | "datetime";

export default function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("category");
  const { toast } = useToast();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Auto-scroll effect when no category is selected
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout | null = null;

    if (
      autoScroll &&
      currentStep === "category" &&
      carouselRef.current &&
      categories?.length > 0
    ) {
      scrollInterval = setInterval(() => {
        if (carouselRef.current) {
          const scrollAmount = 220; // Approximate width of a card
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
  }, [currentStep, categories, autoScroll]);

  if (categoriesError) {
    toast({
      title: "Error",
      description: "Failed to load categories. Please try again.",
      variant: "destructive",
    });
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setAutoScroll(false);
    setCurrentStep("organization");

    // Reset all selections in the child components
    // This will ensure child components start fresh when a new category is selected
    if (window) {
      // Use a custom event to communicate with child components
      const resetEvent = new CustomEvent("resetSelections", {
        detail: { trigger: "categoryChange" },
      });
      window.dispatchEvent(resetEvent);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setAutoScroll(true);
    setCurrentStep("category");
  };

  // Callback for when an organization is selected
  const handleOrganizationSelect = (organization: Organization) => {
    setSelectedOrganization(organization);
    setCurrentStep("branch");
  };

  // Generic back handler for navigating steps
  const handleBack = () => {
    if (currentStep === "organization") {
      handleBackToCategories();
    } else if (
      currentStep === "branch" ||
      currentStep === "service" ||
      currentStep === "datetime"
    ) {
      setCurrentStep("organization");
      setSelectedOrganization(null);
      // Reset branch/service/datetime selections
      if (window) {
        const resetEvent = new CustomEvent("resetSelections", {
          detail: { trigger: "backToOrganization" },
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
      {currentStep !== "category" && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      {/* Category Selection Step */}
      <AnimatePresence>
        {currentStep === "category" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              {categoriesLoading ? (
                <div className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center min-w-[100px] flex-shrink-0 snap-start"
                    >
                      <div className="rounded-full bg-gray-200 w-14 h-14 mb-2">
                        <Skeleton className="h-full w-full rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar"
                  onMouseEnter={() => setAutoScroll(false)}
                  onMouseLeave={() =>
                    currentStep === "category" && setAutoScroll(true)
                  }
                >
                  {categories?.length > 0 &&
                    categories?.map((category: Category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center min-w-[100px] flex-shrink-0 snap-start cursor-pointer"
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div
                          className={`flex items-center justify-center rounded-full w-14 h-14 mb-2 ${
                            selectedCategory?.id === category.id
                              ? "bg-[#E6007E]/10 border-2 border-[#E6007E]"
                              : "bg-[#E6007E]/5 border border-[#E6007E]/30"
                          }`}
                        >
                          <span className="text-[#E6007E] text-2xl">
                            {category.icon === "chalkboard-teacher" && "💆"}
                            {category.icon === "scissors" && "✂️"}
                            {category.icon === "utensils" && "🍽️"}
                            {category.icon === "dumbbell" && "💪"}
                            {category.icon === "landmark" && "🏛️"}
                            {category.icon === "restaurant" && "🏦"}
                            {category.icon === "spa" && "🏥"}
                          </span>
                        </div>
                        <span
                          className={`text-center font-medium text-sm ${
                            selectedCategory?.id === category.id
                              ? "text-[#E6007E]"
                              : "text-gray-700"
                          }`}
                        >
                          {category.name}
                        </span>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OrganizationList Step */}
      {selectedCategory && currentStep === "organization" && (
        <div>
          <OrganizationList
            categoryId={selectedCategory.id}
            categoryName={selectedCategory.name}
            category={selectedCategory}
            handleBackforCategory={handleBackToCategories}
            onOrganizationSelect={handleOrganizationSelect}
          />
        </div>
      )}

      {/* Branch, Service, and DateTime steps are handled by OrganizationList and its child components */}
      {selectedOrganization &&
        currentStep !== "organization" &&
        currentStep !== "category" && (
          <div>
            <OrganizationList
              categoryId={selectedCategory!.id}
              categoryName={selectedCategory!.name}
              category={selectedCategory!}
              handleBackforCategory={handleBackToCategories}
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
