import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-gray-600">
              Processing your subscription...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white pt-16 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              Subscription Successful!
            </h1>

            <p className="text-gray-600 mb-2">
              Thank you for subscribing! Your payment has been processed
              successfully.
            </p>

            <p className="text-sm text-gray-500 mb-8">
              You now have access to all premium features of your selected plan.
            </p>

            {sessionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">Session ID</p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {sessionId}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("/projects")}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                Explore Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={() => navigate("/subscription/manage")}
                variant="outline"
                className="w-full"
              >
                Manage Subscription
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              A confirmation email has been sent to your registered email address.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SubscriptionSuccess;
