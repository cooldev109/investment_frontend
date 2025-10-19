import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Search,
  SlidersHorizontal,
  TrendingUp,
  DollarSign,
  Calendar,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  roiPercent: number;
  targetAmount: number;
  fundedAmount: number;
  minInvestment: number;
  durationMonths: number;
  status: string;
  imageUrl?: string;
}

interface PlanFeatures {
  name: string;
  searchFilters: {
    basicFilters: boolean;
    roiRange: boolean;
    amountRange: boolean;
    multipleCategories: boolean;
    advancedSort: boolean;
    durationFilter: boolean;
  };
}

export default function PremiumDatabase() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [planFeatures, setPlanFeatures] = useState<PlanFeatures | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minROI, setMinROI] = useState("");
  const [maxROI, setMaxROI] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access Premium Database");
      navigate("/login");
      return;
    }
    fetchCategories();
    handleSearch();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/projects/categories");
      setCategories(response.data.data.categories);
    } catch (error: any) {
      toast.error("Failed to load categories");
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchData: any = {
        page,
        limit: 20,
      };

      // Basic filters
      if (search) searchData.search = search;
      if (category) searchData.category = category;
      if (status) searchData.status = status;

      // Advanced filters
      if (selectedCategories.length > 0) {
        searchData.categories = selectedCategories;
      }
      if (minROI) searchData.minROI = parseFloat(minROI);
      if (maxROI) searchData.maxROI = parseFloat(maxROI);
      if (minAmount) searchData.minAmount = parseFloat(minAmount);
      if (maxAmount) searchData.maxAmount = parseFloat(maxAmount);
      if (minDuration) searchData.minDuration = parseInt(minDuration);
      if (maxDuration) searchData.maxDuration = parseInt(maxDuration);

      // Sorting
      if (sortBy !== "createdAt" || sortOrder !== "desc") {
        searchData.sortBy = sortBy;
        searchData.sortOrder = sortOrder;
      }

      const response = await api.post("/projects/search", searchData);
      setProjects(response.data.data.projects);
      setPlanFeatures(response.data.data.planFeatures);
      setTotal(response.data.data.pagination.total);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Search failed";
      toast.error(errorMsg);

      // If it's a plan restriction error, show upgrade prompt
      if (error.response?.status === 403) {
        // Plan restriction error
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setSelectedCategories([]);
    setMinROI("");
    setMaxROI("");
    setMinAmount("");
    setMaxAmount("");
    setMinDuration("");
    setMaxDuration("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const FeatureLock = ({ featureName }: { featureName: string }) => (
    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
      <Lock className="h-4 w-4" />
      <span>
        {featureName} requires {getPlanRequired(featureName)} plan
      </span>
      <Button
        variant="link"
        size="sm"
        onClick={() => navigate("/pricing")}
        className="text-amber-600 hover:text-amber-700"
      >
        Upgrade <Crown className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );

  const getPlanRequired = (feature: string) => {
    if (feature.includes("ROI")) return "Basic";
    if (feature.includes("Amount") || feature.includes("Duration")) return "Plus";
    if (feature.includes("Advanced")) return "Premium";
    return "Plus";
  };

  const hasAccess = (feature: keyof PlanFeatures["searchFilters"]) => {
    return planFeatures?.searchFilters[feature] || false;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <SlidersHorizontal className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Premium Database</h1>
                <p className="text-gray-600">
                  Advanced search and filtering for investment projects
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="mt-2">
              Your Plan: {user?.planKey?.toUpperCase() || "FREE"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Filters
                  </CardTitle>
                  <CardDescription>Refine your search</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Project name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ROI Range (Basic+) */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      ROI Range (%)
                    </Label>
                    {hasAccess("roiRange") ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={minROI}
                          onChange={(e) => setMinROI(e.target.value)}
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          value={maxROI}
                          onChange={(e) => setMaxROI(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mt-2">
                        <FeatureLock featureName="ROI Range Filter" />
                      </div>
                    )}
                  </div>

                  {/* Amount Range (Plus+) */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Amount Range
                    </Label>
                    {hasAccess("amountRange") ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={minAmount}
                          onChange={(e) => setMinAmount(e.target.value)}
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          value={maxAmount}
                          onChange={(e) => setMaxAmount(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mt-2">
                        <FeatureLock featureName="Amount Range Filter" />
                      </div>
                    )}
                  </div>

                  {/* Duration Filter (Plus+) */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Duration (months)
                    </Label>
                    {hasAccess("durationFilter") ? (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={minDuration}
                          onChange={(e) => setMinDuration(e.target.value)}
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          value={maxDuration}
                          onChange={(e) => setMaxDuration(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mt-2">
                        <FeatureLock featureName="Duration Filter" />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? "Searching..." : "Apply Filters"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleClearFilters}
                    >
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-4">
              {/* Sort Controls (Premium) */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {total} projects found
                    </div>
                    {hasAccess("advancedSort") ? (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Sort by:</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="createdAt">Date</SelectItem>
                            <SelectItem value="roiPercent">ROI</SelectItem>
                            <SelectItem value="targetAmount">
                              Target Amount
                            </SelectItem>
                            <SelectItem value="fundedAmount">
                              Funded Amount
                            </SelectItem>
                            <SelectItem value="durationMonths">
                              Duration
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desc">Descending</SelectItem>
                            <SelectItem value="asc">Ascending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <FeatureLock featureName="Advanced Sorting" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Project Cards */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Searching projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">
                      No projects found matching your criteria
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {projects.map((project) => (
                    <Card
                      key={project._id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {project.imageUrl && (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">
                                  {project.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {project.description}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  project.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-4">
                              <div>
                                <p className="text-xs text-gray-500">ROI</p>
                                <p className="font-semibold text-green-600">
                                  {project.roiPercent}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Target</p>
                                <p className="font-semibold">
                                  {formatCurrency(project.targetAmount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Funded</p>
                                <p className="font-semibold">
                                  {formatCurrency(project.fundedAmount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-semibold">
                                  {project.durationMonths}mo
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-2 px-4">
                        Page {page} of {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
