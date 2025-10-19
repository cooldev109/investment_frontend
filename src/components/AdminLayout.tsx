import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Upload,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      description: 'Overview & Analytics',
    },
    {
      name: 'Projects',
      icon: FolderKanban,
      path: '/admin/projects',
      description: 'Manage Projects',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users',
      description: 'User Management',
    },
    {
      name: 'Investments',
      icon: DollarSign,
      path: '/admin/investments',
      description: 'Transactions & Payments',
    },
    {
      name: 'Import',
      icon: Upload,
      path: '/admin/import',
      description: 'Import Projects',
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      description: 'Detailed Reports',
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-indigo-50/20">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-br from-[#1a1f3a] via-[#2d1b4e] to-[#1a1f3a] text-white transition-all duration-300 z-50 shadow-2xl ${
          isSidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 relative">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-400">Manage Platform</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Info */}
        {isSidebarOpen && (
          <div className="px-6 py-4 border-b border-white/10 relative">
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                {user?.name?.charAt(0).toUpperCase()}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-2.5 py-1 rounded-full border border-yellow-400/30 shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-xs text-yellow-200 font-semibold">Admin</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto relative">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] shadow-lg shadow-purple-500/50'
                    : 'hover:bg-white/10 hover:translate-x-1'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl" />
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
                  </>
                )}
                <div className={`relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  <Icon
                    size={22}
                    className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}
                  />
                </div>
                {isSidebarOpen && (
                  <div className="flex-1 relative z-10">
                    <p
                      className={`font-semibold ${
                        isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      } transition-colors`}
                    >
                      {item.name}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-purple-200' : 'text-gray-400 group-hover:text-gray-300'} transition-colors`}>
                      {item.description}
                    </p>
                  </div>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 relative">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-500/20 text-gray-300 hover:text-red-300 transition-all duration-300 group relative overflow-hidden hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <LogOut size={22} className="group-hover:translate-x-1 transition-transform relative z-10" />
            {isSidebarOpen && <span className="font-semibold relative z-10">Logout</span>}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <div className="h-20 bg-white/90 backdrop-blur-xl border-b-2 border-purple-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-600 bg-clip-text text-transparent">
              {menuItems.find((item) => isActivePath(item.path))?.name || 'Admin Dashboard'}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              {menuItems.find((item) => isActivePath(item.path))?.description || 'Welcome back'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-purple-600 font-semibold">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
