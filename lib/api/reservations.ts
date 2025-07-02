// import { Reservation } from "@/lib/types";
import axios from "axios";
import apiClient from "../api-client";

export interface Reservation {
  id: string;
  fullName: string;
  date: string;
  time: string;
  service: string;
  cnr: string; // Unique alphabet identifier
  fullData: any;
}
export interface Reservationdummy {
  id: string;
  fullName: string;
  date: string;
  time: string;
  service: string;
  cnr: string; // Unique alphabet identifier
  fullData: any;
}

export interface DetailedReservation extends Reservation {
  time_specific: boolean;
  appointmentTime: string;
  document_count: number;
  checkedIn: boolean;
  fullData: any;
  appointment_through: string;
}

export async function getReservations(): Promise<Reservation[]> {
  try {
    const response = await fetch("/api/reservations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reservations");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
}

export async function fetchReservations(
  search = "",
  date = ""
): Promise<DetailedReservation[]> {
  try {
    const response = await apiClient(
      `/v1/appointments/branch_filter/searchReservation?page=1&search=${search}&date=${date}`,
      {
        method: "GET",
      }
    );


    // Ensure we have the expected data structure
    if (!response?.data?.data?.data) {
      console.warn("Unexpected response structure:", response);
      return [];
    }

    const reservationData = response.data.data.data.map((appointment: any) => ({
      id: appointment.id,
      fullName: `${appointment.user.firstname} ${appointment.user.lastname}`,
      cnr: appointment.cnr,
      time_specific: appointment.branch_service.branch?.time_specific,
      appointmentTime: appointment?.appointment_duration?.time_from || "00:00",
      document_count: appointment.document_count,
      service: appointment.branch_service?.service.name,
      date: new Date(appointment.appointment_time).toLocaleDateString(),
      checkedIn: false,
      fullData: appointment,
      appointment_through: appointment.appointment_through,
    }));

    return reservationData || [];
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
}

export async function fetchReservationsToCheckOut(
  searchQuery = ""
): Promise<any[]> {
  try {
    const response = await apiClient(
      `/v1/appointments/branch_filter_checked_in/search?page=1&search=${searchQuery}`,
      {
        method: "GET",
      }
    );
    const appointmentData = response.data.data.data?.map(
      (appointment: any) => ({
        id: appointment.id,
        name: `${appointment.user.firstname} ${appointment.user.lastname}`,
        remaining_document: appointment.remaining_counts,
        cnr: appointment.cnr,
        service: appointment.branch_service.service.name,
        date: new Date(appointment.appointment_time).toLocaleDateString(),
        checkedOut: false,
        fullData: appointment,
      })
    );

    return appointmentData || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function addToQueue(item: any) {
  try {
    const response = await apiClient("/v1/queues/add_queue", {
      method: "POST",
      body: JSON.stringify({
        appointment_id: item?.id,
        first_name: item?.user?.firstname,
        last_name: item?.user?.lastname,
        phone_number: item?.user?.mobile,
        branch_service_id: item?.branch_service?.id,
      }),
    });

    const result = response.data;
    console.log("Queue added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding to queue:", error);
    throw error;
  }
}
