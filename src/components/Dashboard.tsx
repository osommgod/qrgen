import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { User, PlanType } from "../App";
import {
  TrendingUp,
  Calendar,
  Award,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";

interface DashboardProps {
  user: User;
  setUser: (user: User) => void;
  onUpgrade: () => void;
}

interface PlanLimits {
  conversions: number;
  name: string;
  price: string;
}

const planLimits: Record<PlanType, PlanLimits> = {
  free: { conversions: 10, name: "Free", price: "$0" },
  starter: { conversions: 100, name: "Starter", price: "$9" },
  professional: { conversions: 500, name: "Professional", price: "$29" },
  business: { conversions: 2000, name: "Business", price: "$79" },
  enterprise: { conversions: 999999, name: "Enterprise", price: "Custom" },
};

export function Dashboard({ user, setUser, onUpgrade }: DashboardProps) {
  const currentPlan = planLimits[user.plan];
  const usagePercentage = (user.conversionsUsed / currentPlan.conversions) * 100;
  const remainingConversions = currentPlan.conversions - user.conversionsUsed;
  const daysUntilReset = 23; // Mock data

  const getUsageColor = () => {
    if (usagePercentage >= 90) return "text-red-600";
    if (usagePercentage >= 75) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (usagePercentage >= 90) return "bg-red-500";
    if (usagePercentage >= 75) return "bg-orange-500";
    return "bg-indigo-600";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Welcome back, {user.name}
          </p>
        </div>
        <Badge variant="secondary" className="text-lg py-2 px-4 capitalize">
          {currentPlan.name} Plan
        </Badge>
      </div>

      {/* Usage Warning */}
      {usagePercentage >= 75 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-900">
                {usagePercentage >= 90 ? "Almost at your limit!" : "Approaching your limit"}
              </p>
              <p className="text-sm text-orange-700 mt-1">
                You've used {usagePercentage.toFixed(0)}% of your monthly conversions.
                Consider upgrading to avoid interruptions.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Active
            </Badge>
          </div>
          <p className="text-gray-600 mb-1">Conversions Used</p>
          <p className={`text-gray-900 ${getUsageColor()}`}>
            {user.conversionsUsed.toLocaleString()} / {currentPlan.conversions.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Resets In</p>
          <p className="text-gray-900">{daysUntilReset} days</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Current Plan</p>
          <p className="text-gray-900">{currentPlan.price}/month</p>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900">Monthly Usage</h3>
              <p className="text-sm text-gray-600 mt-1">
                Track your QR code conversion usage for this billing period
              </p>
            </div>
            <div className="text-right">
              <p className={`${getUsageColor()}`}>
                {usagePercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">
                {remainingConversions.toLocaleString()} remaining
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Progress
              value={usagePercentage}
              className="h-3"
              style={{
                // @ts-ignore
                '--progress-background': getProgressColor().replace('bg-', '')
              }}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{(currentPlan.conversions / 2).toLocaleString()}</span>
              <span>{currentPlan.conversions.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Usage Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">This Week</span>
              <span className="text-gray-900">47 conversions</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Last Week</span>
              <span className="text-gray-900">62 conversions</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Average Daily</span>
              <span className="text-gray-900">12 conversions</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Projected Monthly</span>
              <span className="text-gray-900">360 conversions</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Plan Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Plan Name</span>
              <span className="text-gray-900 capitalize">{currentPlan.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Monthly Price</span>
              <span className="text-gray-900">{currentPlan.price}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Conversion Limit</span>
              <span className="text-gray-900">{currentPlan.conversions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next Billing Date</span>
              <span className="text-gray-900">Dec 16, 2025</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 mb-1">Need more conversions?</h3>
            <p className="text-sm text-gray-600">
              Upgrade your plan to unlock higher limits and premium features
            </p>
          </div>
          <Button className="gap-2 cursor-pointer" onClick={onUpgrade}>
            Upgrade Plan
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
