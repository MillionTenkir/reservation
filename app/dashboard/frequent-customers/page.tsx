"use client";

import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

import { motion } from "framer-motion";
import {
  CalendarArrowDown,
  Edit,
  MoreHorizontal,
  ShoppingBag,
  TicketCheck,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const roleDisplayMap: Record<string, string> = {
  superadmin: "Super Admin",
  organization_manager: "Organization Manager",
  branch_manager: "Branch Manager",
  field_agent: "Field Agent",
  restaurant_officer: "Restaurant Officer",
  administrator: "Administrator",
};

const mockUsers = [
  {
    id: "1",
    name: "Million Tenkir",
    cnr: "+251938310147",
    frequency: "1",
    reservationDate: "2025-03-13",
  },
  {
    id: "2",
    name: "William M",
    cnr: "REWQDF",
    frequency: "5",
    reservationDate: "2025-03-13",
  },
  {
    id: "3",
    name: "Abenezer A",
    cnr: "IOPDDF",
    frequency: "1",
    reservationDate: "2025-03-13",
  },
  {
    id: "4",
    name: "Abel L",
    cnr: "NMDSA",
    frequency: "4",
    reservationDate: "2025-03-13",
  },
  {
    id: "5",
    name: "Bernabas",
    cnr: "NMYFAE",
    frequency: "5",
    reservationDate: "2025-03-13",
  },
  {
    id: "6",
    name: "Yonas",
    cnr: "BDHSAE",
    frequency: "5",
    reservationDate: "2025-03-13",
  },
  {
    id: "7",
    name: "Mary",
    cnr: "BVCXTR",
    frequency: "5",
    reservationDate: "2025-03-13",
  },
  {
    id: "8",
    name: "Gemechiftu",
    cnr: "HFUDAS",
    frequency: "4",
    reservationDate: "2025-03-13",
  },
  {
    id: "9",
    name: "Nardos",
    cnr: "NFJDAU",
    frequency: "5",
    reservationDate: "2025-03-13",
  },
  {
    id: "10",
    name: "Kanu",
    cnr: "YUFDA",
    frequency: "1",
    reservationDate: "2025-03-13",
  },
  {
    id: "11",
    name: "Khalid",
    cnr: "TYFDA",
    frequency: "5",
    reservationDate: "2025-03-13",
  },
  {
    id: "12",
    name: "Lidya",
    cnr: "QIWOQ",
    frequency: "4",
    reservationDate: "2025-03-13",
  },
];

export default function FrequentCustomers() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
  ]);
  const [selectedUsers, setSelectedUsers] = useState<(typeof mockUsers)[0][]>(
    []
  );
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoadingdData, setIsLoadingData] = useState(false);

  const handleSendSMS = () => {
    if (!message) {
      toast({
        title: "Error",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one customer",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingData(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoadingData(false);
      toast({
        title: "Success",
        description: `SMS sent to ${selectedUsers.length} customers`,
      });
      setMessage("");
      setSubject("");
      setSelectedUsers([]);
    }, 1500);
  };

  const columns: ColumnDef<(typeof mockUsers)[0]>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected(!!e.target.checked);
            if (e.target.checked) {
              setSelectedUsers((prev) => [...prev, row.original]);
            } else {
              setSelectedUsers((prev) =>
                prev.filter((user) => user.id !== row.original.id)
              );
            }
          }}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "cnr",
      header: "Mobile",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "reservationDate",
      header: "Last Reservation Date",
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 mb-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Customers Managment
          </h1>
        </div>
        <p className="text-muted-foreground">
          From Frequent Customers to least Frequent Customers.
        </p>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-5">
        <StatCard
          title="Total Customers"
          value={4243}
          icon={CalendarArrowDown}
          className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
          // change={{ value: 25, trend: "up" }}
        />
        <StatCard
          title="Loyal Customers"
          value={2343}
          icon={Users}
          // change={{ value: 25, trend: "up" }}
          className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
        />
        <StatCard
          title="Regular Customers"
          value={600}
          icon={TicketCheck}
          // change={{ value: 12.4, trend: "up" }}
          className="bg-gradient-to-r from-[#076691] to-[#b1efcd] text-white"
        />
        <StatCard
          title="One Time Customers"
          value={100}
          icon={TicketCheck}
          // change={{ value: 12.4, trend: "up" }}
          className="bg-gradient-to-r from-[#076691] to-gray-100 text-white"
        />
        {/* <div></div> */}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AnimatedGradientBorder>
              <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg">
                <DataTable
                  columns={columns}
                  data={mockUsers}
                  searchColumn="name"
                  filterColumn={{
                    name: "frequency",
                    options: [
                      { label: "Most Frequent", value: "5" },
                      {
                        label: "Less Frequent",
                        value: "4",
                      },
                      { label: "Above 3 Months", value: "1" },
                    ],
                  }}
                />
              </div>
            </AnimatedGradientBorder>
          </motion.div>
        </div>
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-5">
                <h1 className="text-center text-[15px]">
                  Send Bulk SMS to Customers
                </h1>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium">
                      {selectedUsers.length} customers selected
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUsers([])}
                      disabled={selectedUsers.length === 0}
                    >
                      Clear Selection
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="subject">Subject (Optional)</Label>
                      <Input
                        id="subject"
                        placeholder="SMS Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="message">Message Content</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {/* <p>Characters: {message.length}</p>
                      <p>
                        Estimated cost: $
                        {(
                          message.length *
                          selectedUsers.length *
                          0.001
                        ).toFixed(2)}
                      </p> */}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSendSMS}
                    disabled={
                      isLoadingdData || !message || selectedUsers.length === 0
                    }
                  >
                    {isLoadingdData ? "Sending..." : "Send SMS"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
