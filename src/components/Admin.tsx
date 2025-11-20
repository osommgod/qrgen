import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Edit,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import { User, PlanType } from "../App";
import { supabase } from "../lib/supabaseClient";

interface AdminUser extends User {
  id: string;
  joinDate: string;
  lastActive: string;
  status: "active" | "suspended" | "inactive";
}

interface AdminProps {
  currentUser: User;
}

const planLimits: Record<PlanType, number> = {
  free: 10,
  starter: 100,
  professional: 500,
  business: 2000,
  enterprise: 999999,
};

export function Admin({ currentUser }: AdminProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users from Supabase
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("[Admin] Fetching users from database...");

      const { data, error: fetchError } = await supabase
        .from("users_custom")
        .select("id, name, email, plan, conversions_used, role, created_at")
        .order("created_at", { ascending: false });

      console.log("[Admin] Supabase response:", { data, error: fetchError });

      if (fetchError) throw fetchError;

      // Transform database rows to AdminUser format
      const transformedUsers: AdminUser[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name || row.email || "Unknown",
        email: row.email || "",
        plan: (row.plan as PlanType) || "free",
        conversionsUsed: row.conversions_used || 0,
        isAdmin: row.role === "admin",
        joinDate: new Date(row.created_at).toLocaleDateString(),
        lastActive: formatRelativeTime(new Date(row.created_at)),
        status: "active",
      }));

      console.log("[Admin] Transformed users:", transformedUsers);
      setUsers(transformedUsers);
    } catch (err) {
      console.error("[Admin] Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const filteredUsers = users.filter((user: AdminUser) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateUserPlan = async (userId: string, newPlan: PlanType) => {
    try {
      const { error } = await supabase
        .from("users_custom")
        .update({ plan: newPlan })
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.map((user: AdminUser) =>
        user.id === userId ? { ...user, plan: newPlan } : user
      ));
    } catch (err) {
      console.error("Error updating user plan:", err);
      alert("Failed to update user plan. Please try again.");
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: "active" | "suspended" | "inactive") => {
    try {
      setUsers(users.map((user: AdminUser) =>
        user.id === userId ? { ...user, status } : user
      ));
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status. Please try again.");
    }
  };

  const getPlanBadgeColor = (plan: PlanType) => {
    switch (plan) {
      case "free": return "bg-gray-100 text-gray-800";
      case "starter": return "bg-blue-100 text-blue-800";
      case "professional": return "bg-purple-100 text-purple-800";
      case "business": return "bg-orange-100 text-orange-800";
      case "enterprise": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUsagePercentage = (used: number, plan: PlanType) => {
    const limit = planLimits[plan] || 10;
    return Math.min((used / limit) * 100, 100);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8 max-w-md">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchUsers}>Try Again</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl">👑</div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          </div>
          <p className="text-gray-600">Manage users, plans, and system settings</p>
        </div>
        <Badge variant="secondary" className="text-sm py-2 px-4">
          Administrator
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <Card className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-green-600 mt-2">
            {users.filter((u: AdminUser) => u.status === 'active').length} active
          </p>
        </Card>

        {/* Total Conversions */}
        <Card className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Conversions</p>
          <p className="text-3xl font-bold text-gray-900">
            {users.reduce((sum: number, u: AdminUser) => sum + u.conversionsUsed, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </Card>

        {/* Monthly Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            ${users.reduce((sum: number, u: AdminUser) => {
              const prices: Record<PlanType, number> = { free: 0, starter: 9, professional: 29, business: 79, enterprise: 299 };
              return sum + (prices[u.plan] || 0);
            }, 0)}
          </p>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </Card>

        {/* Active Plans */}
        <Card className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Plans</p>
          <p className="text-3xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-500 mt-2">Out of 5</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <button className="pb-3 px-1 border-b-2 border-gray-900 text-sm font-medium text-gray-900">
              Users
            </button>
            <button className="pb-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Plans
            </button>
            <button className="pb-3 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700">
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user: AdminUser) => {
                const usagePercent = getUsagePercentage(user.conversionsUsed, user.plan);
                const limit = planLimits[user.plan] || 10;

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getPlanBadgeColor(user.plan)} capitalize`}>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-[120px]">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>{user.conversionsUsed} / {limit}</span>
                            <span>{Math.round(usagePercent)}%</span>
                          </div>
                          <Progress value={usagePercent} className="h-2" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' :
                          user.status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
                          }`} />
                        <span className="text-sm text-gray-700 capitalize">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.lastActive}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <TrendingUp className="w-4 h-4" />
                        </Button>
                        <Select
                          value={user.status}
                          onValueChange={(value: any) => handleUpdateUserStatus(user.id, value)}
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}
    </div>
  );
}
