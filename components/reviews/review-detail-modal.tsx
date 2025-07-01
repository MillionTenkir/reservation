"use client";

import { useState } from "react";
import { FuturisticModal } from "@/components/ui/futuristic-modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Flag, CheckCircle, Send, AlertCircle } from "lucide-react";

interface ReviewDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: {
    id: string;
    customer: string;
    email: string;
    organization: string;
    branch: string;
    rating: number;
    message: string;
    status: string;
    createdAt: Date;
  };
}

export function ReviewDetailModal({
  open,
  onOpenChange,
  review,
}: ReviewDetailModalProps) {
  const [response, setResponse] = useState("");
  const [respondingStatus, setRespondingStatus] = useState<
    "idle" | "sending" | "sent"
  >("idle");

  const handleSendResponse = () => {
    if (!response.trim()) return;

    setRespondingStatus("sending");

    // Simulate API call
    setTimeout(() => {
      setRespondingStatus("sent");
      // Reset after showing success message
      setTimeout(() => {
        setRespondingStatus("idle");
        setResponse("");
        onOpenChange(false);
      }, 1500);
    }, 1000);
  };

  const handleFlagReview = () => {
    // Simulate API call to flag the review
    setTimeout(() => {
      onOpenChange(false);
    }, 500);
  };

  const handleApproveReview = () => {
    // Simulate API call to approve the review
    setTimeout(() => {
      onOpenChange(false);
    }, 500);
  };

  return (
    <FuturisticModal
      open={open}
      onOpenChange={onOpenChange}
      title="Review Details"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{review.customer}</h3>
            <p className="text-sm text-gray-500">{review.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              <span className="font-medium">Date:</span>{" "}
              {review.createdAt.toLocaleDateString()}
            </p>
            <p className="text-sm">
              <span className="font-medium">Organization:</span>{" "}
              {review.organization}
            </p>
            <p className="text-sm">
              <span className="font-medium">Branch:</span> {review.branch}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
            </div>
            <span className="text-sm font-medium">{review.rating}/5</span>
          </div>
          <p className="whitespace-pre-line">{review.message}</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Respond to this review</h4>
          <Textarea
            placeholder="Type your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex justify-between">
            <div className="space-x-2">
              {review.status === "flagged" ? (
                <Button
                  onClick={handleApproveReview}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              ) : (
                <Button
                  onClick={handleFlagReview}
                  variant="outline"
                  className="flex items-center gap-1 text-red-500"
                >
                  <Flag className="h-4 w-4" />
                  Flag
                </Button>
              )}
            </div>
            <Button
              onClick={handleSendResponse}
              disabled={!response.trim() || respondingStatus !== "idle"}
              className="flex items-center gap-1"
            >
              {respondingStatus === "idle" && (
                <>
                  <Send className="h-4 w-4" />
                  Send Response
                </>
              )}
              {respondingStatus === "sending" && "Sending..."}
              {respondingStatus === "sent" && (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Sent!
                </>
              )}
            </Button>
          </div>
        </div>

        {review.status === "flagged" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800 dark:text-red-400">
                Flagged Review
              </p>
              <p className="text-red-700 dark:text-red-300">
                This review has been flagged for containing inappropriate
                content or violating community guidelines.
              </p>
            </div>
          </div>
        )}
      </div>
    </FuturisticModal>
  );
}
