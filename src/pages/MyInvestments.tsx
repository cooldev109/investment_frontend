import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface Investment {
  _id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  investmentDate: string;
  expectedReturn: number;
  expectedReturnDate?: string;
  actualReturn?: number;
  actualReturnDate?: string;
  refundReason?: string;
  refundDate?: string;
  projectId: {
    _id: string;
    title: string;
    description: string;
    imageUrl?: string;
    status: string;
    category: string;
  };
  createdAt: string;
}

interface InvestmentStats {
  totalInvested: number;
  totalInvestments: number;
}

export default function MyInvestments() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<InvestmentStats>({ totalInvested: 0, totalInvestments: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [cancelInvestmentId, setCancelInvestmentId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view your investments');
      navigate('/login');
      return;
    }

    fetchInvestments();
  }, [user, navigate]);

  const fetchInvestments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/investments/my-investments');
      setInvestments(response.data.data.investments);
      setStats(response.data.data.summary);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch investments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvestment = async () => {
    if (!cancelInvestmentId) return;

    setIsCancelling(true);
    try {
      await api.post(`/investments/${cancelInvestmentId}/cancel`, {
        reason: 'User requested refund',
      });

      toast.success('Investment cancelled successfully');
      setCancelInvestmentId(null);
      fetchInvestments(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel investment');
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancelInvestment = (investment: Investment): boolean => {
    if (investment.status !== 'completed') return false;

    const investmentDate = new Date(investment.investmentDate);
    const now = new Date();
    const hoursDiff = (now.getTime() - investmentDate.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500',
      refunded: 'bg-gray-500',
    };

    return <Badge className={styles[status] || 'bg-gray-400'}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg" />
            <div className="h-96 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          <Button variant="outline" onClick={fetchInvestments} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">My Investments</h1>
            <p className="text-gray-600">Track and manage your investment portfolio</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Invested</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold">{stats.totalInvestments}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <p className="text-2xl font-bold">
                    {new Set(investments.map((inv) => inv.projectId._id)).size}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Investment History</CardTitle>
              <CardDescription>
                View and manage all your investments. You can cancel within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {investments.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start investing in projects to build your portfolio
                  </p>
                  <Button onClick={() => navigate('/projects')}>Browse Projects</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Expected Return</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investments.map((investment) => (
                        <TableRow key={investment._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {investment.projectId.imageUrl && (
                                <img
                                  src={investment.projectId.imageUrl}
                                  alt={investment.projectId.title}
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="font-semibold">{investment.projectId.title}</p>
                                <p className="text-sm text-gray-600">
                                  {investment.projectId.category}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(investment.amount)}
                          </TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            {formatCurrency(investment.expectedReturn)}
                          </TableCell>
                          <TableCell>{formatDate(investment.investmentDate)}</TableCell>
                          <TableCell>{getStatusBadge(investment.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/projects/${investment.projectId._id}`)}
                              >
                                View Project
                              </Button>
                              {canCancelInvestment(investment) && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setCancelInvestmentId(investment._id)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cancel Confirmation Dialog */}
        <AlertDialog
          open={!!cancelInvestmentId}
          onOpenChange={() => setCancelInvestmentId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Investment?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will refund your investment and remove it from the project. This
                can only be done within 24 hours of the investment. Are you sure you want to
                continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCancelling}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelInvestment}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700"
              >
                {isCancelling ? 'Processing...' : 'Yes, Cancel Investment'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
