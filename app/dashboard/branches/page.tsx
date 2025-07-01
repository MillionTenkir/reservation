"use client";

import { useState } from "react";
import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createBranch,
  type CreateBranchPayload,
  type Branch,
  type BranchResponse,
} from "@/lib/api/branch";
import { toast } from "sonner";
import { fetchMyBranches } from "../../../lib/api/branch"

export default function BranchesPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBranch, setNewBranch] = useState<CreateBranchPayload>({
    name: "",
    windows: 1,
    location: "",
    servicePerHour: 0,
    description: "",
  });
  const [branches, setBranches] = useState<Branch[]>([]);

  const createBranchMutation = useMutation({
    mutationFn: (branchData: CreateBranchPayload) => createBranch(branchData),
    onSuccess: (data) => {
      setBranches((prev) => [...prev, data]);
      setIsDialogOpen(false);
      setNewBranch({
        name: "",
        windows: 1,
        location: "",
        servicePerHour: 0,
        description: "",
      });
      toast.success("Branch created successfully");
    },
    onError: (error) => {
      console.error("Error creating branch:", error);
      toast.error("Failed to create branch");
    },
  });

  const {data: branchesData, isLoading: branchesDataLoading} = useQuery({
    queryKey: ["branches"],
    queryFn: fetchMyBranches
  })

  console.log("the branch data: ", branchesData)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewBranch((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBranch((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleLocationChange = (value: string) => {
    setNewBranch((prev) => ({ ...prev, location: value }));
  };

  const handleSubmit = () => {
    createBranchMutation.mutate(newBranch);
  };

  if (isLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  // Mock data for demonstration
  const totalBranches = branches.length + 5;
  const activeBranches = Math.floor(totalBranches * 0.8);
  const mockBranches = [
    ...branches,
    ...Array(5)
      .fill(null)
      .map((_, i) => ({
        id: `mock-${i}`,
        name: `Branch ${i + 1}`,
        windows: 3 + i,
        location: `Location ${i + 1}`,
        servicePerHour: 20 + i * 2,
        description: `Description for Branch ${i + 1}`,
        organization_id: `org-${Math.ceil((i + 1) / 2)}`,
      })),
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
        <p className="text-gray-500">Manage all branches in the system</p>
      </div>

      {/* Stat Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Branches"
          value={totalBranches}
          icon={Building}
          className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
        />
        <StatCard
          title="Active Branches"
          value={activeBranches}
          icon={Building}
          className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
        />
        <div></div>
        <div className="flex items-center justify-center">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Branch
          </Button>
        </div>
      </div>

      {/* Branches Table */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Branches</CardTitle>
            <CardDescription>
              A list of all branches in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(branchesData ?? []).map((branch: Branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium">{branch?.name}</TableCell>
                    <TableCell>{branch?.location?.address}</TableCell>
                    <TableCell>{branch?.organization?.name}</TableCell>
                    <TableCell>{branch?.updated_at}</TableCell>
                    <TableCell className="truncate max-w-xs">
                      {branch?.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Branch Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new branch
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Branch Name</Label>
              <Input
                id="name"
                name="name"
                value={newBranch.name}
                onChange={handleInputChange}
                placeholder="Enter branch name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="windows">Number of Windows</Label>
              <Input
                id="windows"
                name="windows"
                type="number"
                min="1"
                value={newBranch.windows}
                onChange={handleNumberInputChange}
                placeholder="Enter number of windows"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={newBranch.location}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location1">Location 1</SelectItem>
                  <SelectItem value="location2">Location 2</SelectItem>
                  <SelectItem value="location3">Location 3</SelectItem>
                  <SelectItem value="location4">Location 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="servicePerHour">Branch Service Per Hour</Label>
              <Input
                id="servicePerHour"
                name="servicePerHour"
                type="number"
                min="0"
                value={newBranch.servicePerHour}
                onChange={handleNumberInputChange}
                placeholder="Enter service per hour"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newBranch.description}
                onChange={handleInputChange}
                placeholder="Enter branch description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={createBranchMutation.isPending}
            >
              {createBranchMutation.isPending ? "Adding..." : "Add Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
