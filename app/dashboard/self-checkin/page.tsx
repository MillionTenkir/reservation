"use client";

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FuturisticModal } from "@/components/ui/futuristic-modal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import Image from "next/image";

interface Customer {
  id: string;
  name: string;
  mobileNumber: string;
  cnr: string;
}

export default function SelfCheckinPage() {
  const { isAuthorized, isAdminLoading } = useRoleGuard([
    "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock function to simulate customer search
  const handleSearch = () => {
    // In a real application, this would be an API call
    if (searchQuery) {
      setFoundCustomer({
        id: "1",
        name: "Meheret Tesfaye",
        mobileNumber: "0911111111",
        cnr: "ABCDE",
      });
    }
  };

  const handleConfirmCheckin = () => {
    // In a real application, this would be an API call to confirm checkin
    console.log("Checkin confirmed for:", foundCustomer);
    setIsModalOpen(false);
    setSearchQuery("");
    setFoundCustomer(null);
  };

  if (isAdminLoading) {
    return <RoleGuardLoading />;
  }
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl">
          <Image
            src="/fancy border.jpg"
            alt="Welcome background"
            fill
            className="object-contain"
            priority
          />
          {/* <div className="absolute inset-0 bg-black/20" /> */}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-[25px] font-bold text-center mb-2">Welcome!</h1>
            <p className="text-center text-gray-700 mb-8">
              Please enter your mobile number, full name, or CNR to check in
            </p>

            <div className="flex gap-2 mb-8">
              <Input
                placeholder="Enter mobile number, name, or CNR"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {foundCustomer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setIsModalOpen(true)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle>{foundCustomer.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          CNR: {foundCustomer.cnr}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Mobile: {foundCustomer.mobileNumber}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <FuturisticModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Confirm Check-in"
        description="Please confirm your details before checking in"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">Name: {foundCustomer?.name}</p>
            <p className="text-sm text-gray-600">CNR: {foundCustomer?.cnr}</p>
            <p className="text-sm text-gray-600">
              Mobile: {foundCustomer?.mobileNumber}
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCheckin}>Confirm Check-in</Button>
          </div>
        </div>
      </FuturisticModal>
    </div>
  );
}
