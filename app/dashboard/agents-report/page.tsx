"use client";

import { useRoleGuard, RoleGuardLoading } from "@/hooks/use-role-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle, Users, Building, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AgentsPage() {
  const { isAuthorized, isLoading } = useRoleGuard([
    "cb57b04b-3418-42b9-83e9-d770aa54875a",
    "b7dffb6d-8c49-4705-ae2b-ebd70555cac7",
    "01bf91c3-abb9-4c5c-8b84-364dd28e8688",
    "4f0b86ba-9c17-4543-8542-1041da444fa3",
  ]);

  if (isLoading) {
    return <RoleGuardLoading />;
  }

  if (!isAuthorized) {
    return null;
  }

  // Mock data for demonstration
  const totalAgents = 15;
  const activeAgents = 8;
  const coveredBranches = 5;

  // Generate mock agent data
  const mockAgents = Array(15)
    .fill(null)
    .map((_, i) => ({
      id: `agent-${i + 1}`,
      name: `Agent ${i + 1}`,
      branch: `Branch ${Math.ceil((i + 1) / 3)}`,
      status: (i + 1) % 3 === 0 ? "inactive" : "active",
      restaurants: (i + 1) * 5,
      efficiency: Math.floor(70 + Math.random() * 30), // Random efficiency between 70-100%
    }));

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Field Agents</h1>
        <p className="text-gray-500">Manage all field agents in the system</p>
      </div>

      {/* Stat Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Agents"
          value={totalAgents}
          icon={Users}
          className="bg-gradient-to-r from-[#076691] to-[#e2b00c] text-white"
        />
        <StatCard
          title="Active Agents"
          value={activeAgents}
          icon={CheckCircle}
          className="bg-gradient-to-r from-[#076691] to-[#1fbc63] text-white"
        />
        <StatCard
          title="Covered Branches"
          value={coveredBranches}
          icon={Building}
          className="bg-gradient-to-r from-[#076691] to-[#b1efcd] text-white"
        />
      </div>

      {/* Agents Table */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Field Agents</CardTitle>
            <CardDescription>
              A list of all field agents in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Restaurants</TableHead>
                  <TableHead>Efficiency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#fce7f3] flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-[#e6007e]" />
                        </div>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{agent.branch}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          agent.status === "active" ? "default" : "outline"
                        }
                        className={
                          agent.status === "active" ? "bg-[#e6007e]" : ""
                        }
                      >
                        {agent.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.restaurants}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#e6007e] h-2.5 rounded-full"
                            style={{ width: `${agent.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{agent.efficiency}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
