import { NextResponse } from "next/server"

export async function GET() {
  // In a real application, you would fetch this data from your database
  const categories = [
    { id: "1", name: "Healthcare", icon: "stethoscope" },
    { id: "2", name: "Beauty", icon: "scissors" },
    { id: "3", name: "Restaurants", icon: "utensils" },
    { id: "4", name: "Fitness", icon: "dumbbell" },
    { id: "5", name: "Government", icon: "landmark" },
    { id: "6", name: "Banking", icon: "building-columns" },
  ]

  return NextResponse.json(categories)
}
