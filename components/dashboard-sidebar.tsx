"use client";

import type React from "react";

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  Users,
  Utensils,
  UserPlus,
  Star,
  Calendar,
  CreditCard,
  Building,
  Scan,
  Vote,
  SquareUser,
  Columns3,
  UserCheck,
  Tv,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: Array<string>;
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Self Checkin",
    href: "/dashboard/self-checkin",
    icon: Check,
    roles: ["f90db2ec-cfa3-45ed-8ee0-4321f061a7bc"],
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
      "4f0b86ba-9c17-4543-8542-1041da444fa3",
      "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
    ],
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Vote,
    roles: [
      "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
      "ff59819f-102b-4fb9-9399-e3e44ed7386e",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688"
    ],
  },
  {
    title: "Appointments",
    href: "/dashboard/reservations",
    icon: Calendar,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
      "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
      "ff59819f-102b-4fb9-9399-e3e44ed7386e",
    ],
  },

  {
    title: "Customers",
    href: "/dashboard/frequent-customers",
    icon: UserCheck,
    roles: ["b7dffb6d-8c49-4705-ae2b-ebd70555cac7","01bf91c3-abb9-4c5c-8b84-364dd28e8688"],
  },
  {
    title: "Organizations",
    href: "/dashboard/organizations",
    icon: Building2,
    roles: ["cb57b04b-3418-42b9-83e9-d770aa54875a"],
  },
  {
    title: "Branches",
    href: "/dashboard/branches",
    icon: Building,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    ],
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: Settings,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    ],
  },
  {
    title: "Agents Report",
    href: "/dashboard/agents-report",
    icon: SquareUser,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    ],
  },
  {
    title: "Reviews",
    href: "/dashboard/reviews",
    icon: Star,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    ],
  },
  // {
  //   title: "Reservation Settings",
  //   href: "/dashboard/reservation-settings",
  //   icon: Columns3,
  //   roles: [
  //     "cb57b04b-3418-42b9-83e9-d770aa54875a",
  //     "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
  //     "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
  //   ],
  // },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UserPlus,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    ],
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    ],
  },
  {
    title: "Field Agents",
    href: "/dashboard/agents",
    icon: Users,
    roles: ["cb57b04b-3418-42b9-83e9-d770aa54875a","01bf91c3-abb9-4c5c-8b84-364dd28e8688"],
  },
  {
    title: "Check Out",
    href: "/dashboard/check-out",
    icon: Scan,
    roles: [
      "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
      "ff59819f-102b-4fb9-9399-e3e44ed7386e",
    ],
  },
  // {
  //   title: "Orders",
  //   href: "/dashboard/orders",
  //   icon: ShoppingBag,
  //   roles: [
  //     "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
  //     "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
  //     "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc",
  //     "ff59819f-102b-4fb9-9399-e3e44ed7386e",
  //     "4f0b86ba-9c17-4543-8542-1041da444fa3",
  //   ],
  // },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [
      "cb57b04b-3418-42b9-83e9-d770aa54875a",
      "4f0b86ba-9c17-4543-8542-1041da444fa3",
      "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
      "01bf91c3-abb9-4c5c-8b84-364dd28e8688"
    ],
  },
  {
    title: "Tv Access",
    href: "/dashboard/tv-access",
    icon: Tv,
    roles: ["94e2be4f-184f-4ecb-a5e3-087e8245d8cc"],
  },
];

export function DashboardSidebar() {
  const { adminUser, adminLogout } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter sidebar items based on user role
  const filteredItems = sidebarItems.filter(
    (item) => adminUser && item.roles.includes(adminUser.role)
  );

  const Sidebar = (
    <div
      className={cn(
        "flex flex-col h-screen border-r",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center w-full" : "justify-start"
          )}
        >
          {isCollapsed ? (
            <div className="w-8 h-8 relative">
              <Image
                src="/cheche.png"
                alt="CHECHE Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ) : (
            <div className="w-32 h-8 relative">
              <Image
                src="/cheche.png"
                alt="CHECHE Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2 mt-5">
        <nav className="grid gap-1 px-2">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm  transition-all hover:text-[#e6007e]",
                    pathname === item.href
                      ? "bg-[#fce7f3] text-[#e6007e] font-medium shadow-sm"
                      : "text-gray-500",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <span className="text-[13px] font-semibold">
                      {item.title}
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>
      </div>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-500 hover:text-[#e6007e] text-[13px] font-semibold",
            isCollapsed && "justify-center px-0"
          )}
          onClick={adminLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
          <div className="w-64">{Sidebar}</div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:block">{Sidebar}</div>
    </>
  );
}
