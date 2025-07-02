"use client";

import { useState, useEffect } from "react";
import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const branches = [
  { id: "1", name: "Soreti Spa, Welo Sefer" },
  { id: "2", name: "Soreti Spa, Addis Ababa" },
];

const mockPayments = [
  {
    id: "1",
    reference: "PAY-001",
    amount: 5000,
    branch: "Main Branch",
    paymentDate: "2023-09-15",
    status: "Completed",
    customer: "John Doe",
  },
  {
    id: "2",
    reference: "PAY-002",
    amount: 3500,
    branch: "Downtown Branch",
    paymentDate: "2023-09-16",
    status: "Completed",
    customer: "Jane Smith",
  },
  {
    id: "3",
    reference: "PAY-003",
    amount: 7200,
    branch: "Main Branch",
    paymentDate: "2023-09-17",
    status: "Completed",
    customer: "Bob Johnson",
  },
  {
    id: "4",
    reference: "PAY-004",
    amount: 4100,
    branch: "Eastside Branch",
    paymentDate: "2023-09-18",
    status: "Failed",
    customer: "Alice Brown",
  },
  {
    id: "5",
    reference: "PAY-005",
    amount: 6300,
    branch: "Westside Branch",
    paymentDate: "2023-09-19",
    status: "Completed",
    customer: "Charlie Wilson",
  },
  {
    id: "6",
    reference: "PAY-006",
    amount: 2800,
    branch: "Downtown Branch",
    paymentDate: "2023-09-20",
    status: "Pending",
    customer: "David Miller",
  },
  {
    id: "7",
    reference: "PAY-007",
    amount: 9200,
    branch: "Main Branch",
    paymentDate: "2023-09-21",
    status: "Completed",
    customer: "Eve Taylor",
  },
  {
    id: "8",
    reference: "PAY-008",
    amount: 3700,
    branch: "Eastside Branch",
    paymentDate: "2023-09-22",
    status: "Completed",
    customer: "Frank Anderson",
  },
];

// Define table columns
const columns = [
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: { row: any }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ETB",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
    cell: ({ row }: { row: any }) => {
      return format(new Date(row.getValue("paymentDate")), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => {
      const status = row.getValue("status");
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === "Completed"
              ? "bg-green-100 text-green-800"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </div>
      );
    },
  },
];

export default function PaymentsPage() {
  const { isAuthorized, isAdminLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
  ]);

  const [payments, setPayments] = useState(mockPayments);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total amount based on filters
  useEffect(() => {
    let filteredPayments = mockPayments;

    if (selectedBranch !== "all") {
      filteredPayments = filteredPayments.filter(
        (payment) =>
          payment.branch ===
          branches.find((branch) => branch.id === selectedBranch)?.name
      );
    }

    if (startDate) {
      filteredPayments = filteredPayments.filter(
        (payment) => new Date(payment.paymentDate) >= startDate
      );
    }

    if (endDate) {
      filteredPayments = filteredPayments.filter(
        (payment) => new Date(payment.paymentDate) <= endDate
      );
    }

    setPayments(filteredPayments);
    const total = filteredPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    setTotalAmount(total);
  }, [selectedBranch, startDate, endDate]);

  if (isAdminLoading) return <RoleGuardLoading />;
  if (!isAuthorized) return <div>Unauthorized</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-gray-500">View all payment reports.</p>
      </div>

      {/* Stat Card */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
        <StatCard
          title="Total Amount"
          value={totalAmount}
          icon={DollarSign}
          prefix="ETB "
          decimal={true}
          className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
        />

        {/* Filters Section */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row gap-4 items-end justify-end">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] justify-start text-left font-normal"
              >
                {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] justify-start text-left font-normal"
              >
                {endDate ? format(endDate, "PPP") : <span>End Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payments}
            searchColumn="reference"
            filterColumn={{
              name: "status",
              options: [
                { label: "Completed", value: "Completed" },
                { label: "Pending", value: "Pending" },
                { label: "Failed", value: "Failed" },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
