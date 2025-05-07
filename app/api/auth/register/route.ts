import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phoneNumber, otp } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !phoneNumber || !otp) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Verify the OTP one more time
    // 2. Create a new user in your database
    // 3. Generate a JWT token for authentication

    // For demo purposes, we'll simulate success
    const token = `demo-token-${Date.now()}`

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      token,
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
