"use client";

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import { DataTable } from "@/components/ui/data-table";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { StatCard } from "@/components/ui/stat-card";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, MessageSquare, ThumbsUp, Flag, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReviewDetailModal } from "@/components/reviews/review-detail-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Mock data for reviews
const mockReviews = Array(20)
  .fill(null)
  .map((_, i) => ({
    id: `review-${i + 1}`,
    customer: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    organization: `Organization ${Math.ceil((i + 1) / 5)}`,
    branch: `Branch ${Math.ceil((i + 1) / 3)}`,
    rating: Math.floor(Math.random() * 5) + 1,
    message: `This is a ${
      i % 2 === 0 ? "positive" : "constructive"
    } review about the service. ${
      i % 3 === 0
        ? "Really enjoyed the experience!"
        : "There are some areas for improvement."
    }`,
    status: i % 10 === 0 ? "flagged" : "approved",
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ),
  }));

// Generate mock ratings distribution
const ratingsDistribution = {
  5: 18141,
  4: 4172,
  3: 3133,
  2: 1130,
  1: 1551,
};

// Calculate total ratings
const totalRatings = Object.values(ratingsDistribution).reduce(
  (a, b) => a + b,
  0
);

// Calculate average rating
const weightedSum = Object.entries(ratingsDistribution).reduce(
  (sum, [rating, count]) => sum + Number(rating) * count,
  0
);
const averageRating = (weightedSum / totalRatings).toFixed(2);

export default function ReviewsPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
  ]);

  const [selectedReview, setSelectedReview] = useState<
    (typeof mockReviews)[0] | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // Filter reviews based on search and filters
  const filteredReviews = mockReviews.filter((review) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.message.toLowerCase().includes(searchTerm.toLowerCase());

    // Rating filter
    const matchesRating =
      ratingFilter === null || review.rating === ratingFilter;

    // Branch filter (mocked - in real app would filter by branch)
    const matchesBranch =
      selectedBranch === "All Branches" ||
      review.branch.includes(selectedBranch);

    return matchesSearch && matchesRating && matchesBranch;
  });

  // Calculate statistics
  const totalReviews = mockReviews.length;
  const positiveReviews = mockReviews.filter(
    (review) => review.rating >= 4
  ).length;
  const flaggedReviews = mockReviews.filter(
    (review) => review.status === "flagged"
  ).length;

  if (isLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-gray-500">All Customer Feedbacks are here.</p>
      </div>

      {/* Overall Ratings Section */}
      <div className="flex justify-center mb-8">
        <Card className="bg-card/50 backdrop-blur-sm max-w-5xl w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-center">
              General Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                defaultValue="All Branches"
                onValueChange={setSelectedBranch}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Branches">All Branches</SelectItem>
                  <SelectItem value="Branch 1">Branch 1</SelectItem>
                  <SelectItem value="Branch 2">Branch 2</SelectItem>
                  <SelectItem value="Branch 3">Branch 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-center mb-6">
              <h2 className="text-5xl font-bold">
                {averageRating}{" "}
                <span className="text-2xl text-muted-foreground">/ 5</span>
              </h2>
              <div className="flex my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(Number(averageRating))
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">
                {totalRatings.toLocaleString()} Ratings
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Ratings Summary</h3>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center w-16">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{rating}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full rounded-full"
                      style={{
                        width: `${
                          (ratingsDistribution[
                            rating as keyof typeof ratingsDistribution
                          ] /
                            totalRatings) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {ratingsDistribution[
                      rating as keyof typeof ratingsDistribution
                    ].toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Updated automatically every 10 seconds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6"
      >
        <StatCard
          title="Total Reviews"
          value={totalReviews}
          icon={MessageSquare}
          change={{ value: 12, trend: "up" }}
        />
        <StatCard
          title="Average Rating"
          value={Number(averageRating)}
          icon={Star}
          change={{ value: 0.2, trend: "up" }}
        />
        <StatCard
          title="Positive Reviews"
          value={positiveReviews}
          icon={ThumbsUp}
          change={{ value: 8, trend: "up" }}
        />
      </motion.div> */}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select
            defaultValue="all"
            onValueChange={(value) =>
              setRatingFilter(value === "all" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setRatingFilter(null);
              setSelectedBranch("All Branches");
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.customer}</CardTitle>
                    <CardDescription>
                      {review.organization} - {review.branch}
                    </CardDescription>
                  </div>
                  {review.status === "flagged" && (
                    <Badge variant="destructive">Flagged</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2 flex-grow">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="line-clamp-3 text-sm">{review.message}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {review.createdAt.toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedReview(review);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <ReviewDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          review={selectedReview}
        />
      )}
    </div>
  );
}
