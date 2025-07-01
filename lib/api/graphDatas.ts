import apiClient from "../api-client";

export interface Reservation {
  id: string;
  name: string;
  organization_id: string;
  branch_id: string;
  created_at: string;
}

export interface ReservationResponse {
  data: Reservation[];
}

export interface BookedThroughChart {
  name: string;
  value: number;
}

export interface BookedThroughChartResponse {
  data: BookedThroughChart[];
}

export interface MonthlyReservations {
  name: string;
  value: number;
}

export interface MonthlyReservationsResponse {
  data: MonthlyReservations[];
}

export async function fetchAllReservations(
  startingDate?: Date,
  endingDate?: Date,
  selectedBranch?: string,
  selectedOrganization?: string
): Promise<ReservationResponse> {
  const params = new URLSearchParams();

  if (startingDate) {
    params.append("startingDate", startingDate.toISOString());
  }

  if (endingDate) {
    params.append("endingDate", endingDate.toISOString());
  }

  if (selectedBranch !== "all") {
    params.append("selectedBranch", selectedBranch || "");
  }

  if (selectedOrganization !== "all") {
    params.append("selectedOrganization", selectedOrganization || "");
  }

  const queryString = params.toString();
  const url = `/v1/appointments/countsByOrganization${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await apiClient(url, {
    method: "GET",
  });
  return response.data;
}

export async function bookedThroughChart(): Promise<BookedThroughChartResponse> {
  const response = await apiClient("/v1/reservations/booked-through-chart", {
    method: "GET",
  });
  return response.data;
}

export async function monthlyReservations(): Promise<MonthlyReservationsResponse> {
  const response = await apiClient("/v1/reservations/monthly-reservations", {
    method: "GET",
  });
  return response.data;
}
