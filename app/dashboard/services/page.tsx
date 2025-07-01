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
import { Plus, Scissors, Clock, Edit } from "lucide-react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  type CreateServicePayload,
  type Service,
  getServicesByOrganization,
} from "@/lib/api/service";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { updateService } from "@/lib/api/service";

// Extend the Service type with additional properties returned from API
interface ServiceResponse extends Service {
  slot_weight?: number;
  active?: boolean;
}

export default function ServicesPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688"
  ]);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const organization_id = user?.organization_id || "";
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);
  const [newService, setNewService] = useState<CreateServicePayload>({
    name: "",
    description: "",
    organization_id: organization_id,
  });
  // const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const { data: serviceData, isLoading: serviceDataLoading } = useQuery({
    queryKey: ["services", organization_id, search],
    queryFn: () => getServicesByOrganization(organization_id, search),
    enabled: Boolean(organization_id),
  });
  
  const createServiceMutation = useMutation({
    mutationFn: (serviceData: CreateServicePayload) =>
      createService(serviceData),
    onSuccess: (data) => {
      setIsDialogOpen(false);
      setNewService({
        name: "",
        description: "",
        organization_id: "",
      });
      toast.success("Service created successfully");
      // Invalidate and refetch services query
      queryClient.invalidateQueries({ queryKey: ["services", organization_id] });
    },
    onError: (error) => {
      console.error("Error creating service:", error);
      toast.error("Failed to create service");
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: (serviceData: Service) => updateService(serviceData),
    onSuccess: (data) => {
      toast.success("Service updated successfully");
      queryClient.invalidateQueries({ queryKey: ["services",  organization_id ] });
      setIsEditDialogOpen(false);
      setEditingService(null);
      // Invalidate and refetch services query
    },
    onError: (error) => {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleCategoryChange = (value: string) => {
    setNewService((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = () => {
    console.log("the new service: ", newService)
    createServiceMutation.mutate(newService);
  };

  const handleEditClick = (service: ServiceResponse) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (editingService) {
      console.log("Updated service:", editingService);
      updateServiceMutation.mutate(editingService)
    }
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditingService((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleStatusChange = (value: string) => {
    setEditingService((prev) => 
      prev ? { ...prev, active: value === "true" } : null
    );
  };

  if (isLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }


  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="text-gray-500">Manage all services in the system</p>
      </div>

      {/* Stat Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {serviceDataLoading ? (
          <>
            <Card className="bg-gradient-to-r from-[#076691] to-[#e2b00c]">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 bg-white/30 mb-2" />
                <Skeleton className="h-8 w-16 bg-white/30" />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-[#076691] to-[#1fbc63]">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 bg-white/30 mb-2" />
                <Skeleton className="h-8 w-16 bg-white/30" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <StatCard
              title="Total Services"
              value={serviceData?.total ?? 0}
              icon={Scissors}
              className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
            />
            <StatCard
              title="Active Services"
              value={serviceData?.total ?? 0}
              icon={Clock}
              className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
            />
          </>
        )}
        <div></div>
        <div className="flex items-center justify-center">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Service
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              A list of all services in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Slot Weight</TableHead>
                  <TableHead>Cost ($)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceDataLoading ? (
                  // Loading skeleton rows
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : serviceData?.services?.length ? (
                  serviceData?.services.map((service: ServiceResponse) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {service?.name}
                      </TableCell>
                      <TableCell>{service?.category}</TableCell>
                      <TableCell>{service?.slot_weight ?? 'N/A'}</TableCell>
                      <TableCell>${service?.cost}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            service?.active === true 
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service?.active === true  ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No services found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new service
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                value={newService.name}
                onChange={handleInputChange}
                placeholder="Enter service name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Service Description</Label>
              <Input
                id="description"
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                placeholder="Enter service description"
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
              disabled={createServiceMutation.isPending}
            >
              {createServiceMutation.isPending ? "Adding..." : "Add Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={editingService?.name || ""}
                onChange={handleEditInputChange}
                placeholder="Enter service name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editingService?.active === true ? "true" : "false"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleEditSubmit}
              disabled={updateServiceMutation.isPending}
            >
              {updateServiceMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
