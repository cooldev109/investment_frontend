import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progressPercent = (project.fundedAmount / project.targetAmount) * 100;

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-2 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/20 overflow-hidden">
      {project.imageUrl && (
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge className={`absolute top-3 right-3 ${getStatusColor(project.status)} shadow-lg text-white font-medium backdrop-blur-sm`}>
            {project.status}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="line-clamp-1 text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-[#667eea] group-hover:to-[#764ba2] transition-all duration-300">{project.title}</CardTitle>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 font-medium shrink-0">{project.category}</Badge>
        </div>
        <CardDescription className="line-clamp-2 text-gray-600 leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-5 pt-4">
        <div className="space-y-2.5 p-3 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 border border-purple-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">{progressPercent.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5" />
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>{formatCurrency(project.fundedAmount)}</span>
            <span>{formatCurrency(project.targetAmount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-md transition-all duration-300">
            <p className="text-gray-600 font-medium mb-1">ROI</p>
            <p className="font-bold text-lg text-green-600">{project.roiPercent}%</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition-all duration-300">
            <p className="text-gray-600 font-medium mb-1">Duration</p>
            <p className="font-bold text-lg text-blue-600">{project.durationMonths} mo</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md transition-all duration-300 col-span-2">
            <p className="text-gray-600 font-medium mb-1">Min Investment</p>
            <p className="font-bold text-lg text-amber-700">{formatCurrency(project.minInvestment)}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button asChild className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#764ba2] hover:to-[#f093fb] text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn relative overflow-hidden">
          <Link to={`/projects/${project._id}`} className="flex items-center justify-center gap-2">
            <span className="relative z-10">View Details</span>
            <svg className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-[#f093fb] to-[#667eea] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
