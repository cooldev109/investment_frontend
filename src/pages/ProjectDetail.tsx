import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, TrendingUp, DollarSign, Target, Clock } from 'lucide-react';
import InvestmentModal from '../components/InvestmentModal';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  minInvestment: number;
  roiPercent: number;
  targetAmount: number;
  fundedAmount: number;
  durationMonths: number;
  status: 'active' | 'completed' | 'closed';
  imageUrl?: string;
  createdAt: string;
  startDate?: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  const fetchProject = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data.project);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch project');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id, navigate]);

  const handleInvestmentSuccess = () => {
    // Refresh project data to show updated funding
    fetchProject();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="h-96 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const progressPercent = (project.fundedAmount / project.targetAmount) * 100;
  const remainingAmount = project.targetAmount - project.fundedAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        {/* Header Image */}
        {project.imageUrl && (
          <div className="relative h-96 w-full overflow-hidden rounded-lg mb-8">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <Badge className={`absolute top-4 right-4 ${getStatusColor(project.status)}`}>
              {project.status}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{project.category}</Badge>
                <span className="text-sm text-gray-500">
                  Posted on {formatDate(project.createdAt)}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mb-1" />
                  <CardDescription>ROI</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {project.roiPercent}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Clock className="h-4 w-4 text-blue-600 mb-1" />
                  <CardDescription>Duration</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {project.durationMonths}
                    <span className="text-sm font-normal text-gray-500 ml-1">months</span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <DollarSign className="h-4 w-4 text-purple-600 mb-1" />
                  <CardDescription>Min Investment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">
                    {formatCurrency(project.minInvestment)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Target className="h-4 w-4 text-orange-600 mb-1" />
                  <CardDescription>Target</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">
                    {formatCurrency(project.targetAmount)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Details */}
            {project.createdBy && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Manager</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{project.createdBy.name}</p>
                  <p className="text-sm text-gray-600">{project.createdBy.email}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Funding Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold">{progressPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Raised</span>
                    <span className="font-semibold">{formatCurrency(project.fundedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target</span>
                    <span className="font-semibold">{formatCurrency(project.targetAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-semibold">{formatCurrency(remainingAmount)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  disabled={project.status !== 'active'}
                  onClick={() => setIsInvestmentModalOpen(true)}
                >
                  {project.status === 'active' ? 'Invest Now' : 'Not Available'}
                </Button>
              </CardContent>
            </Card>

            {/* ROI Calculator Preview */}
            <Card>
              <CardHeader>
                <CardTitle>ROI Calculator</CardTitle>
                <CardDescription>
                  Calculate your potential returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment</span>
                    <span className="font-semibold">{formatCurrency(project.minInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI ({project.roiPercent}%)</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency((project.minInvestment * project.roiPercent) / 100)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total Return</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(project.minInvestment + (project.minInvestment * project.roiPercent) / 100)}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Open Full Calculator
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Investment Modal */}
        {project && (
          <InvestmentModal
            open={isInvestmentModalOpen}
            onClose={() => setIsInvestmentModalOpen(false)}
            project={project}
            onSuccess={handleInvestmentSuccess}
          />
        )}
      </div>
    </div>
  );
}
