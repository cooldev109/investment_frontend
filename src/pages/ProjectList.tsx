import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import ProjectCard from '../components/ProjectCard';
import Header from '../components/Header';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

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
}

export default function ProjectList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  });

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/projects/categories');
        setCategories(response.data.data.categories);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Active search (applied via Enter or Apply button)
  const [activeSearch, setActiveSearch] = useState(searchParams.get('search') || '');

  // Reset page to 1 when filters change (category/status for instant filtering)
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [category, status, activeSearch]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: pagination.page,
          limit: pagination.limit,
        };

        if (activeSearch) params.search = activeSearch;
        if (category && category !== 'all') params.category = category;
        if (status && status !== 'all') params.status = status;

        const response = await api.get('/projects', { params });

        setProjects(response.data.data.projects);
        setPagination(response.data.data.pagination);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [pagination.page, pagination.limit, activeSearch, category, status]);

  const handleSearch = () => {
    setActiveSearch(search); // This will trigger the fetch
    const params: any = {};
    if (search) params.search = search;
    if (category && category !== 'all') params.category = category;
    if (status && status !== 'all') params.status = status;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setActiveSearch('');
    setCategory('all');
    setStatus('all');
    setSearchParams({});
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investment Projects</h1>
          <p className="text-gray-600">
            Browse and discover investment opportunities
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
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

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                Apply Filters
              </Button>
              <Button onClick={handleClearFilters} variant="outline">
                Clear
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {pagination.total} projects found
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No projects found</p>
            <Button onClick={handleClearFilters} variant="link" className="mt-2">
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={pagination.page === i + 1 ? 'default' : 'outline'}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: i + 1 }))
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </>
  );
}
