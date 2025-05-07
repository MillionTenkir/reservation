import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { phoneNumber, otp } = await request.json()

    // Validate input
    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Verify the OTP against what's stored in your database
    // 2. Check if the OTP is expired
    // 3. Check if the user exists in your system

    // For demo purposes, we'll simulate a valid OTP and check if the user exists
    const isValidOtp = otp.length === 4 // In reality, check against stored OTP

    // Simulate checking if user exists (in a real app, query your database)
    const isNewUser = phoneNumber.endsWith("0") // Just for demo: numbers ending in 0 are "new users"

    if (!isValidOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Generate a JWT token for authentication (in a real app)
    const token = `demo-token-${Date.now()}`

    return NextResponse.json({
      success: true,
      isNewUser,
      token: isNewUser ? null : token,
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
