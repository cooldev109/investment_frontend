import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  Award,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import api from "@/lib/api";

interface SubscriptionData {
  currentPlan: string;
  planStatus: string;
  renewalDate?: string;
  planDetails: {
    name: string;
    price: number;
    features: string[];
    limits: {
      projectsPerMonth: number;
      simulationsPerMonth: number;
    };
  };
}

const ManageSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchSubscription();
  }, [isAuthenticated, navigate]);

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/subscription/current");
      setSubscription(response.data.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const response = await api.get("/subscription/portal");
      const { url } = response.data.data;
      window.location.href = url;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to access billing portal"
      );
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      await api.post("/subscription/cancel");
      toast.success("Subscription cancellation initiated");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
      setActionLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        icon: CheckCircle,
        className: "bg-green-100 text-green-700",
        label: "Active",
      },
      expired: {
        icon: AlertCircle,
        className: "bg-red-100 text-red-700",
        label: "Expired",
      },
      canceled: {
        icon: AlertCircle,
        className: "bg-gray-100 text-gray-700",
        label: "Canceled",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.expired;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.className}`}
      >
        <Icon className="h-4 w-4" />
        {config.label}
      </div>
    );
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

  if (!subscription) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center pt-16 px-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Subscription Found</CardTitle>
              <CardDescription>
                You don't have an active subscription yet.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => navigate("/pricing")}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                View Plans
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Manage Subscription
            </h1>
            <p className="text-gray-600">
              View and manage your subscription details
            </p>
          </div>

          {/* Current Plan Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl capitalize flex items-center gap-3">
                    <Award className="h-6 w-6 text-primary" />
                    {subscription.planDetails.name} Plan
                  </CardTitle>
                  <CardDescription className="mt-2">
                    ${subscription.planDetails.price}/month
                  </CardDescription>
                </div>
                {getStatusBadge(subscription.planStatus)}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Renewal Date */}
              {subscription.renewalDate && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Next Billing Date
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(subscription.renewalDate)}
                    </p>
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Plan Features
                </h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {subscription.planDetails.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Usage Limits */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription.planDetails.limits.projectsPerMonth === -1
                      ? "∞"
                      : subscription.planDetails.limits.projectsPerMonth}
                  </p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Simulations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription.planDetails.limits.simulationsPerMonth === -1
                      ? "∞"
                      : subscription.planDetails.limits.simulationsPerMonth}
                  </p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {subscription.currentPlan !== "free" && (
              <Button
                onClick={handleManageBilling}
                disabled={actionLoading}
                variant="outline"
                className="w-full"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Manage Billing
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            )}

            <Button
              onClick={() => navigate("/pricing")}
              variant="outline"
              className="w-full"
            >
              View All Plans
            </Button>
          </div>

          {/* Cancel Subscription */}
          {subscription.currentPlan !== "free" &&
            subscription.planStatus === "active" && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Cancel your subscription and downgrade to free plan
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={actionLoading}
                        className="w-full md:w-auto"
                      >
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will cancel your subscription and you will be
                          downgraded to the free plan. You will lose access to
                          premium features at the end of your billing period.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Cancel Subscription
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            )}
        </div>
      </div>
    </>
  );
};

export default ManageSubscription;
