import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-red-50 to-white pt-16 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Subscription Cancelled
            </h1>

            <p className="text-gray-600 mb-2">
              Your subscription process was cancelled.
            </p>

            <p className="text-sm text-gray-500 mb-8">
              No charges were made to your account. You can try again whenever
              you're ready.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">
                Why subscribe?
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Access to premium investment projects</li>
                <li>• Advanced ROI calculators and analytics</li>
                <li>• Priority customer support</li>
                <li>• Detailed market reports</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/pricing")}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Need help? Contact our support team at support@investflow.com
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SubscriptionCancel;
