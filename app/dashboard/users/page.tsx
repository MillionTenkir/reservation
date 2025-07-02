"use client";

import type React from "react";

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import {
  UserPlus,
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Edit,
  Trash2,
  CalendarArrowDown,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { FuturisticModal } from "@/components/ui/futuristic-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchUsers, User } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";


// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@cheche.com",
    mobile: "1111111111",
    role: "superadmin",
    status: "active",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Org Manager",
    email: "orgmanager@cheche.com",
    mobile: "2222222222",
    role: "organization_manager",
    status: "active",
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    name: "Branch Manager",
    email: "branchmanager@cheche.com",
    mobile: "3333333333",
    role: "branch_manager",
    status: "active",
    createdAt: "2025-02-01",
  },
  {
    id: "4",
    name: "Field Agent",
    email: "fieldagent@cheche.com",
    mobile: "4444444444",
    role: "field_agent",
    status: "active",
    createdAt: "2025-02-10",
  },
  {
    id: "5",
    name: "Restaurant Officer",
    email: "restaurantofficer@cheche.com",
    mobile: "5555555555",
    role: "restaurant_officer",
    status: "inactive",
    createdAt: "2025-02-15",
  },
  {
    id: "6",
    name: "Administrator",
    email: "administrator@cheche.com",
    mobile: "6666666666",
    role: "administrator",
    status: "active",
    createdAt: "2025-02-20",
  },
  {
    id: "7",
    name: "John Doe",
    email: "john.doe@cheche.com",
    mobile: "7777777777",
    role: "field_agent",
    status: "active",
    createdAt: "2025-03-01",
  },
  {
    id: "8",
    name: "Jane Smith",
    email: "jane.smith@cheche.com",
    mobile: "8888888888",
    role: "branch_manager",
    status: "inactive",
    createdAt: "2025-03-05",
  },
  {
    id: "9",
    name: "Robert Johnson",
    email: "robert.johnson@cheche.com",
    mobile: "9999999999",
    role: "organization_manager",
    status: "active",
    createdAt: "2025-03-10",
  },
  {
    id: "10",
    name: "Emily Davis",
    email: "emily.davis@cheche.com",
    mobile: "1010101010",
    role: "restaurant_officer",
    status: "active",
    createdAt: "2025-03-15",
  },
  {
    id: "11",
    name: "Michael Wilson",
    email: "michael.wilson@cheche.com",
    mobile: "1212121212",
    role: "field_agent",
    status: "inactive",
    createdAt: "2025-03-20",
  },
  {
    id: "12",
    name: "Sarah Brown",
    email: "sarah.brown@cheche.com",
    mobile: "1313131313",
    role: "branch_manager",
    status: "active",
    createdAt: "2025-03-25",
  },
];

// const 

// Role display mapping
const roleDisplayMap: Record<string, string> = {
  superadmin: "Super Admin",
  organization_manager: "Organization Manager",
  branch_manager: "Branch Manager",
  field_agent: "Field Agent",
  restaurant_officer: "Restaurant Officer",
  administrator: "Administrator",
};

// Table columns definition
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstname",
    header: "First Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("firstname")}</div>
    ),
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "role_name",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role_name") as string;
      return <div>{roleDisplayMap[role] || role}</div>;
    },
  },
  {
    accessorKey: "branch_name",
    header: "Branch",
    cell: ({ row }) => {
      const branch = row.getValue("branch_name") as string;
      return <div>{branch}</div>;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("active") as boolean;
      return (
        <Badge
          variant={status ? "default" : "outline"}
          className={
            status === true ? "bg-green-100 text-green-800 hover:bg-green-300" : "text-muted-foreground"
          }
        >
          {status === true ? "Active" : "Inactive"}
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

export default function UsersPage() {
  const { isAuthorized, isAdminLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
  });
const { data: users, isLoading: isLoadingUsers, refetch } = useQuery({
  queryKey: ["users", page, limit, searchQuery],
  queryFn: () => fetchUsers({ page, limit, searchQuery}),
});
console.log("the users are", users);

// Function to handle search input changes
const handleSearch = (value: string) => {
  setSearchQuery(value);
  setPage(1); // Reset to first page when searching
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSelectChange = (value: string) => {
  setFormData((prev) => ({ ...prev, role: value }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Form submitted:", formData);
  // Here you would typically send the data to your API
  setIsAddUserModalOpen(false);
  // Reset form
  setFormData({
    name: "",
    email: "",
    mobile: "",
    role: "",
    password: "",
  });
};

  if (isAdminLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

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
            Users Management
          </h1>
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
        <p className="text-muted-foreground">Manage all users in the system</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          title="Total Users"
          value={243}
          icon={CalendarArrowDown}
          className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
          // change={{ value: 25, trend: "up" }}
        />
        <StatCard
          title="Employees"
          value={45}
          icon={Users}
          // change={{ value: 25, trend: "up" }}
          className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
        />
        <div></div>
        <div></div>
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
              data={users?.users || []}
              searchColumn="firstname"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterColumn={{
                name: "role_name",
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
              pagination={{
                page,
                limit,
                total: users?.total_employees || 0,
                onPageChange: setPage,
                onLimitChange: setLimit,
              }}
              isLoading={isLoadingUsers}
            />
          </div>
        </AnimatedGradientBorder>
      </motion.div>

      <FuturisticModal
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        title="Add New User"
        description="Create a new user account in the system"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="transition-all focus:ring-2 focus:ring-[#e6007e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="transition-all focus:ring-2 focus:ring-[#e6007e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleInputChange}
                required
                className="transition-all focus:ring-2 focus:ring-[#e6007e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger
                  id="role"
                  className="transition-all focus:ring-2 focus:ring-[#e6007e]"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="organization_manager">
                    Organization Manager
                  </SelectItem>
                  <SelectItem value="branch_manager">Branch Manager</SelectItem>
                  <SelectItem value="field_agent">Field Agent</SelectItem>
                  <SelectItem value="restaurant_officer">
                    Restaurant Officer
                  </SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="transition-all focus:ring-2 focus:ring-[#e6007e]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddUserModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </div>
        </form>
      </FuturisticModal>
    </div>
  );
}
