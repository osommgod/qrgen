import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Check, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { PlanType } from "../App";

interface CheckoutProps {
    selectedPlan: PlanType;
    onBack: () => void;
    onComplete: () => void;
}

const planDetails: Record<PlanType, { name: string; price: string; features: string[] }> = {
    free: {
        name: "Free",
        price: "$0",
        features: ["10 conversions/month", "Basic features"],
    },
    starter: {
        name: "Starter",
        price: "$9",
        features: ["100 conversions/month", "Basic QR designs", "PNG download"],
    },
    professional: {
        name: "Professional",
        price: "$29",
        features: ["500 conversions/month", "Custom colors", "PNG & SVG", "Analytics"],
    },
    business: {
        name: "Business",
        price: "$79",
        features: ["2,000 conversions/month", "Advanced features", "API access", "Priority support"],
    },
    enterprise: {
        name: "Enterprise",
        price: "Custom",
        features: ["Unlimited conversions", "White-label", "Dedicated support"],
    },
};

export function Checkout({ selectedPlan, onBack, onComplete }: CheckoutProps) {
    const [loading, setLoading] = useState(false);
    const plan = planDetails[selectedPlan];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            alert(`Payment successful! You've been upgraded to ${plan.name} plan.`);
            onComplete();
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="mb-6 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Pricing
                </Button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        <Card className="p-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{plan.name} Plan</h3>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">
                                    {plan.price}
                                    {plan.price !== "Custom" && <span className="text-lg text-gray-500">/month</span>}
                                </p>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">What's included:</h4>
                                <ul className="space-y-2">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t pt-4 mt-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Total due today:</span>
                                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Payment Form */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
                        <Card className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Card Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="cardNumber"
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Cardholder Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="cardName">Cardholder Name</Label>
                                    <Input
                                        id="cardName"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                {/* Expiry and CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            type="text"
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            type="text"
                                            placeholder="123"
                                            maxLength={3}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <Lock className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-green-700">
                                        Your payment information is encrypted and secure. We never store your card details.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            Complete Purchase
                                        </>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
