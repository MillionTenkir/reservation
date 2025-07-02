"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarClock, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/auth-context"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface Reservation {
  id: string
  date: string
  time: string
  organization: string
  branch: string
  status: "upcoming" | "completed" | "cancelled"
}

export default function ProfilePage() {
  // const [user, setUser] = useState<UserProfile | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { clientUser, clientToken, isClientTokenLoading } = useAuth()
  useEffect(() => {
    // Check if user is logged in
    // const token = document.cookie.includes("auth-token")
    if (!clientToken) {
      console.log("No token found:", !clientToken)
      router.push("/auth/login")
      return
    }

    // Simulate fetching user data
    setTimeout(() => {
      // setUser({
      //   firstName: "John",
      //   lastName: "Doe",
      //   email: "john.doe@example.com",
      //   phone: "+1 (555) 123-4567",
      // })

      setReservations([
        {
          id: "1",
          date: "2023-06-15",
          time: "10:00 AM",
          organization: "Healthcare Center",
          branch: "Downtown Branch",
          status: "upcoming",
        },
        {
          id: "2",
          date: "2023-05-20",
          time: "2:30 PM",
          organization: "Beauty Salon",
          branch: "Uptown Branch",
          status: "completed",
        },
        {
          id: "3",
          date: "2023-04-10",
          time: "11:00 AM",
          organization: "Government Office",
          branch: "City Hall",
          status: "cancelled",
        },
      ])

      setIsLoading(false)
    }, 1000)
  }, [router, clientToken, isClientTokenLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E6007E] to-[#E6007E]/70 animate-spin blur-sm"></div>
          <div className="absolute inset-1 rounded-full bg-white"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#E6007E] to-[#E6007E]/70 animate-[spin_1.5s_linear_infinite]"></div>
          <div className="absolute inset-3 rounded-full bg-white"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src="/placeholder.svg?height=96&width=96"
                      alt={`${clientUser?.data.firstname} ${clientUser?.data.lastname}`}
                    />
                    <AvatarFallback className="text-2xl bg-[#E6007E]/10 text-[#E6007E]">
                      {clientUser?.data.firstname?.[0]}
                      {clientUser?.data.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">
                      {clientUser?.data.firstname} {clientUser?.data.lastname}
                    </h2>
                    <p className="text-sm text-muted-foreground">Member since June 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-[#E6007E]" />
                  <span>{clientUser?.data.mobile}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-[#E6007E]" />
                  <span>{clientUser?.data.email}</span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-[#E6007E] hover:bg-[#C4006C]" asChild>
              <Link href="/settings">Edit Profile</Link>
            </Button>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Reservations</CardTitle>
                <CardDescription>View and manage your reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming">
                  <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="space-y-4">
                    {reservations
                      .filter((r) => r.status === "upcoming")
                      .map((reservation) => (
                        <Card key={reservation.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{reservation.organization}</h3>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {reservation.branch}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <CalendarClock className="h-3.5 w-3.5 mr-1" />
                                  {reservation.date} at {reservation.time}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {reservations.filter((r) => r.status === "upcoming").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">You have no upcoming reservations.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-4">
                    {reservations
                      .filter((r) => r.status === "completed")
                      .map((reservation) => (
                        <Card key={reservation.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{reservation.organization}</h3>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {reservation.branch}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <CalendarClock className="h-3.5 w-3.5 mr-1" />
                                  {reservation.date} at {reservation.time}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Book Again
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {reservations.filter((r) => r.status === "completed").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">You have no past reservations.</div>
                    )}
                  </TabsContent>

                  <TabsContent value="cancelled" className="space-y-4">
                    {reservations
                      .filter((r) => r.status === "cancelled")
                      .map((reservation) => (
                        <Card key={reservation.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{reservation.organization}</h3>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  {reservation.branch}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <CalendarClock className="h-3.5 w-3.5 mr-1" />
                                  {reservation.date} at {reservation.time}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Book Again
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    {reservations.filter((r) => r.status === "cancelled").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">You have no cancelled reservations.</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
