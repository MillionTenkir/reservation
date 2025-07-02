import apiClient from "../api-client";

interface FetchUsersParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
}

export interface User {
    id: string;
    firstname: String
    lastname: String
    mobile: String
    role_name: String
    branch_name: String
    active: boolean
}

interface UserResponse {
    users: User[];
    total_employees: number;
}

/**
 * Fetches users with pagination and search capabilities
 */
export const fetchUsers = async({
  page = 1,
  limit = 10,
  searchQuery = "",
}: FetchUsersParams = {}): Promise<UserResponse> =>{
  let url = searchQuery ? `/v1/users?searchQuery=${encodeURIComponent(searchQuery)}` : `/v1/users?page=${page}&limit=${limit}`
    const response = apiClient(url,{
        method: "GET"
    })
    console.log("User details: ",response)
    return response;

}
