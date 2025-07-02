import apiClient from "../api-client";

export interface Service {
  id: string;
  name: string;
  organization_id: string;
  cost: number;
  duration: number;
  description: string;
  category: string;
  status: boolean;
}

export interface ServiceResponse {
  services: Service[];
  total: number;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  organization_id: string;
}

export const createService = async (service: CreateServicePayload): Promise<Service> => {
  const response = await apiClient(`/v1/services`, {
    method: "POST",
    body: JSON.stringify(service),
  });
  return response.data;
};

export const fetchServicesByBranch = async (
  branch_id: string
): Promise<{ id: string; name: string }[]> => {
  try {
    const response = await apiClient(
      `/v1/branch_services/findServicesByBranchGuest?branch_id=${branch_id}`,
      {
        method: "GET",
      }
    );
    console.log("service response", response);
    // const result = await response.json();

    if (response.services && Array.isArray(response.services)) {
      return response.services.map((service: { id: string; name: string }) => ({
        id: service.id,
        name: service.name,
      }));
    } else {
      console.error("Unexpected services data format:", response);
      return [];
    }
  } catch (error) {
    console.error(
      "Error fetching services:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
};

export const getServicesByOrganization = async (organization_id: string, search: string): Promise<ServiceResponse> => {
  const response = await apiClient(`/v1/services/by-organization?organization_id=${organization_id}&search=${search}`, {
    method: "GET",
  });
  return response;
};

export const updateService = async (updatedService: Service): Promise<Service> => {
  const response = await apiClient(`/v1/services/${updatedService.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedService),
  });
  return response.data;
};
