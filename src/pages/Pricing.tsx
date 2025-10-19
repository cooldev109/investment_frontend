import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import api from "@/lib/api";

interface Plan {
  name: string;
  price: number;
  priceId: string | null;
  features: string[];
  limits: {
    projectsPerMonth: number;
    simulationsPerMonth: number;
  };
}

interface PlansResponse {
  plans: {
    free: Plan;
    basic: Plan;
    plus: Plan;
    premium: Plan;
  };
}

const Pricing = () => {
  const [plans, setPlans] = useState<PlansResponse["plans"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get("/subscription/plans");
      setPlans(response.data.data.plans);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planKey: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    if (planKey === "free") {
      toast.info("You are already on the free plan");
      return;
    }

    if (user?.planKey === planKey && user?.planStatus === "active") {
      toast.info("You already have this plan");
      return;
    }

    setCheckoutLoading(planKey);
    try {
      const response = await api.post("/subscription/checkout", { planKey });
      const { url } = response.data.data;

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create checkout session");
      setCheckoutLoading(null);
    }
  };

  const getPlanButtonText = (planKey: string): string => {
    if (!isAuthenticated) return "Get Started";
    if (user?.planKey === planKey && user?.planStatus === "active") {
      return "Current Plan";
    }
    if (planKey === "free") return "Free Plan";
    return "Subscribe Now";
  };

  const isPlanDisabled = (planKey: string): boolean => {
    if (!isAuthenticated && planKey !== "free") return false;
    if (user?.planKey === planKey && user?.planStatus === "active") return true;
    return false;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Choose Your Investment Plan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan to unlock powerful investment opportunities
              and analytics
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans && Object.entries(plans).map(([key, plan]) => {
              const isPopular = key === "plus";
              const isCurrent = user?.planKey === key && user?.planStatus === "active";

              return (
                <Card
                  key={key}
                  className={`relative flex flex-col ${
                    isPopular
                      ? "border-primary shadow-xl scale-105"
                      : "border-gray-200"
                  } ${isCurrent ? "ring-2 ring-green-500" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl capitalize">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600">/month</span>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Limits */}
                    <div className="mt-6 pt-4 border-t space-y-2">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Projects:</span>{" "}
                        {plan.limits.projectsPerMonth === -1
                          ? "Unlimited"
                          : `${plan.limits.projectsPerMonth}/month`}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Simulations:</span>{" "}
                        {plan.limits.simulationsPerMonth === -1
                          ? "Unlimited"
                          : `${plan.limits.simulationsPerMonth}/month`}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleSubscribe(key)}
                      disabled={isPlanDisabled(key) || checkoutLoading === key}
                      className={`w-full ${
                        isPopular
                          ? "bg-gradient-to-r from-primary to-secondary"
                          : ""
                      }`}
                      variant={isPopular ? "default" : "outline"}
                    >
                      {checkoutLoading === key ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        getPlanButtonText(key)
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">
              All plans include 24/7 support and regular updates
            </p>
            <p className="text-sm text-gray-500">
              Cancel anytime. No hidden fees. Secure payment through Stripe.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
