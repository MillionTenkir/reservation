"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isTokenLoading } = useAuth();
  // console.log("The user is: ", user);
  // Add shadow to header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render header if no user is logged in
  if (!isTokenLoading && !user) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />

        <div className="flex items-center space-x-4">
          {/* <Link
            href="/"
            className={`hidden sm:flex items-center ${
              pathname === "/" ? "text-[#E6007E]" : ""
            }`}
          >
            <Calendar className="h-4 w-4 mr-1" />
            <span>Reservations</span>
          </Link> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 border border-muted">
                  {/* <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={user.data.firstname}
                  /> */}
                  <AvatarFallback className="bg-[#E6007E]/10 text-[#E6007E]">
                    {user?.data.firstname[0]}
                    {user?.data.lastname[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.data.firstname} {user?.data.lastname}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.data.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
