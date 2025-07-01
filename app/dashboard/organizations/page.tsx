"use client";

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrganizationsPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
  ]);

  if (isLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
        <p className="text-gray-500">Manage all organizations in the system</p>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>
              A list of all organizations in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-[#fce7f3] flex items-center justify-center">
                    <span className="font-bold text-[#e6007e]">O{i}</span>
                  </div>
                  <div>
                    <p className="font-medium">Organization {i}</p>
                    <p className="text-sm text-gray-500">
                      Description of organization {i}
                    </p>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {i * 5} branches
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
