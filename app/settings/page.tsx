"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import { useAuth } from "@/lib/auth-context";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function SettingsPage() {
  // const [user, setUser] = useState<UserProfile | null>(null)
  const [userEdit, setUserEdit] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { clientUser, clientToken } = useAuth();
  useEffect(() => {
    // Check if user is logged in
    // const token = document.cookie.includes("auth-token");
    if (!clientToken) {
      router.push("/auth/login");
      return;
    }

    // Simulate fetching user data
    //   setTimeout(() => {
    //     setUser({
    //       firstName: "John",
    //       lastName: "Doe",
    //       email: "john.doe@example.com",
    //       phone: "+1 (555) 123-4567",
    //     })
    //     setIsLoading(false)
    //   }, 1000)
    setIsLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (userEdit) {
      setUserEdit({ ...userEdit, [name]: value });
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }, 1500);
  };

  const handleChangePassword = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }, 1500);
  };

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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={clientUser?.data?.firstname || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={clientUser?.data?.lastname || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={clientUser?.data?.email || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={clientUser?.data?.mobile || ""}
                      onChange={handleChange}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Phone number cannot be changed. Contact support for
                      assistance.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-[#E6007E] hover:bg-[#C4006C]"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-[#E6007E] hover:bg-[#C4006C]"
                    onClick={handleChangePassword}
                    disabled={isSaving}
                  >
                    {isSaving ? "Updating..." : "Change Password"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your reservations
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor="email-notifications"
                          className="sr-only"
                        >
                          Email Notifications
                        </Label>
                        <input
                          type="checkbox"
                          id="email-notifications"
                          className="h-4 w-4 rounded border-gray-300 text-[#E6007E] focus:ring-[#E6007E]"
                          defaultChecked
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive text messages about your reservations
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="sms-notifications" className="sr-only">
                          SMS Notifications
                        </Label>
                        <input
                          type="checkbox"
                          id="sms-notifications"
                          className="h-4 w-4 rounded border-gray-300 text-[#E6007E] focus:ring-[#E6007E]"
                          defaultChecked
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Reminder Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders before your appointments
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor="reminder-notifications"
                          className="sr-only"
                        >
                          Reminder Notifications
                        </Label>
                        <input
                          type="checkbox"
                          id="reminder-notifications"
                          className="h-4 w-4 rounded border-gray-300 text-[#E6007E] focus:ring-[#E6007E]"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-[#E6007E] hover:bg-[#C4006C]">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
