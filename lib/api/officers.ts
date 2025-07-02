import apiClient from "../api-client";

export interface Officer {
  id: string;
  name: string;
}

export const fetchOfficers = async (): Promise<Officer[]> => {
  try {
    const response = await apiClient("/v1/users/branch-officers", {
      method: "GET",
    });

    console.log("officer response", response);
    const officers = response?.map((officer: any) => ({
      id: officer.user_id,
      name: `${officer.firstname} ${officer.lastname}`,
    }));
    return officers;
  } catch (error) {
    console.error("Error fetching officers:", error);
    return [];
  }
};
