import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const branchId = searchParams.get("branchId")
  const date = searchParams.get("date")

  if (!branchId || !date) {
    return NextResponse.json({ error: "Branch ID and date are required" }, { status: 400 })
  }

  // In a real application, you would fetch available times from your database
  // based on the branch and date, considering existing reservations

  // For demo purposes, we'll return different times based on the day of week
  const dayOfWeek = new Date(date).getDay()

  let availableTimeSlots: { time: string; availableSlots: number; totalSlots: number }[] = []

  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    // Mon, Wed, Fri
    availableTimeSlots = [
      { time: "09:00", availableSlots: 5, totalSlots: 8 },
      { time: "10:00", availableSlots: 3, totalSlots: 8 },
      { time: "11:00", availableSlots: 7, totalSlots: 8 },
      { time: "12:00", availableSlots: 2, totalSlots: 8 },
      { time: "13:00", availableSlots: 8, totalSlots: 8 },
      { time: "14:00", availableSlots: 4, totalSlots: 8 },
      { time: "15:00", availableSlots: 6, totalSlots: 8 },
      { time: "16:00", availableSlots: 1, totalSlots: 8 },
    ]
  } else {
    // Tue, Thu
    availableTimeSlots = [
      { time: "10:00", availableSlots: 6, totalSlots: 8 },
      { time: "11:00", availableSlots: 2, totalSlots: 8 },
      { time: "12:00", availableSlots: 0, totalSlots: 8 }, // Fully booked
      { time: "13:00", availableSlots: 3, totalSlots: 8 },
      { time: "14:00", availableSlots: 5, totalSlots: 8 },
      { time: "15:00", availableSlots: 4, totalSlots: 8 },
      { time: "16:00", availableSlots: 7, totalSlots: 8 },
      { time: "17:00", availableSlots: 8, totalSlots: 8 },
    ]
  }

  return NextResponse.json(availableTimeSlots)
}
