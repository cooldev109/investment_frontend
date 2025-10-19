import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  TrendingUp,
  Users,
  FolderKanban,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import api from '../../lib/api';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  totalInvestments: number;
  totalRevenue: number;
  growth: {
    projects: number;
    users: number;
    revenue: number;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalUsers: 0,
    totalInvestments: 0,
    totalRevenue: 0,
    growth: {
      projects: 0,
      users: 0,
      revenue: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      // Fetch project stats
      const projectsResponse = await api.get('/projects/stats');
      const usersResponse = await api.get('/users/stats');
      const investmentsResponse = await api.get('/investments/stats');

      setStats({
        totalProjects: projectsResponse.data.data.total || 0,
        activeProjects: projectsResponse.data.data.active || 0,
        totalUsers: usersResponse.data.data.total || 0,
        totalInvestments: investmentsResponse.data.data.total || 0,
        totalRevenue: investmentsResponse.data.data.totalAmount || 0,
        growth: {
          projects: projectsResponse.data.data.growth || 12.5,
          users: usersResponse.data.data.growth || 8.3,
          revenue: investmentsResponse.data.data.growth || 23.7,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set mock data for demo
      setStats({
        totalProjects: 47,
        activeProjects: 32,
        totalUsers: 1284,
        totalInvestments: 856,
        totalRevenue: 2847500,
        growth: {
          projects: 12.5,
          users: 8.3,
          revenue: 23.7,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      change: stats.growth.projects,
      icon: FolderKanban,
      iconBg: 'from-blue-500 to-indigo-500',
      description: `${stats.activeProjects} active`,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: stats.growth.users,
      icon: Users,
      iconBg: 'from-purple-600 to-indigo-600',
      description: 'Registered investors',
    },
    {
      title: 'Total Investments',
      value: stats.totalInvestments,
      change: stats.growth.revenue,
      icon: TrendingUp,
      iconBg: 'from-green-500 to-emerald-500',
      description: 'Completed transactions',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue / 1000000).toFixed(2)}M`,
      change: stats.growth.revenue,
      icon: DollarSign,
      iconBg: 'from-amber-500 to-orange-500',
      description: 'Platform volume',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] p-10 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -mr-48 -mt-48 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -ml-48 -mb-48 animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl -ml-32 -mt-32 animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30">
              <Activity size={18} />
              <span className="text-sm font-semibold">Admin Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
              Welcome Back, {stats.totalUsers > 0 ? 'Administrator' : 'Admin'}
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
              Your platform is growing! Here's today's overview and key metrics.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;

            return (
              <Card
                key={index}
                className="relative border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group bg-white overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-indigo-50 to-white opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardDescription className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                          {stat.title}
                        </CardDescription>
                        <CardTitle className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          {isLoading ? (
                            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
                          ) : (
                            stat.value
                          )}
                        </CardTitle>
                      </div>
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        <Icon className="text-white" size={28} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600 font-medium">{stat.description}</p>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                          isPositive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        <span>{Math.abs(stat.change)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <FolderKanban className="text-white" size={26} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Add New Project</CardTitle>
                    <CardDescription className="text-gray-600">Create investment opportunity</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <Users className="text-white" size={26} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Manage Users</CardTitle>
                    <CardDescription className="text-gray-600">View and edit user accounts</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <Activity className="text-white" size={26} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">View Analytics</CardTitle>
                    <CardDescription className="text-gray-600">Detailed performance reports</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">Latest platform updates and transactions</CardDescription>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-semibold">
                Live
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[
                { icon: TrendingUp, color: 'from-green-500 to-emerald-500', title: 'New investment in Green Valley Project', desc: 'John Doe invested $5,000', amount: '$5,000', time: '2 hours ago' },
                { icon: Users, color: 'from-blue-500 to-indigo-500', title: 'New user registered', desc: 'Jane Smith joined the platform', amount: 'Premium', time: '3 hours ago' },
                { icon: FolderKanban, color: 'from-purple-600 to-indigo-600', title: 'Project completed successfully', desc: 'SolarTech Energy Farm reached goal', amount: '$1.8M', time: '5 hours ago' },
                { icon: DollarSign, color: 'from-amber-500 to-orange-500', title: 'Payment processed', desc: 'Withdrawal request approved', amount: '$12,500', time: '6 hours ago' },
                { icon: Activity, color: 'from-indigo-500 to-purple-500', title: 'New milestone achieved', desc: '1000+ total investments', amount: '1,000+', time: '1 day ago' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 border-2 border-transparent hover:border-purple-100 hover:shadow-md"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">{item.title}</p>
                      <p className="text-sm text-gray-600 truncate">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{item.amount}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
