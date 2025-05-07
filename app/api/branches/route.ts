import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get("organizationId")

  if (!organizationId) {
    return NextResponse.json({ error: "Organization ID is required" }, { status: 400 })
  }

  // In a real application, you would fetch this data from your database
  // filtered by the organizationId
  const branches = [
    {
      id: "1",
      name: "Downtown Branch",
      address: "123 Main St, Downtown",
      openingHours: "9:00 AM - 5:00 PM",
    },
    {
      id: "2",
      name: "Uptown Branch",
      address: "456 High St, Uptown",
      openingHours: "8:00 AM - 6:00 PM",
    },
    {
      id: "3",
      name: "Westside Branch",
      address: "789 West Ave, Westside",
      openingHours: "10:00 AM - 7:00 PM",
    },
  ]

  return NextResponse.json(branches)
}
