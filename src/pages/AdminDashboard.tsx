import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  FolderOpen,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

interface AnalyticsSummary {
  users: {
    total: number;
    active: number;
    byPlan: Array<{ _id: string; count: number }>;
    growthByMonth: Array<{ _id: { year: number; month: number }; count: number }>;
  };
  revenue: {
    monthlyRecurring: number;
    total: number;
    byMonth: Array<{ _id: { year: number; month: number }; revenue: number; count: number }>;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    byCategory: Array<{ _id: string; count: number }>;
    fundingStats: {
      totalTarget: number;
      totalFunded: number;
      avgROI: number;
    };
    topPerforming: Array<{
      _id: string;
      title: string;
      category: string;
      fundedAmount: number;
      targetAmount: number;
      roiPercent: number;
      status: string;
    }>;
  };
  investments: {
    total: number;
    totalAmount: number;
    avgAmount: number;
    byMonth: Array<{ _id: { year: number; month: number }; amount: number; count: number }>;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("You don't have permission to view this page");
      } else {
        setError("Failed to load analytics data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonthLabel = (monthData: { year: number; month: number }) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[monthData.month - 1]} ${monthData.year}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Failed to load analytics"}</p>
            <Button onClick={fetchAnalytics}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const userPlanData = analytics.users.byPlan.map((plan) => ({
    name: plan._id || "Unknown",
    value: plan.count,
  }));

  const categoryData = analytics.projects.byCategory.map((cat) => ({
    name: cat._id || "Other",
    value: cat.count,
  }));

  const revenueChartData = analytics.revenue.byMonth.map((item) => ({
    month: formatMonthLabel(item._id),
    revenue: item.revenue,
    subscriptions: item.count,
  }));

  const investmentChartData = analytics.investments.byMonth.map((item) => ({
    month: formatMonthLabel(item._id),
    amount: item.amount,
    count: item.count,
  }));

  const userGrowthData = analytics.users.growthByMonth.map((item) => ({
    month: formatMonthLabel(item._id),
    users: item.count,
  }));

  const fundingProgress = (analytics.projects.fundingStats.totalFunded / analytics.projects.fundingStats.totalTarget) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Platform performance and key metrics</p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                  <ArrowUpRight size={14} />
                  {((analytics.users.active / analytics.users.total) * 100).toFixed(1)}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{analytics.users.total.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-xs text-muted-foreground mt-2">{analytics.users.active} verified</p>
            </div>

            {/* Revenue */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <DollarSign className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">MRR</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {formatCurrency(analytics.revenue.total)}
              </h3>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatCurrency(analytics.revenue.monthlyRecurring)}/mo
              </p>
            </div>

            {/* Projects */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <FolderOpen className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Activity size={14} />
                  {analytics.projects.active}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{analytics.projects.total}</h3>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-xs text-muted-foreground mt-2">{analytics.projects.completed} completed</p>
            </div>

            {/* Investments */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <TrendingUp className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">AVG</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {formatCurrency(analytics.investments.totalAmount)}
              </h3>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatCurrency(analytics.investments.avgAmount)} avg
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Trend */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Investment Trend */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Investment Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={investmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="amount" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Users by Plan */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Users by Subscription Plan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userPlanData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userPlanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Projects by Category */}
            <div className="bg-card rounded-xl p-6 shadow-card border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Projects by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Projects */}
          <div className="bg-card rounded-xl p-6 shadow-card border border-border mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Projects</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Project</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Funded</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Target</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Progress</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">ROI</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.projects.topPerforming.map((project, index) => {
                    const progress = (project.fundedAmount / project.targetAmount) * 100;
                    return (
                      <tr key={project._id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{project.title}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{project.category}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">
                          {formatCurrency(project.fundedAmount)}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground text-right">
                          {formatCurrency(project.targetAmount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">{progress.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-green-600 text-right">
                          {project.roiPercent}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === "completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <h4 className="text-sm font-medium mb-2 opacity-90">Platform Funding Rate</h4>
              <p className="text-3xl font-bold mb-1">{fundingProgress.toFixed(1)}%</p>
              <p className="text-sm opacity-75">
                {formatCurrency(analytics.projects.fundingStats.totalFunded)} of{" "}
                {formatCurrency(analytics.projects.fundingStats.totalTarget)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <h4 className="text-sm font-medium mb-2 opacity-90">Average Project ROI</h4>
              <p className="text-3xl font-bold mb-1">{analytics.projects.fundingStats.avgROI.toFixed(1)}%</p>
              <p className="text-sm opacity-75">Across all projects</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <h4 className="text-sm font-medium mb-2 opacity-90">Total Investments</h4>
              <p className="text-3xl font-bold mb-1">{analytics.investments.total.toLocaleString()}</p>
              <p className="text-sm opacity-75">{formatCurrency(analytics.investments.totalAmount)} volume</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
