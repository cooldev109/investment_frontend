import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-16">
        <div className="text-center px-4">
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Page Not Found
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Path: <code className="bg-gray-200 px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
