import apiClient from "../api-client";

export interface Branch {
  id: string;
  name: string;
  organization_id: string;
  organization?: {
    name: string;
    id: string;
  };
  windows?: number;
  location?: {
    address: string;
  };
  servicePerHour?: number;
  description?: string;
  updated_at?: string;
}

export type BranchResponse = Branch[];

export interface CreateBranchPayload {
  name: string;
  windows: number;
  location: string;
  servicePerHour: number;
  description: string;
}

export async function fetchAllBranches(): Promise<BranchResponse> {
  const response = await apiClient("/v1/branches", {
    method: "GET",
  });
  return response.data;
}

export async function createBranch(
  payload: CreateBranchPayload
): Promise<Branch> {
  const response = await apiClient("/v1/branches", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function fetchMyBranches(): Promise<BranchResponse>{
  const response = await apiClient("/v1/branches/by-organization-fetch?page=1&limit=10&search=",{
    method: "GET"
  })
  return response.data
}