import apiClient from "../api-client";

export interface Organization {
  id: string;
  name: string;
  // Add more fields as needed
}

export interface OrganizationResponse {
  data: Organization[];
  // Add other response fields if needed
}

export async function fetchAllOrganizations(): Promise<Organization[]> {
  const response = await apiClient("/v1/organizations/all", {
    method: "GET",
  });
  return response.data;
}
