import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Search,
  Download,
  TrendingUp,
  Calendar,
  User,
  FolderKanban,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  LayoutGrid,
  Table,
} from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface Investment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  project: {
    _id: string;
    title: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  transactionId?: string;
  createdAt: string;
}

const AdminInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/investments');
      setInvestments(response.data.data.investments || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast.error('Failed to fetch investments');
      // Mock data for demo
      setInvestments([
        {
          _id: '1',
          user: {
            _id: 'u1',
            name: 'John Doe',
            email: 'john@example.com',
          },
          project: {
            _id: 'p1',
            title: 'Green Valley Residential Complex',
          },
          amount: 5000,
          status: 'completed',
          transactionId: 'TXN-001',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          user: {
            _id: 'u2',
            name: 'Jane Smith',
            email: 'jane@example.com',
          },
          project: {
            _id: 'p2',
            title: 'SolarTech Energy Farm',
          },
          amount: 10000,
          status: 'completed',
          transactionId: 'TXN-002',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle,
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: Clock,
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: XCircle,
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Clock,
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      investment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || investment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalInvestments = filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const completedCount = filteredInvestments.filter((inv) => inv.status === 'completed').length;
  const pendingCount = filteredInvestments.filter((inv) => inv.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-500 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3 border border-white/30">
                <DollarSign size={18} />
                <span className="text-sm font-semibold">Investments & Payments</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Transactions Overview</h1>
              <p className="text-white/90 text-lg">
                Track all platform transactions • {filteredInvestments.length} total investments
              </p>
            </div>
            <Button className="bg-white text-green-600 hover:bg-white/90 font-bold px-6 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Download size={22} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group bg-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-white opacity-50 group-hover:opacity-100 transition-opacity" />
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Total Volume</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatCurrency(totalInvestments)}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <DollarSign className="text-white" size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group bg-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white opacity-50 group-hover:opacity-100 transition-opacity" />
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{completedCount}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <CheckCircle className="text-white" size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group bg-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-white opacity-50 group-hover:opacity-100 transition-opacity" />
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Clock className="text-white" size={28} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" size={20} />
                <Input
                  placeholder="Search by user, project, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-green-100 focus:border-green-300 rounded-xl"
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {['all', 'completed', 'pending', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    onClick={() => setFilterStatus(status)}
                    className={`capitalize font-semibold px-5 rounded-xl transition-all duration-300 ${
                      filterStatus === status
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg'
                        : 'border-2 border-green-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {status}
                  </Button>
                ))}
                <div className="h-8 w-px bg-green-200 mx-1" />
                <div className="flex gap-1 bg-green-50 p-1 rounded-lg border-2 border-green-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className={`px-3 rounded-md transition-all duration-300 ${
                      viewMode === 'card'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={`px-3 rounded-md transition-all duration-300 ${
                      viewMode === 'table'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    <Table size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investments Display */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-gray-600 mt-4 font-medium">Loading investments...</p>
          </div>
        ) : filteredInvestments.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-20">
              <TrendingUp className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-600 text-lg font-medium">No investments found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : viewMode === 'card' ? (
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                All Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredInvestments.map((investment, index) => {
                  const statusConfig = getStatusConfig(investment.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={investment._id}
                      className="group flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl border-2 border-transparent hover:border-green-200 transition-all duration-300 hover:shadow-lg bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/30"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                          {investment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                            {investment.user.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                            <User size={14} className="text-purple-500" />
                            {investment.user.email}
                          </p>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                          <FolderKanban size={18} className="text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-700 truncate font-medium">{investment.project.title}</p>
                      </div>

                      {/* Amount */}
                      <div className="text-center md:text-right p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                        <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatCurrency(investment.amount)}
                        </p>
                        {investment.transactionId && (
                          <p className="text-xs text-gray-500 mt-1 font-medium">ID: {investment.transactionId}</p>
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <Badge className={`${statusConfig.color} font-semibold shadow-sm`}>
                          <StatusIcon size={14} className="mr-1" />
                          {investment.status}
                        </Badge>
                        <p className="text-xs text-gray-600 flex items-center gap-1 font-medium">
                          <Calendar size={12} className="text-gray-500" />
                          {new Date(investment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                All Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                    <tr>
                      <th className="text-left p-4 font-bold text-gray-700">User</th>
                      <th className="text-left p-4 font-bold text-gray-700">Project</th>
                      <th className="text-right p-4 font-bold text-gray-700">Amount</th>
                      <th className="text-center p-4 font-bold text-gray-700">Status</th>
                      <th className="text-left p-4 font-bold text-gray-700">Transaction ID</th>
                      <th className="text-left p-4 font-bold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestments.map((investment, index) => {
                      const statusConfig = getStatusConfig(investment.status);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <tr
                          key={investment._id}
                          className="border-b border-gray-100 hover:bg-green-50/50 transition-colors duration-200"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                                {investment.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{investment.user.name}</p>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <User size={12} className="text-purple-500" />
                                  {investment.user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                <FolderKanban size={14} className="text-blue-600" />
                              </div>
                              <p className="text-sm text-gray-700 font-medium truncate max-w-xs">{investment.project.title}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-right">
                              <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {formatCurrency(investment.amount)}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge className={`${statusConfig.color} font-semibold shadow-sm`}>
                              <StatusIcon size={14} className="mr-1" />
                              {investment.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {investment.transactionId ? (
                              <p className="text-sm text-gray-700 font-mono font-medium">{investment.transactionId}</p>
                            ) : (
                              <p className="text-sm text-gray-400">N/A</p>
                            )}
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-gray-700 flex items-center gap-1 font-medium">
                              <Calendar size={14} className="text-gray-500" />
                              {new Date(investment.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInvestments;
