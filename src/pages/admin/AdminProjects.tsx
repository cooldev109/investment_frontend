import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  DollarSign,
  FolderKanban,
  LayoutGrid,
  Table,
} from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface Project {
  _id: string;
  title: string;
  category: string;
  status: 'active' | 'completed' | 'closed';
  targetAmount: number;
  fundedAmount: number;
  roiPercent: number;
  totalInvestors: number;
  durationMonths: number;
  isPremium: boolean;
  createdAt: string;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/projects', {
        params: {
          limit: 100,
        },
      });
      setProjects(response.data.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3 border border-white/30">
                <FolderKanban size={18} />
                <span className="text-sm font-semibold">Project Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Projects Overview</h1>
              <p className="text-white/90 text-lg">
                Manage all investment opportunities • {filteredProjects.length} total projects
              </p>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-white/90 font-bold px-6 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Plus size={22} className="mr-2" />
              Add New Project
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
                <Input
                  placeholder="Search projects by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-purple-100 focus:border-purple-300 rounded-xl"
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {[
                  { key: 'all', label: 'All Projects' },
                  { key: 'active', label: 'Active' },
                  { key: 'completed', label: 'Completed' },
                  { key: 'closed', label: 'Closed' },
                ].map((status) => (
                  <Button
                    key={status.key}
                    variant={filterStatus === status.key ? 'default' : 'outline'}
                    onClick={() => setFilterStatus(status.key)}
                    className={`capitalize font-semibold px-5 rounded-xl transition-all duration-300 ${
                      filterStatus === status.key
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg'
                        : 'border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {status.label}
                  </Button>
                ))}
                <div className="h-8 w-px bg-purple-200 mx-1" />
                <div className="flex gap-1 bg-purple-50 p-1 rounded-lg border-2 border-purple-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className={`px-3 rounded-md transition-all duration-300 ${
                      viewMode === 'card'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
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
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <Table size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Display */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-gray-600 mt-4 font-medium">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-20">
              <FolderKanban className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-600 text-lg font-medium">No projects found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => {
              const progress = (project.fundedAmount / project.targetAmount) * 100;

              return (
                <Card
                  key={project._id}
                  className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group bg-white overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700" />

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200 font-semibold">
                            {project.category}
                          </Badge>
                          <Badge className={`${getStatusColor(project.status)} font-semibold`}>
                            {project.status}
                          </Badge>
                          {project.isPremium && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 font-semibold shadow-md">
                              ⭐ Premium
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Progress Bar */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-purple-50/30 border-2 border-purple-100">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-700 font-semibold">Funding Progress</span>
                        <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
                        <span>{formatCurrency(project.fundedAmount)}</span>
                        <span>{formatCurrency(project.targetAmount)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="group text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-2">
                          <TrendingUp size={16} className="group-hover:scale-110 transition-transform" />
                          <span className="text-lg font-bold">{project.roiPercent}%</span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold">ROI</p>
                      </div>
                      <div className="group text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-center gap-1 text-blue-600 mb-2">
                          <Clock size={16} className="group-hover:scale-110 transition-transform" />
                          <span className="text-lg font-bold">{project.durationMonths}m</span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold">Duration</p>
                      </div>
                      <div className="group text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-center gap-1 text-purple-600 mb-2">
                          <DollarSign size={16} className="group-hover:scale-110 transition-transform" />
                          <span className="text-lg font-bold">{project.totalInvestors}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold">Investors</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t-2 border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600 font-semibold rounded-xl"
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600 font-semibold rounded-xl"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-semibold rounded-xl"
                        onClick={() => handleDelete(project._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200">
                    <tr>
                      <th className="text-left p-4 font-bold text-gray-700">Project</th>
                      <th className="text-left p-4 font-bold text-gray-700">Category</th>
                      <th className="text-left p-4 font-bold text-gray-700">Status</th>
                      <th className="text-right p-4 font-bold text-gray-700">Target</th>
                      <th className="text-right p-4 font-bold text-gray-700">Funded</th>
                      <th className="text-center p-4 font-bold text-gray-700">Progress</th>
                      <th className="text-center p-4 font-bold text-gray-700">ROI</th>
                      <th className="text-center p-4 font-bold text-gray-700">Duration</th>
                      <th className="text-center p-4 font-bold text-gray-700">Investors</th>
                      <th className="text-center p-4 font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project, index) => {
                      const progress = (project.fundedAmount / project.targetAmount) * 100;

                      return (
                        <tr
                          key={project._id}
                          className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors duration-200"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="p-4">
                            <div className="max-w-xs">
                              <p className="font-semibold text-gray-900 truncate">{project.title}</p>
                              {project.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 text-xs mt-1">
                                  ⭐ Premium
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-purple-200 font-semibold">
                              {project.category}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={`${getStatusColor(project.status)} font-semibold`}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right font-bold text-gray-900">
                            {formatCurrency(project.targetAmount)}
                          </td>
                          <td className="p-4 text-right font-bold text-green-600">
                            {formatCurrency(project.fundedAmount)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] rounded-full"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-purple-600 min-w-[3rem] text-right">
                                {progress.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                              <TrendingUp size={14} className="text-green-600" />
                              <span className="text-sm font-bold text-green-600">{project.roiPercent}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                              <Clock size={14} className="text-blue-600" />
                              <span className="text-sm font-bold text-blue-600">{project.durationMonths}m</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 border border-purple-200 rounded-lg">
                              <DollarSign size={14} className="text-purple-600" />
                              <span className="text-sm font-bold text-purple-600">{project.totalInvestors}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600 font-semibold rounded-lg"
                              >
                                <Eye size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600 font-semibold rounded-lg"
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-semibold rounded-lg"
                                onClick={() => handleDelete(project._id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
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

export default AdminProjects;
