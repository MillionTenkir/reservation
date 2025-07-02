"use client";

import { Button } from "@/components/ui/button";
import {
  CalendarArrowDown,
  Edit,
  MoreHorizontal,
  ShoppingBag,
  TicketCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export default function ReservationsPage() {
  const { isAuthorized, isAdminLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
  ]);

  if (isAdminLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  const roleDisplayMap: Record<string, string> = {
    superadmin: "Super Admin",
    organization_manager: "Organization Manager",
    branch_manager: "Branch Manager",
    field_agent: "Field Agent",
    restaurant_officer: "Restaurant Officer",
    administrator: "Administrator",
  };

  const columns: ColumnDef<(typeof mockUsers)[0]>[] = [
    {
      accessorKey: "name",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "cnr",
      header: "CNR",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "reservationDate",
      header: "Reservation Date",
    },
    {
      accessorKey: "reservationTime",
      header: "Reservation Time",
    },
    {
      accessorKey: "service",
      header: "Service",
    },
    {
      accessorKey: "role",
      header: "Reservation Through",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <div>{roleDisplayMap[role] || role}</div>;
      },
    },
    {
      accessorKey: "availability",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={status === "checked in" ? "default" : "outline"}
            className={
              status === "active" ? "bg-pink-200 text-pink-500" : "text-muted-foreground"
            }
          >
            {status === "checked in" ? "Checked In" : "Confirmed"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const mockUsers = [
    {
      id: "1",
      name: "Million Tenkir",
      cnr: "JKDLA",
      status: "confirmed",
      role: "Self",
      availability: "active",
      reservationDate: "2025-01-15",
      reservationTime: "10:00 AM",
      service: "Spa",
    },
    {
      id: "2",
      name: "William M",
      cnr: "REWQDF",
      status: "checked in",
      role: "Call Center",
      availability: "active",
      reservationDate: "2025-01-20",
      reservationTime: "10:00 AM",
      service: "Hair Color",
    },
    {
      id: "3",
      name: "Abenezer A",
      cnr: "IOPDDF",
      status: "checked out",
      role: "Call Center",
      availability: "active",
      reservationDate: "2025-02-01",
      reservationTime: "10:00 AM",
      service: "Massage",
    },
    {
      id: "4",
      name: "Abel L",
      cnr: "NMDSA",
      status: "cancelled",
      role: "Self",
      availability: "active",
      reservationDate: "2025-02-10",
      reservationTime: "10:00 AM",
      service: "Nail Polish",
    },
    {
      id: "5",
      name: "Bernabas",
      cnr: "NMYFAE",
      status: "checked in",
      role: "Self",
      availability: "inactive",
      reservationDate: "2025-02-15",
      reservationTime: "10:00 AM",
      service: "Hair Color",
    },
    {
      id: "6",
      name: "Yonas",
      cnr: "BDHSAE",
      status: "checked out",
      role: "Call Center",
      availability: "active",
      reservationDate: "2025-02-20",
      reservationTime: "10:00 AM",
      service: "Spa",
    },
    {
      id: "7",
      name: "Mary",
      cnr: "BVCXTR",
      status: "checked in",
      role: "Self",
      availability: "active",
      reservationDate: "2025-03-01",
      reservationTime: "10:00 AM",
      service: "Nail Polish",
    },
    {
      id: "8",
      name: "Gemechiftu",
      cnr: "HFUDAS",
      status: "checked out",
      role: "Call Center",
      availability: "inactive",
      reservationDate: "2025-03-05",
      reservationTime: "10:00 AM",
      service: "Hair Color",
    },
    {
      id: "9",
      name: "Nardos",
      cnr: "NFJDAU",
      status: "checked in",
      role: "Self",
      availability: "active",
      reservationDate: "2025-03-10",
      reservationTime: "10:00 AM",
      service: "Nails",
    },
    {
      id: "10",
      name: "Kanu",
      cnr: "YUFDA",
      status: "checked out",
      role: "Call Center",
      availability: "active",
      reservationDate: "2025-03-15",
      reservationTime: "10:00 AM",
      service: "Spa",
    },
    {
      id: "11",
      name: "Khalid",
      cnr: "TYFDA",
      status: "checked in",
      role: "Self",
      availability: "inactive",
      reservationDate: "2025-03-20",
      reservationTime: "10:00 AM",
      service: "Spa",
    },
    {
      id: "12",
      name: "Lidya",
      cnr: "QIWOQ",
      status: "checked out",
      role: "Self",
      availability: "active",
      reservationDate: "2025-03-25",
      reservationTime: "10:00 AM",
      service: "Massage",
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
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
        </div>
        <p className="text-muted-foreground">Manage all Reservations.</p>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-5">
        <StatCard
          title="Total Reservations"
          value={243}
          icon={CalendarArrowDown}
          className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
          // change={{ value: 25, trend: "up" }}
        />
        <StatCard
          title="Queue"
          value={45}
          icon={Users}
          // change={{ value: 25, trend: "up" }}
          className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
        />
        <StatCard
          title="Completed"
          value={87}
          icon={TicketCheck}
          // change={{ value: 12.4, trend: "up" }}
          className="bg-gradient-to-r from-[#076691] to-[#b1efcd] text-white"
        />
        <StatCard
          title="Cancelled"
          value={20}
          icon={ShoppingBag}
          // change={{ value: 8.7, trend: "up" }}
          className="bg-gradient-to-r from-[#076691] to-gray-100 text-white"
        />
      </div>

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
                name: "role",
                options: [
                  { label: "Super Admin", value: "superadmin" },
                  {
                    label: "Organization Manager",
                    value: "organization_manager",
                  },
                  { label: "Branch Manager", value: "branch_manager" },
                  { label: "Field Agent", value: "field_agent" },
                  { label: "Restaurant Officer", value: "restaurant_officer" },
                  { label: "Administrator", value: "administrator" },
                ],
              }}
            />
          </div>
        </AnimatedGradientBorder>
      </motion.div>
    </div>
  );
}
