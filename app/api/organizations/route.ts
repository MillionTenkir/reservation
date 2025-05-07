import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get("categoryId")

  if (!categoryId) {
    return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
  }

  // In a real application, you would fetch this data from your database
  // filtered by the categoryId
  const organizations = [
    {
      id: "1",
      name: "Organization 1",
      logo: "/placeholder.svg?height=40&width=40",
      description: "Leading provider in this category",
    },
    {
      id: "2",
      name: "Organization 2",
      logo: "/placeholder.svg?height=40&width=40",
      description: "Premium services with great reviews",
    },
    {
      id: "3",
      name: "Organization 3",
      logo: "/placeholder.svg?height=40&width=40",
      description: "Affordable options with quality service",
    },
  ]

  return NextResponse.json(organizations)
}
