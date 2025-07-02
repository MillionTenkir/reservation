"use client";

import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import { SuperAdminDashboard } from "@/components/dashboard/superadmin-dashboard";
import { OrganizationManagerDashboard } from "@/components/dashboard/organization-manager-dashboard";
import { BranchManagerDashboard } from "@/components/dashboard/branch-manager-dashboard";
import { FieldAgentDashboard } from "@/components/dashboard/field-agent-dashboard";
import { RestaurantOfficerDashboard } from "@/components/dashboard/restaurant-officer-dashboard";
import { AdministratorDashboard } from "@/components/dashboard/administrator-dashboard";
import { TvAccessDashboard } from "@/components/dashboard/tv-access-dashboard";

// interface User {
//   id: string;
//   firstname: string;
//   lastname: string;
//   role: string;
//   token: string;
// }

export default function DashboardPage() {
  const { adminUser } = useAuth();

  // Render different dashboard components based on user role
  const renderDashboard = () => {
    switch (adminUser?.role) {
      case "cb57b04b-3418-42b9-83e9-d770aa54875a":
        return <SuperAdminDashboard />;
      case "b7dffb6d-8c49-4705-ae2b-ebd70555cac7":
        return <OrganizationManagerDashboard />;
      case "01bf91c3-abb9-4c5c-8b84-364dd28e8688":
        return <BranchManagerDashboard />;
      case "f90db2ec-cfa3-45ed-8ee0-4321f061a7bc":
        return <FieldAgentDashboard />;
      case "ff59819f-102b-4fb9-9399-e3e44ed7386e":
        return <RestaurantOfficerDashboard />;
      case "4f0b86ba-9c17-4543-8542-1041da444fa3":
        return <AdministratorDashboard />;
      case "94e2be4f-184f-4ecb-a5e3-087e8245d8cc":
        return <TvAccessDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 mb-6"
      >
        {/* <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1> */}
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium">{adminUser?.firstname}</span>.
          {/* You are logged in as{" "}
          <span className="font-medium">{roleDisplayName}</span>. */}
        </p>
      </motion.div>

      {renderDashboard()}
    </div>
  );
}
