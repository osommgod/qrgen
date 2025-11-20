import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { QrCode, Mail, Lock, User as UserIcon, ArrowRight, Check, Loader2 } from "lucide-react";
import { PlanType } from "../App";
import { supabase } from "../lib/supabaseClient";

interface SignupProps {
  onSwitchToLogin: () => void;
}

interface PlanOption {
  id: PlanType;
  name: string;
  price: string;
  conversions: string;
}

const planOptions: PlanOption[] = [
  { id: "free", name: "Free", price: "$0/mo", conversions: "10 conversions" },
  { id: "starter", name: "Starter", price: "$9/mo", conversions: "100 conversions" },
  { id: "professional", name: "Professional", price: "$29/mo", conversions: "500 conversions" },
  { id: "business", name: "Business", price: "$79/mo", conversions: "2,000 conversions" },
];

export function Signup({ onSwitchToLogin }: SignupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            plan: selectedPlan,
          },
        },
      });

      setLoading(false);

      if (error) {
        setErrors({ ...errors, email: error.message });
      } else {
        // Success!
        // If email confirmation is required, session might be null.
        // We should probably show a message to the user.
        alert("Account created! Please check your email to confirm your account.");
        onSwitchToLogin();
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <QrCode className="w-10 h-10 text-indigo-600" />
            <span className="text-indigo-600">QR Generator Pro</span>
          </div>
          <h2 className="text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Start generating QR codes in seconds</p>
        </div>

        {/* Signup Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Plan Info - Free plan auto-selected */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-900">Starting with Free Plan</p>
                  <p className="text-xs text-indigo-600 mt-1">10 conversions/month • Upgrade anytime after signup</p>
                </div>
                <Check className="w-5 h-5 text-indigo-600" />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded"
                required
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>


        </Card>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
