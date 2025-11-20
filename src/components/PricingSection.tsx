import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { PlanType } from "../App";

interface PricingTier {
  name: string;
  conversions: string;
  price: string;
  pricePerConversion: string;
  features: string[];
  popular?: boolean;
  planType: PlanType;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    conversions: "Up to 100",
    price: "$9",
    pricePerConversion: "$0.09",
    planType: "starter",
    features: [
      "100 QR code conversions/month",
      "Basic QR code designs",
      "PNG download",
      "Standard support",
    ],
  },
  {
    name: "Professional",
    conversions: "Up to 500",
    price: "$29",
    pricePerConversion: "$0.058",
    planType: "professional",
    features: [
      "500 QR code conversions/month",
      "Custom QR code colors",
      "PNG & SVG download",
      "Priority support",
      "Analytics dashboard",
    ],
    popular: true,
  },
  {
    name: "Business",
    conversions: "Up to 2,000",
    price: "$79",
    pricePerConversion: "$0.039",
    planType: "business",
    features: [
      "2,000 QR code conversions/month",
      "Advanced customization",
      "All download formats",
      "24/7 dedicated support",
      "Advanced analytics",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    conversions: "Unlimited",
    price: "Custom",
    pricePerConversion: "Volume pricing",
    planType: "enterprise",
    features: [
      "Unlimited conversions",
      "White-label solution",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom features",
    ],
  },
];

interface PricingSectionProps {
  currentPlan?: PlanType;
  onPlanSelect?: (plan: PlanType) => void;
}

// Plan hierarchy for comparison
const planHierarchy: Record<PlanType, number> = {
  free: 0,
  starter: 1,
  professional: 2,
  business: 3,
  enterprise: 4,
};

export function PricingSection({ currentPlan, onPlanSelect }: PricingSectionProps) {
  const currentPlanLevel = currentPlan ? planHierarchy[currentPlan] : -1;

  const isPlanDisabled = (planType: PlanType) => {
    const planLevel = planHierarchy[planType];
    // Disable if plan is same or lower than current plan
    return planLevel <= currentPlanLevel;
  };

  const getButtonText = (tier: PricingTier) => {
    if (currentPlan === tier.planType) {
      return "Current Plan";
    }
    if (isPlanDisabled(tier.planType)) {
      return "Not Available";
    }
    if (tier.price === "Custom") {
      return "Contact Sales";
    }
    return "Get Started";
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {pricingTiers.map((tier) => {
        const isDisabled = isPlanDisabled(tier.planType);
        const isCurrent = currentPlan === tier.planType;

        return (
          <Card
            key={tier.name}
            className={`relative p-6 flex flex-col ${tier.popular
                ? "border-2 border-indigo-500 shadow-lg scale-105"
                : ""
              } ${isCurrent
                ? "border-2 border-green-500"
                : ""
              } ${isDisabled && !isCurrent
                ? "opacity-60"
                : ""
              }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
            )}
            {isCurrent && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Current Plan
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-gray-900 mb-2">{tier.name}</h3>
              <div className="mb-1">
                <span className="text-gray-900">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-gray-500">/month</span>}
              </div>
              <p className="text-sm text-gray-500">{tier.conversions} conversions</p>
              <p className="text-xs text-gray-400 mt-1">{tier.pricePerConversion} per conversion</p>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={tier.popular && !isDisabled ? "default" : "outline"}
              className="w-full"
              disabled={isDisabled}
              onClick={() => onPlanSelect?.(tier.planType)}
            >
              {getButtonText(tier)}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}