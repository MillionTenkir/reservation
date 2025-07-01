import { get } from "http";
import apiClient from "../api-client";

export interface ReportData {
  status: string;
  count: string;
}

export interface ServiceReportData {
  service_name: string;
  service_count: string;
}

export interface BookedThroughReportData {
  appointment_through: string;
  appointment_count: string;
}

export interface DailyAppointmentReportData {
  appointment_date: string;
  appointment_count: string;
  confirmed_count: string;
  checkedin_count: string;
  checkedout_count: string;
  expired_count: string;
  incomplted_count: string;
  rejected_count: string;
  cancelled_count: string;
  booked_count: string;
}

export const fetchStatCardReportData = async (): Promise<ReportData[]> => {
  try {
    const response = await apiClient("/v1/appointments/countsByOrganization", {
      method: "GET",
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching report data:", error);
    return [];
  }
};

export const fetchServiceReportData = async (): Promise<
  ServiceReportData[]
> => {
  try {
    const response = await apiClient(
      "/v1/appointments/serviceCountsByOrganization",
      {
        method: "GET",
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching reservation status report data:", error);
    return [];
  }
};

export const fetchBookedThroughReportData = async (): Promise<
  BookedThroughReportData[]
> => {
  try {
    const response = await apiClient(
      "/v1/appointments/countsByAppointmentThrough",
      {
        method: "GET",
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booked through report data:", error);
    return [];
  }
};

export const fetchDailyAppointmentReportData = async (): Promise<
  DailyAppointmentReportData[]
> => {
  try {
    const response = await apiClient(
      "/v1/appointments/dailyAppointmentsByOrganization",
      {
        method: "GET",
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily appointment report data:", error);
    return [];
  }
};
